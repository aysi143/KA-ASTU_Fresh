App.controller('WeatherController', ['$scope', '$http', 'cacheService', '$filter', '$rootScope', '$timeout', '$document', 'ngDialog', 'weatherService',
function($scope, $http, cacheService, $filter, $rootScope, $timeout, $document, ngDialog, weatherService) {

    $scope.dayOfWeek = $filter('date')(Date.now(), 'EEEE');

    $scope.unit = 'c';

    $scope.loadingCounter = 0;

    $scope.getWeather = function() {
    	$scope.loadingCounter++;

    	cacheService.get(
    		'weather',
    		'https://pro.openweathermap.org/data/2.5/weather?lat='+ encodeURIComponent($rootScope.weatherSettings.city.lat) +'&lon='+ encodeURIComponent($rootScope.weatherSettings.city.lon) +'&mode=json&units=metric&appid='+ WEATHER_APPID,
            function(response) {
                weatherService.weatherCallback(response);
                $scope.loadingCounter--;
            }
    	);

    	$scope.getHourlyForecast();
    	$scope.getDailyForecast();
    }

    $scope.getHourlyForecast = function() {
    	$scope.loadingCounter++;
    	cacheService.get(
    		'hourlyForecast',
    		'https://pro.openweathermap.org/data/2.5/forecast?lat='+ encodeURIComponent($rootScope.weatherSettings.city.lat) +'&lon='+ encodeURIComponent($rootScope.weatherSettings.city.lon) +'&mode=json&units=metric&cnt=8&appid='+ WEATHER_APPID,
    		function(response) {
                weatherService.hourlyForecastCallback(response);
                $scope.loadingCounter--;
            }
    	);
    }

    $scope.getDailyForecast = function() {
    	$scope.loadingCounter++;
    	cacheService.get(
    		'dailyForecast',
    		'https://pro.openweathermap.org/data/2.5/forecast/daily?lat='+ encodeURIComponent($rootScope.weatherSettings.city.lat) +'&lon='+ encodeURIComponent($rootScope.weatherSettings.city.lon) +'&mode=json&units=metric&cnt=6&appid='+ WEATHER_APPID,
    		function(response) {
                weatherService.dailyForecastCallback(response);
                $scope.loadingCounter--;

                $timeout(function(){
                    $scope.$apply()
                }, 0);
            }
    	);
    }

    $rootScope.$watch('weatherSettings.city', function(newValue, oldValue) {
    	if ((!oldValue && newValue) || (oldValue && newValue)) {
    		$scope.getWeather();
    	}
    });

}]);
