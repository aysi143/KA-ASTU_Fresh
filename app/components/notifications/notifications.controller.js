App.controller('notificationsController', ['$rootScope', '$scope', '$document', 'ngDialog', 'notificationService',
function($rootScope, $scope, $document, ngDialog, notificationService) {

    $scope.$on('ngDialog.opened', function (e, $dialog) {
        if ($rootScope.activeNotification == 'sharing') {
            notificationService.removeActiveNotification();
        }
    });

}]);
