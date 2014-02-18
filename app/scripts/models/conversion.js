'use strict';
/*global Parse:false */

angular.module('ExternalDataServices')

.factory('ConversionService', ['ParseCloudCodeAngular', function(ParseCloudCodeAngular) {
  var Conversion = Parse.Object.extendAngular({
    className:'Conversion',
    enqueue: function() {
      console.log('queuing!');
      return ParseCloudCodeAngular('conversion', {conversionId: this.id});
    }
  });

  var Conversions = Parse.Collection.extendAngular({
    model: Conversion,
    query: (new Parse.Query(Conversion)),
    comparator: function(model) {
      return -model.createdAt.getTime();
    },
    loadMyConversions: function() {
      this.query = new Parse.Query(Conversion);
      this.query.equalTo('username', Parse.User.current().get('username'));
      return this.load();
    }
  });
  
  return {
    model: Conversion,
    collection: Conversions
  };
}]);