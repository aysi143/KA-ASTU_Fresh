App.controller('PageController', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {

    $scope.loading = true;

    $http.get('https://'+ DOMAIN_NAME +'/' + $routeParams.name + '?iframe').then( function(data) {
        $scope.content = data.data;
        $scope.loading = false;
    });

}]);
