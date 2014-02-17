'use strict';
/*gloabl Parse:false*/

var linesControllers = angular.module('linesControllers', []);
linesControllers
  .controller('LineIndexController', ['LineService', '$stateParams', '$scope', '$location', 'lines', 'ParseCloudCodeAngular', '_',
    function (LineService, $stateParams, $scope, $location, lines, ParseCloudCodeAngular, _) {
        $scope.lines = lines.models;
        console.log('script ID is ' + $stateParams.scriptId);

        $scope.autocompleteOptions = {
            options: {
                html: true,
                focusOpen: true,
                onlySelect: true, 
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
            console.log('new line! adding it! with ' + linetext + ' and gender: ' + gender);
            line.saveParse().then(function(line) {
                $scope.linetext = '';
                //todo: refresh lines array!
                $scope.lines.push(line);
                $scope.cacheCharacters();
            }, function(error) {
                console.log('Error!! ' + JSON.stringify(error));
            });
        }
    }])