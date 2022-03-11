App.controller('NotesController', ['$scope', '$document',
function($scope, $document) {

    $scope.showList = false;

    $scope.openedNote = 0;

    $document.on('click keydown', function(event) {
        if (event.target.tagName == 'TEXTAREA' || event.keyCode == 27) {
            $scope.showList = false;
            $scope.$apply();
        }
    });

    $scope.addNote = function() {
        if ($scope.notes[0] && $scope.notes[0].body != '') {
            $scope.notes.unshift({
                'created': Date.now(),
                'title': 'Another Note',
                'body': ''
            });
        }
        $scope.openNote(0);
        $scope.showList = false;
        document.querySelector('textarea.note').focus();
    }

    $scope.openNote = function(index) {
        $scope.openedNote = index;
        $scope.showList = false;
        document.querySelector('textarea.note').focus();
    }

    $scope.editNote = function() {
        var title = $scope.notes[$scope.openedNote].body.split('\n')[0];
        $scope.notes[$scope.openedNote].title = title ? title : 'Another Note';
        $scope.save();
    }

    $scope.save = function() {
        chrome.storage.sync.set({
            'notes': $scope.notes
        });
    }

    $scope.getNotes = function() {
        chrome.storage.sync.get('notes', function(data) {
            if (data.notes) {
                $scope.notes = data.notes;
            } else {
                $scope.notes = [];

            }
            $scope.$apply();
        });
    }

    $scope.getNotes();

    $scope.removeNote = function(item, event) {
        event.stopPropagation();
        var index = $scope.notes.indexOf(item);
        $scope.notes.splice(index, 1);
        $scope.save();
    }

    $scope.notesOptions = {
        dropped: function(event) {
            $scope.save();
        }
    };

}]);
