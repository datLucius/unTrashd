angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.homeTabDefaultPage', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/homeTabDefaultPage.html',
        controller: 'homeTabDefaultPageCtrl'
      }
    }
  })

  .state('tabsController.inputTabDefaultPage', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/inputTabDefaultPage.html',
        controller: 'inputTabDefaultPageCtrl'
      }
    }
  })

  .state('tabsController.statsTabDefaultPage', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/statsTabDefaultPage.html',
        controller: 'statsTabDefaultPageCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.mapDefaultPage', {
    url: '/page5',
    views: {
      'tab4': {
        templateUrl: 'templates/mapDefaultPage.html',
        controller: 'mapDefaultPageCtrl'
      }
    }
  })

  .state('login', {
    url: '/page6',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/page7',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('tabsController.myRecentActivity', {
    url: '/page8',
    views: {
      'tab1': {
        templateUrl: 'templates/myRecentActivity.html',
        controller: 'myRecentActivityCtrl'
      }
    }
  })

  .state('tabsController.myStats', {
    url: '/page9',
    views: {
      'tab3': {
        templateUrl: 'templates/myStats.html',
        controller: 'myStatsCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/page2')

  

});