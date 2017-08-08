(function () {

  angular
    .module('meanApp')
    .controller('favCtrl', favCtrl);

  favCtrl.$inject = ['$location', 'meanData', 'favorite','authentication','searchservice','$route','$rootScope','$window','$timeout','$scope','pager','$anchorScroll'];
  function favCtrl($location, meanData, favorite, authentication,searchservice,$route,$rootScope,$window,$timeout,$scope,pager,$anchorScroll) {
    var vm = this;
    vm.movie = {};
    vm.deleteFavorite = {
      movie_id : "",
      user_id : ""
    }

    meanData.getProfile()
      .success(function(data) {
        console.log("inside get popular-2",data);
        vm.user = data;
      })
      .error(function (e) {
        console.log(e);
      });

    favorite.getFavorites()
            .success(function(data){
                console.log("inside popular all",data);
                vm.movie = data;
                vm.pager = {};
                vm.setPage = setPage;

                initController();
            })
            .error(function (e) {
              console.log(e);
            });

    vm.deleteFav = function(id){

      vm.deleteFavorite.movie_id = id;
      vm.deleteFavorite.user_id = vm.user.email;

      //console.log('Delete Movie', vm.deleteFavorite);
      favorite.
      deleteFavorite(vm.deleteFavorite)
      .success(function(info){
        $location.path('/main');
        console.log("/favorites/"+vm.user.email);
        $location.path('/favorites/'+vm.user.email);
        $route.reload()
      });
    }

    function initController() {
        // initialize to page 1
        vm.setPage(1);
    }

    function setPage(page) {
        if (page < 1 || page > vm.pager.totalPages) {
            return;
        }

        // get pager object from service
        //vm.pager = pager.GetPager(vm.dummyItems.length, page);

        // get current page of items
        //vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);

        // get pager object from service
        vm.pager = pager.GetPager(vm.movie.length, page);

        // get current page of items
        vm.items = vm.movie.slice(vm.pager.startIndex, vm.pager.endIndex + 1);

        $location.hash('top');
        $anchorScroll();
    }
  }

})();
