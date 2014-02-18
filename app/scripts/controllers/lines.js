'use strict';
/*gloabl Parse:false*/

var linesControllers = angular.module('linesControllers', []);
linesControllers
  .controller('LineIndexController', ['LineService', '$stateParams', '$scope', '$location', 'lines', 'ParseCloudCodeAngular', '_', '$rootScope',
    function (LineService, $stateParams, $scope, $location, lines, ParseCloudCodeAngular, _, $rootScope) {
        $scope.lines = lines.models;
        $scope.gender = 'female';
        console.log('script ID is ' + $stateParams.scriptId);

        $scope.autocompleteOptions = {
            options: {
                html: true,
                focusOpen: true,
                onlySelect: false, 
                source: function(request, response) {
                    var data = $scope.autocompleteOptions.methods.filter($scope.characters, request.term);

                    response(data);
                }
            }
        }

        //cache the characters into an array so we can use autocomplete later
        $scope.cacheCharacters = function() {
            $scope.characters = [];
            _.each($scope.lines, function(line) {
                //if the character is not in the list, add it.
                if (!_.contains($scope.characters, line.get('character'))) {
                    $scope.characters.push(line.get('character'));
                }
            }); 
        }

        $scope.cacheCharacters();

        //ability to re-order lines by dragging!
        $scope.sortableOptions = {
            update: function(e, ui) {
                //filter through the lines we have already to find the one we selected
                for (var count in $scope.lines) {
                    var line = $scope.lines[count]
                    if (line.id === $(ui.item).attr('id')) {
                        console.log('reordering line!')
                        ParseCloudCodeAngular('reorderLines', {lineId: line.id, position: $(ui.item).index()});
                    }
                }
            }
        }

        $scope.$watch('character', function(newCharacter) {
            if (typeof newCharacter != 'undefined' && newCharacter.length > 0)
                $scope.character = newCharacter.toUpperCase();
        });

        $scope.createLine = function(character, linetext, gender) {
            var line = new LineService.model();
            line.set('scriptId', $stateParams.scriptId);
            line.set('character', character.toUpperCase());
            line.set('line', linetext);
            line.set('gender', gender);
            //todo: loading screen
            $rootScope.isViewLoading = true;
            line.saveParse().then(function(line) {
                $rootScope.isViewLoading = false;
                $scope.linetext = '';
                //todo: refresh lines array!
                $scope.lines.push(line);
                $scope.cacheCharacters();
            }, function(error) {
                $rootScope.isViewLoading = false;
                console.log('Error!! ' + JSON.stringify(error));
            });
        }

        $scope.removeLine = function(line) {
            $rootScope.isViewLoading = true;
            line.deleteLine().then(function() {
              var index = $scope.lines.indexOf(line);

              if (index > -1) {
                $scope.lines.splice(index, 1);
              }
              $rootScope.isViewLoading = false;
            }, function(error) {
                $rootScope.isViewLoading = false;
                console.log('could not delete line ' + error);
            });
          }
    }])