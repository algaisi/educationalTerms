'use strict';

angular.module('educationalTermsApp', ['ui.router','ngResource','ngDialog'])

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html'
                    }
                }
            })
        
            
            .state('app.search', {
                url: 'search',
                views: {
                    'content@': {
                        templateUrl : 'views/search.html',
                        controller  : 'SearchController'
                    }
                }
            })
        
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            })
    
            .state('app.experts', {
                url: 'experts',
                views: {
                    'content@': {
                        templateUrl : 'views/experts.html',
                        controller  : 'ExpertsController'
                   }
                }
            })
    
            .state('app.administrators', {
                url: 'administrators',
                views: {
                    'content@': {
                        templateUrl : 'views/administrators.html',
                        controller  : 'AdministratorsController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
