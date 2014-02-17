'use strict';
/*gloabl Parse:false*/

var linesControllers = angular.module('linesControllers', []);
linesControllers
  .controller('LineIndexController', ['$scope', '$location', 'lines', 'ParseCloudCodeAngular',
    function ($scope, $location, lines, ParseCloudCodeAngular) {
        $scope.lines = lines.models;
        console.log('after lines')

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
    }])