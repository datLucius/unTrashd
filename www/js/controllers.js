angular.module('app.controllers', [])

.controller('homeTabDefaultPageCtrl', function($scope) {

})

.controller('inputTabDefaultPageCtrl', function($scope, itemService, $cordovaCamera, $ionicPlatform, geoLocationService ) {

  $scope.$on('$ionicView.enter', function() {

  geoLocationService.getLocation().then(function(result){
           $scope.location = result
         })
})
  $scope.form = {};

  var vm = this;

    // Initialize the database.
 $ionicPlatform.ready(function() {
     itemService.initDB();

     // Get all asset records from the database.
     itemService.getAllItems().then(function(items) {
         vm.items = items;
         console.log("all the items", vm.items)
         console.log("more photo", vm.items.imageData);
     });
 });

 $scope.saveItem = function() {
  // if ($scope.isAdd) {
     itemService.addItem($scope.form);
      //console.log($scope.form);
//  } else {
//      itemService.updateItem($scope.form);
//  }

    //  $scope.reset();

  };





  $scope.takePhoto = function () {
    console.log("taking a photo");
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
              //console.log("the photo", $scope.imgURI);
              $scope.form.imgURI = $scope.imgURI;
              console.log("form imgURI", $scope.form.imgURI);
          }, function (err) {
              // An error occured. Show a message to the user
          });
          console.log("the photo", imgURI);
          $scope.form.photo = $scope.imgURI;
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


       return vm;
})

.controller('statsTabDefaultPageCtrl', function($scope) {

})

.controller('mapDefaultPageCtrl', function($scope, esriLoader) {
                   var self = this;
                   esriLoader.require(['esri/Map'], function(Map) {
                       self.map = new Map({
                           basemap: 'streets'
                       });
                   });
               })

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

.controller('myRecentActivityCtrl', function($scope) {

})

.controller('myStatsCtrl', function($scope) {

})
