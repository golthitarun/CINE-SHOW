(function () {

  angular
    .module('meanApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;
    vm.passStrength = "";
    console.log("Initialized credentials");
    vm.credentials = {
      name : "",
      email : "",
      password : "",
      message:""
    };

    vm.onSubmit = function () {
      console.log('Submitting registration');
      var stroPattern = /^([a-zA-Z0-9*_@!#$%&]+$)/;
      if(stroPattern.test(vm.credentials.password)){
        authentication
        .register(vm.credentials)
        .error(function(err){
          console.log(err.message);
          if(err.message = "User Already exists")
            vm.credentials.message = "User Already Exists";
        })
        .success(function(){
          $location.path('main');
        });
      }else{
        vm.passStrength = "Invalid Characters entered";
      }

        // .then(function(){
        //   console.log("Inside the function");
        //   if(!authentication.isLoggedIn())
        //    $location.path('/');
        //  else
        //   $location.path('profile');
        // })

    };

    vm.checkPass = function(){
      //console.log(vm.credentials.password);
      var pass = vm.credentials.password;
      var weakPattern = /^([a-zA-Z]+$)/;
      var medPattern = /^([a-zA-Z0-9]+$)/;
      var stroPattern = /^([a-zA-Z0-9*_@!#$%&]+$)/;
      var myEl = angular.element( document.querySelector( '#strength' ) );
      if(pass.length < 6 && pass.length > 0){
        console.log("Too weak");
        myEl.addClass("red-text").removeClass("text-warning").removeClass("text-success");
        vm.passStrength = "Too Weak";
      }else if(weakPattern.test(pass)){
        vm.passStrength = "Weak";
        myEl.addClass("red-text").removeClass("text-warning").removeClass("text-success");
      }else if(medPattern.test(pass)){
        vm.passStrength = "Medium";
        myEl.addClass("text-warning").removeClass("red-text").removeClass("text-success");
      }else if(stroPattern.test(pass)){
        vm.passStrength = "Strong";
        myEl.addClass("text-success").removeClass("text-warning").removeClass("red-text");
      }else if(pass.length == 0){
        console.log("length is zero");
        vm.passStrength = "";
      }else{
        vm.passStrength = "Invalid Characters entered";
        myEl.addClass("red-text").removeClass("text-warning").removeClass("text-success");
      }

    }

    vm.onblur = function(){
      var pass = vm.credentials.password;
      console.log(pass);
      if(!pass){
        vm.passStrength = "";
      }
    }

  }

})();
