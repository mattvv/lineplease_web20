'use strict';
/*global moment:false */

angular.module('linepleaseApp').
  filter('fromNow', function() {
    return function(dateString) {
      return moment(new Date(dateString)).fromNow();
    };
  });