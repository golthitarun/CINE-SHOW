
(function() {

  angular
    .module('meanApp')
    .controller('movieCtrl', movieCtrl)
    .constant('ratingConfig', { max: 5 })
    .controller('RatingController',RatingController);


  movieCtrl.$inject = ['$location', 'meanData','review', 'favorite', 'movieData','authentication','$route','$timeout','ratingConfig','$scope','genres','SweetAlert','$anchorScroll'];
  function movieCtrl($location, meanData, review, favorite, movieData, authentication,$route,$timeout,ratingConfig,$scope,genres, SweetAlert,$anchorScroll) {
    var vm = this;
    vm.user = {};
    vm.movie = {};
    vm.movieRatinPercentage = "";
   console.log("Initialized credentials for review");
    vm.review = {
      email : "",
      name : "",
      id :"",
      review : "",
      rating:""
    };
    vm.favorite= {
      user_id : "",
      movie_id : "",
      message : ""
    };
    vm.newdate = "";
    vm.isAdmin = false;
    vm.editReview = {};
    movieCtrl.editValue = -1;
    movieCtrl.newValue = -1;
    vm.showsubmit = false;
    vm.submiterror = "";

    /*****EDIT REVIEW****/
    var ngModelCtrl = { $setViewValue: angular.noop };

    this.init = function(ngModelCtrl_) {
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;
      $scope.range = [0,1,2,3,4,5,6,7,8,9];
      $scope.showsubmit = false;
    };

    $scope.rate = function(value) {
      if ( value >= 0 && value <= $scope.range.length ) {
        ngModelCtrl.$setViewValue(value);
        ngModelCtrl.$render();
      }
    };

    this.render = function(data) {
      //console.log(movieCtrl.editValue);
      console.log("Inside render");
      if(data){
        console.log("render from review", $scope.value);
        ngModelCtrl.$setViewValue(data);
        $scope.value = data;
        console.log($scope.value);
      }
      else{
        console.log("render form ng-model", $scope.value);
        $scope.value = ngModelCtrl.$viewValue;
      }
      movieCtrl.editValue = ngModelCtrl.$viewValue;
      movieCtrl.newValue = ngModelCtrl.$viewValue;
      $scope.showsubmit = true;
      vm.showsubmit = true;
      //console.log(movieCtrl.editValue);
    };

    $scope.enter = function(value) {
      $scope.value = value;
      $scope.onHover({value: value});
    };

    $scope.reset = function() {
      $scope.value = ngModelCtrl.$viewValue;
      $scope.onLeave();
    };
    /*******************************/


    vm.showEdit = false;
    vm.selection = [];
    meanData.getProfile()
      .success(function(data) {
        vm.user = data;
        if(vm.user.email == 'admin@cineshow.com'){
          vm.isAdmin = true;
        }
      })
      .error(function (e) {
        console.log(e);
      });
    console.log("Inside Main Controller");
    vm.test = [];
    genres.getGenresService()
      .success(function(data) {
        for (var i = 0; i < data.length; i=i+3) {
          temp = [];
          temp.push(data[i]);
          temp.push(data[i+1]);
          temp.push(data[i+2]);
          vm.test.push(temp);
        }
        vm.genres = data;
      })
      .error(function (e) {
        console.log(e);
      });

    vm.editDone = function(){
      $route.reload();
    }
    vm.onClick = function(){
      console.log("Logging Out");
      authentication.logout();
      $location.path("/");
    };
    vm.onClickProfile = function(){
      $location.path("/profile");
    };

    vm.edit = function(review){
      vm.editReview = review;
      vm.showEdit = true;

      this.render(vm.editReview.rating);
    };

    vm.updateReview = function(){
      console.log(movieCtrl.editValue);
        vm.editReview.rating = movieCtrl.editValue;

        review.updateReview(vm.editReview)
        .success(function(info){
          console.log('Review Edited');
          $route.reload();
        });
    };

     vm.onFavorite = function () {
      console.log('Submitting review');
      vm.favorite.user_id = vm.user.email;
      vm.favorite.movie_id = vm.movie.id;
      console.log(vm.favorite);
      favorite
        .postFavorite(vm.favorite)
        .success(function(){
          console.log("Inside success");
          SweetAlert.success(
            'Added to favorite',
            {title: "SUCCESS!"}
        );
        // SweetAlert.confirm("Are you sure?", {title : "Careful now!"})
        //   .then(function(p) { console.log("Yo"); },
        //         function(p) { console.log("yo2");}
        //   );
        })
        .error(function(err){
          console.log(err.message);
          if(err.message = "Already added to favorites")
            vm.favorite.message = "Already added to favorites";
        });
      //alert("clicked!!");
    };

     vm.onSubmit = function () {
      console.log('Submitting review');
      //console.log(vm.user);
      vm.review.email = vm.user.email;
      vm.review.name = vm.user.name;
      vm.review.id = vm.movie.id;
      vm.review.rating = movieCtrl.newValue;
      if(movieCtrl.newValue){
      // review
      //   .postMovieReview(vm.review)
      //   .success(function(){
      //     console.log("Inside success");
      //     //$location.path("/main");
      //     $route.reload();
      //   })
      //   .error(function(err){
      //     console.log(err.message);
      //     // if(err.message = "User Already exists")
      //     //   vm.credentials.message = "User Already Exists";
      //   });
    }else{
      vm.submiterror = "Rating is required";
    }
    };

    vm.updateMovie = function(){
      console.log(vm.newdate);
      vm.onUpdateMsg = "";
      if(vm.newdate != null){
        var date = vm.newdate.getDate();
        if(date.toString().length != 2){
          date = '0'+date;
        }
        var month = vm.newdate.getUTCMonth()+1;
        if(month.toString().length != 2){
          month = '0'+month;
        }
        var year = vm.newdate.getFullYear();
        vm.movie.release_date = year+'-'+month+'-'+date;
      }else{
        vm.movie.release_date = vm.date;
      }
      console.log(vm.selection.length);
        if(vm.selection.length != 0)
          vm.movie.genre_ids = vm.selection;
      vm.movie.image = vm.myFile.name;
      console.log(vm.movie);
      movieData.updateMovie(vm.movie).success(function(info){
        console.log('success');
        vm.onUpdateMsg = "Movie Updated Successfully";
      });

    };

    vm.toggleSelection = function(genreid){
      var idx = vm.selection.indexOf(genreid);
      if(idx > -1){
        vm.selection.splice(idx,1);
      }else{
        vm.selection.push(genreid);
      }
      console.log(typeof(vm.selection));
    };

    vm.deleteMovie = function(){
      console.log('Delete Movie', vm.movie.id);
      SweetAlert.confirm("Are you sure?", {title : "Delete Movie"})
        .then(function(p) {
          if(p){
            movieData.deleteMovie(vm.movie.id)
            .success(function(info){
              //$location.path('/main');
              $location.path('/movies/'+vm.movie.id);
              $route.reload()
            });
          }else{
            console.log("cancel");
          }
        }
        );
    }

    vm.showMovie = function(){
      console.log('Show Movie', vm.movie.id);
      SweetAlert.confirm("Are you sure?", {title : "Show Movie"})
      .then(function(p) {
        if(p){
          movieData.showMovie(vm.movie.id)
          .success(function(info){
            $location.path('/movies/'+vm.movie.id);
            $route.reload()
          });
        }else{
          console.log("cancel");
        }
      }
    );
    }
    vm.showWriteReview = true;
    movieData.getMovieProfile()
      .success(function(data) {
        vm.movie = data;
        vm.date = vm.movie.release_date;
        //vm.movie.release_date = vm.movie.release_date.replace('-','/').replace('-','/');
        //vm.movie.release_date = '01/01/2000';
        var reviews = vm.movie.reviews;
        console.log("Movie profile",reviews);
        for(var i=0;i < reviews.length && vm.showWriteReview; i++){
          if(reviews[i].user_id == vm.user.email){
            vm.showWriteReview = false;
          }
        }

        vm.movieRatinPercentage = data['vote_average']* 10;
      })
      .error(function (e) {
        console.log(e);
        $location.path("/main");
      });
  }

  RatingController.$inject = ['$scope','ratingConfig'];
  function RatingController($scope, ratingConfig){
    var ngModelCtrl = { $setViewValue: angular.noop };

    this.init = function(ngModelCtrl_) {
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;
      $scope.range = [0,1,2,3,4,5,6,7,8,9];
      console.log($scope.range);
    };
  }

  angular
    .module('meanApp')
    .directive('rating', [function () {
            return {
              restrict: 'EA',
              scope: {
                onHover: '&',
                onLeave: '&'
              },
              require: ['rating', 'ngModel'],
              replace: true,
              template: '<span ng-mouseleave="reset()"' +
                    'ng-keydown="onKeydown($event)"' +
                    'tabindex="0" role="slider"' +
                    'aria-valuemin="0" aria-valuemax="10"' +
                    'aria-valuenow="{{value}}">' +
                '<i ng-repeat="r in range track by $index"' +
                    'ng-mouseenter="enter($index + 1)"' +
                    'ng-click="rate($index + 1)"' +
                    'ng-class="$index < value ? \'fa fa-star fa-2x active\' : \'fa fa-star fa-2x\'">'+
                '</i>' +
              '</span>',
              controller: 'movieCtrl',
              link: function(scope, element, attrs, ctrls) {
                var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if ( ngModelCtrl ) {
                  ratingCtrl.init( ngModelCtrl );
                }
              }
            };
         }]);

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
})
();
