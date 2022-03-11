App.controller('QuickBarSettingsController', ['$scope', '$location', '$rootScope', 'activityService', function($scope, $location, $rootScope, activityService) {

    $scope.saveChanges = function() {
        chrome.storage.sync.set({
            'appsSET1': angular.copy($rootScope.apps)
        });
        chrome.storage.sync.set({
            'hiddenAppsSET1': angular.copy($rootScope.hiddenApps)
        });
        $location.path('/');
    }

    $scope.qbOptions = {
        beforeDrop: function(event) {
            if ($rootScope.destIndex != undefined) {
                $rootScope.hiddenApps.splice(event.dest.index, 1, angular.copy($rootScope.apps[$rootScope.destIndex]) );
            }
        },
        dropped: function(event) {
            if ($rootScope.destIndex != undefined) {
                $rootScope.apps.splice($rootScope.destIndex, 1, angular.copy(event.source.nodeScope.$modelValue) );
                delete $rootScope.destIndex;
            }
        }
    }

    $scope.closeTip = function() {
        $rootScope.activity.quickBarTipWatched = true;
        activityService.save();
    }

}]);
