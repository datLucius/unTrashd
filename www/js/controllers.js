angular.module('app.controllers', [])

.controller('homeTabDefaultPageCtrl', function($scope) {
  $scope.show = {
    'all': true
  }
  $scope.allTrashPosts = [{
    'userName': 'fred',
    'date': 'May 3rd',
    'trashTags': [{'name': 'wood'},{'name':'chair'}]
  },
  {
    'userName': 'ted',
    'date': 'May 4th',
    'trashTags': [{'name': 'wood'},{'name':'chair'}]
  }]
  console.log($scope.allTrashPosts)
})

.controller('inputTabDefaultPageCtrl', function($scope, itemService, $cordovaCamera, $ionicPlatform, geoLocationService, gearService) {
  $scope.trash = {
    points: $scope.points,
    location: $scope.trashLocation,
    image: $scope.trashImage,
    trashTags: $scope.allTags
  }

  $scope.postNewFind = function(){ gearService.post($scope.trash) }
 $scope.allTags = []
 $scope.trashImage
 $scope.trashTag = {
   trashLabel: ''
 }

  $scope.allTags = []
  $scope.currentLocation = {
    0: 34234234234234,
    1: 23423423423234
  }
  $scope.trashImage
  $scope.trashTag = {
    trashLabel: ''
  }
  $scope.show = {
    'tagAdd': true
  }
  $scope.suggestions = [{trashLabel: 'rope'}, {trashLabel: 'web'}, {trashLabel: 'metal'}, {trashLabel: 'net'}]

  $scope.enterTag = function(keyEvent) {
    if (keyEvent.which === 13) {
      $scope.addTag
    }
  }
  $scope.addTag = function () {
    $scope.allTags.push($scope.trashTag)
    $scope.trashTag = {
      trashLabel: ''
    }
    console.log($scope.allTags)
  }
  $scope.addSuggestion = function (suggestionTag) {
    $scope.allTags.push(suggestionTag)

  }
  $scope.removeTag = function (committedTag) {
    var index = $scope.allTags.indexOf(committedTag);
    if(index >= 0) {
      $scope.allTags.splice(index, 1)
    }
  }
  $scope.addTrash = function () {
    // send to backend //
  }
  $scope.$on('$ionicView.enter', function() {

geoLocationService.getLocation().then(function(result){
         $scope.location = result
       })
})

$scope.form = {};

  // Initialize the database.
$ionicPlatform.ready(function() {
   itemService.initDB();

   // Get all asset records from the database.
   itemService.getAllItems().then(function(items) {
       $scope.items = items;
      //  console.log("all the items", $scope.items)
      //  console.log("more photo", $scope.items.imageData);
   });
});

$scope.saveItem = function(suggestions) {
  // itemService.addItem($scope.form);
  console.log(suggestions);

};

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
            //console.log("the photo", $scope.imgURI);
          //  $scope.form.imgURI = $scope.imgURI;
          //  console.log("form imgURI", $scope.form.imgURI);
        }, function (err) {
            // An error occured. Show a message to the user
        });
        // console.log("the photo", imgURI);
        // $scope.form.photo = $scope.imgURI;
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
  $scope.view = {
    'myStats': true
  }
  $scope.myStats
  $scope.allStats
})

.controller('mapDefaultPageCtrl', function($scope) {

  $scope.$on('$ionicView.enter', function() {

  $('#mapClick').click();
  })
// .controller('mapDefaultPageCtrl', function($scope, esriLoader) {
  // $scope.map = {
  //   center: {
  //     lng: -80,
  //     lat: 33
  //   },
  //   zoom: 11
  // }

})

.controller('loginCtrl', function($scope, $state) {
  $scope.login = function (acct) {
    $scope.user = acct.userid;
    localStorage.setItem("user", acct.userid);
    $state.go('tabsController.homeTabDefaultPage')
  }
})

.controller('signupCtrl', function($scope) {

})

.controller('myRecentActivityCtrl', function($scope) {

})

.controller('myStatsCtrl', function($scope) {

})
