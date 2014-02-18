'use strict';
/*global Parse:false */

angular.module('ParseServices', [])

.factory('ExtendParseSDK', ['ParseAbstractService', function(ParseAbstractService) {

  Parse.Object.extendAngular = function(options) {
    return ParseAbstractService.EnhanceObject(Parse.Object.extend(options));
  };

  Parse.Collection.extendAngular = function(options) {
    return ParseAbstractService.EnhanceCollection(Parse.Collection.extend(options));
  };

}])

.factory('ParseSDK', function() {

  // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
  Parse.initialize('vO4vcHp53pKE9WC4nmljDP2a5RzbYXVP7wvZkFo5', 'gsowB2J7bIfN6aGnFQ95wciSmuUJDvdtcUvx3qUU');

  // FACEBOOK init
  window.fbPromise.then(function() {

    Parse.FacebookUtils.init({

      // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
      appId: 192662437476636, // Facebook App ID
      channelUrl: 'http://app.linepleaseapp.com/', // Channel File
      cookie: true, // enable cookies to allow Parse to access the session
      xfbml: true, // parse XFBML
      frictionlessRequests: true // recommended
    });

    // FB.getLoginStatus(function(response) {
    //   if (response.status === 'connected') {
    //     console.log("USER IS CONNECTED!");
    //   }
    // })

  });

});