angular.module('app.controllers', [])

.controller('homeTabDefaultPageCtrl', function($scope) {

})

.controller('inputTabDefaultPageCtrl', function($scope, $cordovaCamera) {

    $scope.takePhoto = function () {
        var options = {
          quality: 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
      };

          $cordovaCamera.getPicture(options).then(function (imageData) {
              $scope.imgURI = "data:image/jpeg;base64," + imageData;
          }, function (err) {
              // An error occured. Show a message to the user
          });
      }

      $scope.choosePhoto = function () {
         var options = {
           quality: 75,
           destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
           allowEdit: true,
           encodingType: Camera.EncodingType.JPEG,
           targetWidth: 300,
           targetHeight: 300,
           popoverOptions: CameraPopoverOptions,
           saveToPhotoAlbum: false
       };

           $cordovaCamera.getPicture(options).then(function (imageData) {
               $scope.imgURI = "data:image/jpeg;base64," + imageData;
           }, function (err) {
               // An error occured. Show a message to the user
           });
       }


})

.controller('statsTabDefaultPageCtrl', function($scope) {

})

.controller('mapDefaultPageCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

.controller('myRecentActivityCtrl', function($scope) {

})

.controller('myStatsCtrl', function($scope) {

})
