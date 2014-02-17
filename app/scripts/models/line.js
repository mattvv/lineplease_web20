'use strict';
/*global Parse:false */

angular.module('ExternalDataServices')

.factory('LineService', [function() {
  var Line = Parse.Object.extendAngular({
    className:'Line'
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