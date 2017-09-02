'use strict';
angular.module('educationalTermsApp')

.controller('HomeController', ['$scope', 'ngDialog', 'termFactory', 'commentFactory', 'favoriteFactory' , function ($scope, ngDialog, termFactory, commentFactory, favoriteFactory) {
    $scope.message = "Loading ...";
    $scope.showMessage = false;
    $scope.showTerms = false;
    $scope.showComments = false;
    $scope.showFavorites = false;
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

    $scope.searchtypeselected = function (value) {  

    };

    $scope.searchbutton = function () {
        if ((!$scope.searchtype) || (!$scope.searchtext)){
            $scope.showMessage = true;
            $scope.showTerms = true;  
            $scope.showComments = true;            
            $scope.message = "Plase Choose Language and Type Title To Search";
        }
        else{
            $scope.showMessage = false;            
            if ($scope.searchtype == 1){
                $scope.term = termFactory.query({
                    entitle: $scope.searchtext
                })
                .$promise.then(
                    function (response) {
                        var terms = response;
                        $scope.term = terms[0];
                        if($scope.term){
                            $scope.showTerms = true;
                            $scope.showFavorites = true;
                            $scope.showComments = true;
                        }
                        else{
                            $scope.showMessage = true; 
                            $scope.showTerms = false;  
                            $scope.showFavorites = false;
                            $scope.showComments = false;            
                            $scope.message = "Not Found ... Try Another";    
                            }
                    },
                    function (response) {
                        $scope.showMessage = true; 
                        $scope.showTerms = false;  
                        $scope.showFavorites = false;
                        $scope.showComments = false;            
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            }
            else if ($scope.searchtype == 2){
                $scope.term = termFactory.query({
                    artitle: $scope.searchtext
                })
                .$promise.then(
                    function (response) {
                        var terms = response;
                        $scope.term = terms[0];
                        if($scope.term){
                            $scope.showTerms = true;
                            $scope.showFavorites = true;
                            $scope.showComments = true;
                        }
                        else{
                            $scope.showMessage = true; 
                            $scope.showTerms = false;  
                            $scope.showFavorites = false;
                            $scope.showComments = false;            
                            $scope.message = "Not Found ... Try Another";    
                        }
                    },
                    function (response) {
                        $scope.showMessage = true;  
                        $scope.showTerms = false;  
                        $scope.showComments = false; 
                        $scope.showFavorites = false;                        
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            }
        }
    };

    $scope.closeMessage = function () {
        $scope.showMessage = false;
        $scope.message = "";
    };

    $scope.newcomment = {
        arcomment: "",
        encomment: ""
    };

    $scope.submitComment = function () {
        if (!$scope.term){
            $scope.showMessage = true;
            $scope.showTerms = false;
            $scope.showComments = false;
            $scope.showFavorites = false;
            $scope.message = "Plase Choose Language and Type Search For Terms";
        }
        else if (($scope.newcomment.arcomment=="") && ($scope.newcomment.encomment=="")){
            $scope.showMessage = true;
            $scope.message = "You Must To Enter Arabic Or English Commets";
        }
        else{
            commentFactory.save({id: $scope.term._id}, $scope.newcomment);
        }
    };

    $scope.addToFavorites = function(term) {
        if (!$scope.term){
            $scope.showMessage = true;
            $scope.showTerms = false;
            $scope.showComments = false;
            $scope.showFavorites = false;                        
            $scope.message = "Plase Choose Language and Type Search For Terms";
        }else{
            favoriteFactory.save({_id: term._id});
            $scope.showFavorites = !$scope.showFavorites;
        }
    };
}])





.controller('SearchController', ['$scope', 'ngDialog', 'termFactory', 'commentFactory', 'favoriteFactory' , function ($scope, ngDialog, termFactory, commentFactory, favoriteFactory) {
    $scope.message = "Loading ...";
    $scope.showMessage = false;
    $scope.showTerms = true;
    $scope.showComments = true;
    $scope.showFavorites = true;

    $scope.searchbutton = function () {
        if ((!$scope.searchtype) || (!$scope.searchtext)){
            $scope.showMessage = true;
            $scope.showTerms = false;  
            $scope.showComments = false;            
            $scope.message = "Plase Choose Language and Type Title To Search";
        }
        else{
            $scope.showMessage = false;            
            if ($scope.searchtype == 1){
                $scope.term = termFactory.query({
                    entitle: $scope.searchtext
                })
                .$promise.then(
                    function (response) {
                        var terms = response;
                        $scope.term = terms[0];
                        $scope.showTerms = true;
                        $scope.showFavorites = true;                        
                    },
                    function (response) {
                        $scope.showMessage = true; 
                        $scope.showTerms = false;  
                        $scope.showComments = false;            
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            }
            else if ($scope.searchtype == 2){
                $scope.term = termFactory.query({
                    artitle: $scope.searchtext
                })
                .$promise.then(
                    function (response) {
                        var terms = response;
                        $scope.term = terms[0];
                        $scope.showTerms = true;
                        $scope.showFavorites = true;                        
                    },
                    function (response) {
                        $scope.showMessage = true;  
                        $scope.showTerms = false;  
                        $scope.showComments = false;            
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            }
        }
    };

    $scope.closeMessage = function () {
        $scope.showMessage = false;
        $scope.message = "";
    };

    $scope.newcomment = {
        arcomment: "",
        encomment: ""
    };

    $scope.submitComment = function () {
        if (!$scope.term){
            $scope.showMessage = true;
            $scope.showTerms = false;            
            $scope.showComments = false;            
            $scope.message = "Plase Choose Language and Type Search For Terms";
        }
        else if (($scope.newcomment.arcomment=="") && ($scope.newcomment.encomment=="")){
            $scope.showMessage = true;
            $scope.message = "You Must To Enter Arabic Or English Commets";
        }
        else{
            console.log($scope.term._id);
            console.log($scope.newcomment);
            commentFactory.save({id: $scope.term._id}, $scope.newcomment);
        }
    };

    $scope.addToFavorites = function(term) {
        if (!$scope.term){
            $scope.showMessage = true;
            $scope.showTerms = false;            
            $scope.showComments = false;            
            $scope.message = "Plase Choose Language and Type Search For Terms";
        }else{
            console.log('Add to favorites', term._id);
            favoriteFactory.save({_id: term._id});
            $scope.showFavorites = !$scope.showFavorites;
        }
    };
}])


.controller('ExpertsController', ['$scope', '$state', 'termFactory', function ($scope, $state, termFactory) {
        $scope.message = "Loading ...";
        $scope.showMessage = false;        
        $scope.showtermForm = false;
        
        $scope.terms = termFactory.query({
            approved: "false"
        })
        .$promise.then(
            function (response) {
                var terms = response;
                $scope.terms = terms;
            },
            function (response) {
                $scope.showMessage = true;                
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

        $scope.newItem = function () {
            $scope.term = {
                entitle: "",
                artitle: "",
                endescription: "",
                ardescription: "",
            };
            $scope.showtermForm = true;
        };

        $scope.displayItem = function (term) {
            $scope.showtermForm = true;
            $scope.term = term;
        };

        $scope.updateItem = function (term) {
            $scope.showtermForm = true;
            $scope.term = term;
        };

        $scope.submitTerm = function () {
            if (($scope.term.entitle=="") || ($scope.term.artitle=="")|| ($scope.term.endescription=="")|| ($scope.term.ardescription=="")){
                $scope.showMessage = true;
                $scope.showMessage = true;
                $scope.message = "You Must To Enter All Input";
            }
            else{
                if($scope.term._id){
                    termFactory.update({id:$scope.term._id}, $scope.term);
                    $scope.showtermForm = false;
                    $scope.showMessage = true;
                    $scope.message ="Update Successfully"
                }
                else{
                    termFactory.save($scope.term);
                    $state.go($state.current, {}, {reload: true});
                    $scope.showtermForm = false;
                    $scope.showMessage = true;
                    $scope.message ="ّInsert Successfully"
                }
            }
        };

        $scope.deleteItem = function (term) {
            termFactory.delete({id: term._id});
            $state.go($state.current, {}, {reload: true});    
        };

        $scope.closeMessage = function () {
            $scope.showMessage = false;
            $scope.message = "";
        };
    
    }])

    .controller('AdministratorsController', ['$scope', '$state', 'termFactory', function ($scope, $state, termFactory) {
        $scope.message = "Loading ...";
        $scope.showMessage = false;        
        $scope.showtermForm = false;
        
        $scope.terms = termFactory.query({
        })
        .$promise.then(
            function (response) {
                var terms = response;
                $scope.terms = terms;
            },
            function (response) {
                $scope.showMessage = true;                
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

        $scope.newItem = function () {
            $scope.term = {
                entitle: "",
                artitle: "",
                endescription: "",
                ardescription: "",
                approved:false
            };
            $scope.showtermForm = true;
        };

        $scope.displayItem = function (term) {
            $scope.showtermForm = true;
            $scope.term = term;
        };

        $scope.updateItem = function (term) {
            $scope.showtermForm = true;
            $scope.term = term;
        };

        $scope.submitTerm = function () {
            if (($scope.term.entitle=="") || ($scope.term.artitle=="")|| ($scope.term.endescription=="")|| ($scope.term.ardescription=="")){
                $scope.showMessage = true;
                $scope.showMessage = true;
                $scope.message = "You Must To Enter All Input";
            }
            else{
                if($scope.term._id){
                    termFactory.update({id:$scope.term._id}, $scope.term);
                    $scope.showtermForm = false;
                    $scope.showMessage = true;
                    $scope.message ="Update Successfully"
                }
                else{
                    termFactory.save($scope.term);
                    $state.go($state.current, {}, {reload: true});
                    $scope.showtermForm = false;
                    $scope.showMessage = true;
                    $scope.message ="ّInsert Successfully"
                }
            }
        };

        $scope.deleteItem = function (term) {
            termFactory.delete({id: term._id});
            $state.go($state.current, {}, {reload: true});    
        };

        $scope.approvedItem = function () {

        };

        $scope.closeMessage = function () {
            $scope.showMessage = false;
            $scope.message = "";
        };
    }])



.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {
    $scope.message = "Loading ...";
    $scope.terms = favoriteFactory.query({
    })
    .$promise.then(
        function (response) {
            var terms = response[0].terms;
            $scope.terms = terms;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
    $scope.deleteFavorite = function(term) {
        favoriteFactory.delete({id: term._id});
        $state.go($state.current, {}, {reload: true});
    };
    
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {
    $scope.loggedIn = false;
    $scope.username = '';
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });  
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    $scope.register={};
    $scope.loginData={};
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);
        AuthFactory.register($scope.registration);
        ngDialog.close();
    };
}])
;