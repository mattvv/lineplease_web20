'use strict';
/*global Parse:false */

angular.module('ExternalDataServices')

.factory('LineService', ['ParseCloudCodeAngular', function(ParseCloudCodeAngular) {
  var Line = Parse.Object.extendAngular({
    className:'Line',
    deleteLine: function() {
      return ParseCloudCodeAngular('removeLine', {lineId: this.id});
    }
  });

  var Lines = Parse.Collection.extendAngular({
    model: Line,
    query: (new Parse.Query(Line)),
    comparator: function(model) {
      return -model.position;
    },
    loadLines: function(scriptId) {
      this.query = new Parse.Query(Line);
      this.query.equalTo('scriptId', scriptId);
      this.query.limit(1000);
      this.query.ascending('position');
      return this.load();
    }
  });
  
  return {
    model: Line,
    collection: Lines
  };
}]);