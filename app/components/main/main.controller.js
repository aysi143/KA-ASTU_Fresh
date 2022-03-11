App.controller('MainController', ['$scope', '$rootScope', '$location', '$filter', 'cacheService', 'ngDialog', '$timeout', '$document', 'bgService', 'activityService', 'weatherService', '$http', '$interval', 'notificationService',
function($scope, $rootScope, $location, $filter, cacheService, ngDialog, $timeout, $document, bgService, activityService, weatherService, $http, $interval, notificationService) {

    angular.element( document ).ready( function(){
        var searchBar = document.querySelector( '.search-form__query' );
        ['mouseover' , 'click' , 'keydown' , 'focus'].forEach( function( el ){
            searchBar.addEventListener( el , function( event ){
                this.classList.add( 'activeSearch' );
            });
        });
        ['mouseout' , 'blur'].forEach( function( el ){
            searchBar.addEventListener( el , function( event ){
                if( searchBar != document.activeElement ){
                    this.classList.remove( 'activeSearch' );
                }
            });
        });
        searchBar.focus();
    });
    
    extScope = $scope;

    // Search
    $rootScope.searchType = 'web';

    $scope.extensionName = chrome.runtime.getManifest().name;

    $rootScope.userTimezoneOffset = $filter('date')(Date.now(), 'Z');

    $scope.promoWatched = false;
    // document.querySelector('.search-form__query').focus();

    $( document.querySelectorAll('.tabs__item') ).on('click', function() {
        $rootScope.searchType = $(this).text().toLowerCase();
        document.querySelector('.search-form__query').focus();
        $rootScope.$apply();
    });

    $document.on('click keydown', function(event) {
        if ( event.keyCode == 27 || closest(event.target, '.content') && !closest(event.target, '.apps__item') ) {
            $scope.closeSidebar();
        }
    });

    $scope.closeSidebar  = function() {
        if ($scope.firstRun) $scope.firstRun = false;
        $location.path('/');
    }

    // Sidebar
    $scope.$location = $location;

    $scope.sidebarHidden = true;

    $scope.$on('$routeChangeSuccess', function(next, current) {
        if ($scope.$location.path() !== '/' && $scope.$location.path().indexOf('/page') != 0) {
            $scope.sidebarHidden = false;
        } else {
            $scope.sidebarHidden = true;
        }
    });

    // City
    var defaultCity = {
        'name': 'New York',
        'lat': '40.7127837',
        'lon': '-74.0059413',
        'tz_offset': '-0400'
    };

	$scope.getCity = function() {
		cacheService.get('city', 'https://yatab.net/city.php', function(response) {
            try {
                if (response.data.city == 'empty') {
                    $rootScope.city = defaultCity;
                } else {
                    $rootScope.city = {
                        'name': response.data.city,
                        'lat': response.data.location.latitude,
                        'lon': response.data.location.longitude,
                        'tz_offset': $rootScope.userTimezoneOffset
                    };
                }
            } catch (ev) {
                $rootScope.city = defaultCity;
            }

            chrome.storage.local.get('weatherSettings', function(data) {

                $rootScope.weatherSettings = data.weatherSettings;
                if (!$rootScope.weatherSettings) {
                    $rootScope.weatherSettings = {
                        city: $rootScope.city,
                        units: 'c'
                    }
                } else {
                    $rootScope.city = $rootScope.weatherSettings.city;
                }

                weatherService.getCurrentWeather();

                $rootScope.$apply();
            });
        });
	};

	$scope.getCity();

    chrome.storage.sync.get('settings', function(data) {
        $scope.settings = data.settings;
        if (!$scope.settings) {
            $scope.settings = {
                'bookmarksBar': false,
                'apps': true,
                'showLogo': true,
                'darkTheme': false
            }
        }
        $scope.$apply();
    });

    chrome.storage.sync.get('pauseAnimation', function(data) {
        if (!data.pauseAnimation) {
            $scope.pauseAnimation = pauseAnimation = false;
        } else {
            $scope.pauseAnimation = pauseAnimation = data.pauseAnimation;
        }
    });

    $scope.togglePause = function() {
        $scope.pauseAnimation = pauseAnimation = !$scope.pauseAnimation;
        if ($rootScope.background.bg == 'anim_03' || $rootScope.background.bg == 'anim_05' ) {
            lottie.togglePause();
        }
        chrome.storage.sync.set({
			'pauseAnimation': $scope.pauseAnimation
		});
    }

    // Activity
    activityService.getActivity();

    $scope.showPopup = function(popup) {
        ngDialog.open({
            template: '/app/components/'+ popup +'/'+ popup +'.view.html',
        });
    }

    // Background
    bgService.getBgSettings();

    chrome.storage.sync.get('todo', function(data) {
        if (data.todo) {
            $rootScope.todoCount = $filter('filter')(data.todo, {'done': false}).length;
        } else {
            $rootScope.todoCount = 0;
        }
        $scope.$apply();
    });

    $scope.openSharingPopup = function() {

        if ($rootScope.activeNotification == 'sharing') {
            notificationService.removeActiveNotification();
        }

        let sharingDialog = ngDialog.open({
            template: '/app/components/sharing/sharing.view.html',
        });

        sharingDialog.closePromise.then(function(data) {
            $scope.unlockBackgrounds(data);
        });
    }

    $scope.unlockBackgrounds = function(data) {
        if (data.value === 'shared') {
            $rootScope.background.unlocked = true;
            bgService.saveBgSettings($rootScope.background);
        }
    }

    $rootScope.promo = {
        enabled: false
    }

    chrome.storage.sync.get('firstRun', function(data) {
        if (data.firstRun == undefined) {
            $scope.firstRun = true;
            chrome.storage.sync.set({
    			'firstRun': false
    		});
            $location.path('/settings');
        } else {
            $scope.firstRun = false;
        }
    });

    $scope.closeTip = function() {
        $scope.firstRun = false;
        $location.path('/');
    }


    chrome.storage.sync.get('appsSET1', function(data) {
        if (!data.appsSET1) {
            $rootScope.apps = [
                {name: 'Weather', url: '/weather', icon: 'icon_weather_logo.png'},
                {name: 'To-Do', url: '/to-do', icon: 'icon_to-do_logo.png'},
                {name: 'Notes', url: '/notes', icon: 'icon_note_logo.png'},
                {name: 'Bookmarks', url: '/bookmarks', icon: 'icon_bookmarks_logo.png'},
                // {name: 'History', url: '/history', icon: 'icon_history_logo.png'}
            ];
        } else {
            $rootScope.apps = data.appsSET1;
        }
    });


    $scope.appsOptions = {
        accept: function(sourceNodeScope, destNodesScope, destIndex) {
            if (sourceNodeScope.$parent.$modelValue == destNodesScope.$modelValue) {
                return true;
            } else {
                $rootScope.destIndex = destIndex;
                var icon, name = $rootScope.apps[destIndex].name;
                if (name == 'Weather') {
                    icon = '<i class="w-icon_64px w-icon_'+ $rootScope.weather.icon +' w-icon_'+ $rootScope.weather.icon +'" width=42></i>';
                } else {
                    icon = '<img src="img/'+ $rootScope.apps[destIndex].icon +'"/>';
                }
                document.querySelector('.quick-bar .angular-ui-tree-hidden').innerHTML = '<a class="apps__item"><span class="apps__icon">'+ icon +'</span><span class="apps__title">'+ name +'</span></a>';
            }
        },
        dropped: function(event) {
            if (event.source.index == event.dest.index) {
                $scope.goTo(event.source.nodeScope.item.url);
            } else {
                if ($location.path() != '/quick-bar') {
                    chrome.storage.sync.set({
                        'appsSET1': angular.copy($rootScope.apps)
                    });
                    chrome.storage.sync.set({
                        'hiddenAppsSET1': angular.copy($rootScope.hiddenApps)
                    });
                }
            }
        }
    }

    $scope.goTo = function(url) {
        if (url[0] == '/') {
            $location.path(url);
        } else {
            window.location.href = url;
        }
    }

    notificationService.getNotifications();

    $scope.showNotifications = function() {
		var notificationsDialog = ngDialog.open({
		  template: '/app/components/notifications/notifications.view.html',
          controller: 'notificationsController',
		  className: 'ngdialog-theme-default notifications' + ( $filter('requireAction')($rootScope.notifications).length > 1 ? ' notifications_multiple' : '')
		});

		notificationsDialog.closePromise.then(function(data) {
			$rootScope.notifications.forEach(function(item) {
				notificationService.markNotificationAsRead(item.id);
			})
			$scope.unlockBackgrounds(data);
		});
	}

	$scope.removeActiveNotification = function() {
		notificationService.removeActiveNotification();
	}

    $scope.openActiveNotification = function() {
        if ($rootScope.activeNotification == 'sharing') {
            $scope.openSharingPopup();
            notificationService.removeActiveNotification();
        }
    }

}]);
