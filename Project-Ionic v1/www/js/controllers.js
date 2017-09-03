angular.module('educationalTermsApp.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.registration = {};
    $scope.loggedIn = false;
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    $scope.login = function () {
        $scope.modal.show();
    };

    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        $scope.closeLogin();
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
    
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    $scope.register = function () {
        $scope.registerform.show();
    };

    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;
        AuthFactory.register($scope.registration);
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
       
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $localStorage.storeObject('userinfo',$scope.loginData);
    });
})



.controller('IndexController', ['$scope', '$state', 'baseURL', 'termFactory', 'commentFactory', 'favoriteFactory' , function ($scope, $rootScope, $state, baseURL, termFactory, commentFactory, favoriteFactory) {
    $scope.message = "Loading ...";
    $scope.showMessage = false;
    $scope.showTerms = false;
    $scope.showComments = false;
    $scope.showFavorites = false;
    $scope.search = {};
    
    
    $scope.searchbutton = function () {
        if ((!$scope.search.searchtype) || (!$scope.search.searchtext)){
            $scope.showMessage = true;
            $scope.showTerms = true;  
            $scope.showComments = true;            
            $scope.message = "Plase Choose Language and Type Title To Search";
        }
        else{
            $scope.showMessage = false;            
            if ($scope.search.searchtype == 1){
                $scope.term = termFactory.query({
                    entitle: $scope.search.searchtext
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
            else if ($scope.search.searchtype == 2){
                $scope.term = termFactory.query({
                    artitle: $scope.search.searchtext
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

.controller('AboutController', ['$scope', 'baseURL', function ($scope, baseURL) {

}])


.controller('SearchController', ['$scope', 'baseURL', 'termFactory', 'commentFactory', 'favoriteFactory' , function ($scope, baseURL, termFactory, commentFactory, favoriteFactory) {
    $scope.message = "Loading ...";
    $scope.showMessage = false;
    $scope.showTerms = false;
    $scope.showComments = false;
    $scope.showFavorites = false;

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
    

.controller('FavoritesController', ['$scope', '$state', 'favoriteFactory', 'baseURL', function ($scope, $state, favoriteFactory, baseURL) {
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

.controller('ExpertsController', ['$scope', 'baseURL', 'termFactory', function ($scope, baseURL, termFactory) {
    $scope.baseURL = baseURL; 
    $scope.message = "Loading ...";
    $scope.showMessage = false;
    $scope.showtermForm = false;
    
    termFactory.query(
        function (response) {
            $scope.terms = response;
        },
        function (response) {
    });
    $scope.newItem = function () {
        $scope.term = {
            entitle: "",
            artitle: "",
            endescription: "",
            ardescription: "",
        };
        $scope.showtermForm = true;
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
    
    $scope.closeMessage = function () {
        $scope.showMessage = false;
        $scope.message = "";
    };
}])

.controller('AdministratorsController', ['$scope', 'baseURL', 'termFactory', function ($scope, baseURL, termFactory) {
    $scope.baseURL = baseURL;    
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

;