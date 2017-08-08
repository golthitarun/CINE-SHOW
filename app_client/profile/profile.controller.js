(function() {

  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData','authentication','review','genres','$route','movieData'];
  function profileCtrl($location, meanData, authentication,review,genres,$route, movieData) {
    var vm = this;
    vm.movie = {};
    vm.user = {};
    vm.userReviews = {};
    vm.newdata = {
      _id:"",
      name:"",
      email:"",
      password:"",
      bio:""
    }
    vm.isAdmin = false;
    vm.onUpdateMsg = "";
    vm.newmovie = {
      title: "",
      overview: "",
      genre_ids: [],
      image: "",
      release_date: "",
      poster_path: "dummy"
    };

    vm.selection = [];
    vm.cast = [];
    vm.test = [];
    meanData.getProfile()
      .success(function(data) {
        console.log("Test Here 2");
        vm.user = data;
        if(vm.user.email == 'admin@cineshow.com'){
          vm.isAdmin = true;
        }
      })
      .error(function (e) {
        console.log(e);
      });
    review.getMovieReview()
      .success(function(data){
        console.log("data from movie review-->",data);
        vm.userReviews = data;
      })
      .error(function (e) {
        console.log(e);
      });
    genres.getGenresService()
      .success(function(data) {
        console.log("inside getGenresService");
        for (var i = 0; i < data.length; i=i+3) {
          temp = [];
          temp.push(data[i]);
          temp.push(data[i+1]);
          temp.push(data[i+2]);
          vm.test.push(temp);
        }
        console.log(vm.test);
        vm.genres = data;
      })
      .error(function (e) {
        console.log(e);
      });

    movieData.getAll()
      .success(function(data) {
        console.log("inside get all",data);
        vm.movie = data;
      })
      .error(function (e) {
        console.log(e);
      });
    console.log("Profile controller");
    vm.onClick = function(){
      console.log("Logging Out");
      authentication.logout();
      $location.path("/");
    }
    vm.clearMessage = function(){
      vm.onUpdateMsg = "";
    }
    vm.updateUser = function(){
      vm.newdata._id = vm.user._id;
      vm.newdata.name = vm.user.name;
      vm.newdata.email = vm.user.email;
      vm.newdata.password = vm.user.password;
      vm.newdata.bio = vm.user.bio;
      meanData.storeUpdateUser(vm.newdata)
        .success(function(data){
          console.log("inside",data);
          vm.onUpdateMsg = data;
          $route.reload();
        })
        .error(function (e){
          console.log(e);
        })
    };

    vm.toggleSelection = function(genreid){
      var idx = vm.selection.indexOf(genreid);
      if(idx > -1){
        vm.selection.splice(idx,1);
      }else{
        vm.selection.push(genreid);
      }
      //console.log(vm.selection);
    };

    vm.addMovie = function(){
      vm.onUpdateMsg = "";
      if(vm.newdate.release_date != null){
        var date = vm.newdate.release_date.getDate();
        if(date.toString().length != 2){
          date = '0'+date;
        }
        var month = vm.newdate.release_date.getUTCMonth()+1;
        if(month.toString().length != 2){
          month = '0'+month;
        }
        var year = vm.newdate.release_date.getFullYear();
        vm.newmovie.release_date = year+'-'+month+'-'+date;
      }
        if(vm.selection.length != 0)
          vm.newmovie.genre_ids = vm.selection;
      vm.cast = [];
      vm.castData = {
        cast: [],
        id: ""
      };
      for(var i=0; i< vm.choices.length; i++){
        if(vm.choices[i].character != null && vm.choices[i].name != null){
          temp = {
            character: "",
            name: "",
            profile_path: ""
          };
          temp.character = vm.choices[i].character;
          temp.name = vm.choices[i].name;
          temp.profile_path = "dummy";
          vm.cast.push(temp);
        }
      }
      var id = Math.floor(Math.random() * (1000000 - 1) + 1);
      var movieFound = true;
      while(movieFound){
      //for(var j=0; j < 10;j++){
        id = Math.floor(Math.random() * (1000000 - 1) + 1);
        for(var i=0; i < vm.movie.length && movieFound; i++){
          if(vm.movie[i].id == id){
            movieFound = true;
          }else{
            console.log('i broke free');
            movieFound = false;
          }
        }
      }
      vm.castData.cast = vm.cast;
      vm.castData.id = id;
      vm.newmovie.id = id;
      vm.newmovie.image = vm.myFile.name
      var addmovie = false;
      console.log(vm.newmovie);
      movieData.addMovie(vm.newmovie)
      .success(function(info){
        console.log("Movie Added");
          movieData.addCast(vm.castData)
          .success(function(info){
          console.log("Cast Added");
          $location.path("/movies/"+id);
      });

      });


    };

    vm.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}, {id: 'choice4'}, {id: 'choice5'}];

    vm.addNewChoice = function(){
      var newItemNo = vm.choices.length+1;
      vm.choices.push({'id':'choice'+newItemNo});
    }

    vm.removeChoice = function(){
      var lastItem = vm.choices.length-1;
      vm.choices.splice(lastItem);
    }

  }

  angular.module('meanApp')
  .directive('fileModel',['$parse', function($parse){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);


})();
