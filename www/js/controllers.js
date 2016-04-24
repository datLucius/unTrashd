angular.module('app.controllers', [])

.controller('homeTabDefaultPageCtrl', function($scope, gearService) {
  $scope.user = localStorage.getItem('user')
  $scope.allGrab = gearService.recent().then(function (res) {
    $scope.allRecent = res.data
    console.log($scope.allRecent)
  })
  $scope.myGrab = gearService.recent($scope.user).then(function (res) {
    $scope.myRecent = res.data
  })
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
})

.controller('inputTabDefaultPageCtrl', function($scope, itemService, $cordovaCamera, $ionicPlatform, geoLocationService, gearService) {
  $scope.user = localStorage.getItem('user')
  $scope.allTags = []
  $scope.trashImage
  $scope.trashTag = {
    trashLabel: ''
  }
  $scope.currentLocation
  $scope.show = {
    'tagAdd': true
  }
  $scope.showType = {
    'icon': true
  }
  // $scope.myLocationGrab = geoLocationService.getLocation().then(function (res) {
  //   console.log(res)
  //   $scope.currentLocation = [res.latitude, res.longitude]
  //   console.log('my local', $scope.currentLocation)
  // })
  $scope.suggestions = [{trashLabel: 'rope'}, {trashLabel: 'web'}, {trashLabel: 'metal'}, {trashLabel: 'net'},  {trashLabel: 'gear'}]
  $scope.commonChoices = [{trashLabel: 'can', imageSrc: ''}]
  $scope.enterTag = function(keyEvent) {
    if (keyEvent.which === 13) {
      $scope.addTag
    }
  }
  $scope.addTag = function () {
    $scope.allTags.push($scope.trashTag.trashLabel)
    $scope.trashTag = {
      trashLabel: ''
    }
    console.log($scope.allTags)
  }
  $scope.addSuggestion = function (suggestionTag) {
    $scope.allTags.push(suggestionTag.trashLabel)

  }
  $scope.addChoice = function (commonChoice) {
    $scope.allTags.push(commonChoice)
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

    $scope.myLocationGrab = geoLocationService.getLocation().then(function (res) {
      $scope.currentLocation = [res.latitude, res.longitude]
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

$scope.saveItem = function() {
   itemService.addItem($scope.form);

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
            $scope.form.imgURI = $scope.imgURI;
            console.log("form imgURI", $scope.form.imgURI);
        }, function (err) {
            // An error occured. Show a message to the user
        });
        // console.log("the photo", imgURI);
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
     $scope.postNewFind = function() {
       var trash = {
         location: $scope.currentLocation,
         image: $scope.imgURI,
         tags: $scope.allTags,
         tagged_by: $scope.user
       }
       gearService.post(trash)
     }
})

.controller('statsTabDefaultPageCtrl', function($scope, userService) {
  $scope.user = localStorage.getItem('user')
  $scope.view = {
    'myStats': true
  }
  $scope.userData
  $scope.fullUser = userService.get($scope.user).then(function (res) {
    $scope.userData = res.data
    console.log('this is user', $scope.userData)
  })
  $scope.leaderGrab = userService.leaderboard().then(function (res) {
    $scope.leaderBoard = res.data
  })
  $scope.points = $scope.fullUser.points
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
