'use strict';
/*global Parse:false */

angular.module('ExternalDataServices')

.factory('ScriptService', ['ParseCloudCodeAngular', function(ParseCloudCodeAngular) {
  var Script = Parse.Object.extendAngular({
    className:'Script',
    deleteScript: function() {
      return ParseCloudCodeAngular('removeScript', {scriptId: this.id});
    }
  });

  var Scripts = Parse.Collection.extendAngular({
    model: Script,
    query: (new Parse.Query(Script)),
    comparator: function(model) {
      return -model.createdAt.getTime();
    },
    loadMyScripts: function() {
      var usernameQuery = new Parse.Query(Script);
      usernameQuery.equalTo('username', Parse.User.current().get('username'));

      // var userQuery = new Parse.Query(Script);
      // userQuery.equalTo('user', Parse.User.current());

      this.query = Parse.Query.or(usernameQuery);
      return this.load();
    }
  });
  
  return {
    model: Script,
    collection: Scripts
  };
}]);