var mongoose = require('mongoose');
//var monk = require('monk');
var Movie = mongoose.model('moviesData','moviesData');
var Cast = mongoose.model('cast','cast');
var Genre = mongoose.model('genres','genres');
var ReviewData = mongoose.model('reviews','reviews');
//var db = monk('localhost:27017/movies');


module.exports.getPopular = function(req, res) {
  var tempdate = new Date();
  tempdate.setDate(tempdate.getDate() - 30);
  tempdate = tempdate.toISOString();
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie
      .find({release_date :{"$gte": tempdate}, active:true}).sort( { vote_average: -1 } ).limit(8)
      .exec(function(err, movie) {

        res.status(200).json(movie);
      });
  }

};

module.exports.getPopularAll = function(req, res) {
  var currentdate = new Date().toISOString();
  var tempdate = new Date();
  tempdate.setDate(tempdate.getDate() - 30);
  tempdate = tempdate.toISOString();
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie
      .find({release_date :{"$gte": tempdate}, active:true}).sort( { vote_average: -1} )
      .exec(function(err, movie) {
        console.log(movie);
        res.status(200).json(movie);
      });
  }

};

module.exports.getLatest = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie
      .find({active:true}).sort( { release_date: -1 } ).limit(8)
      .exec(function(err, movie) {

        res.status(200).json(movie);
      });
}
};

module.exports.getAll = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie
      .find({active:true})
      .exec(function(err, movie) {

        res.status(200).json(movie);
      });
  }

};

module.exports.getSearch = function(req, res) {
  console.log('Get Search',req.body.query);
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {//new RegExp('^'+req.body.query+'$', "i")
    Movie
      .find({title:new RegExp(req.body.query, 'i'), active:true})
      .exec(function(err, movie) {
        console.log(movie);
        res.status(200).json(movie);
      });
  }

};

module.exports.getMovieProfile = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
     var movieData = {};
     var genres = [];
     Movie
      .findOne({id:req.params.id})
      .exec(function(err, movie) {
        movieData = JSON.parse(JSON.stringify(movie));
        movieData['genre'] = [];
        movieData['genre_ids'].forEach(function(value){
          //console.log(value);
          Genre.findOne({id:value})
          .exec(function(err,genre){
            //console.log(genre['name']);
            //movieData['genre'] = genre['name'];
            genres.push(genre['name']);
          })
        });
       // res.status(200).json(movie);
      })
      .then(function(){
         movieData['reviews'] = {};
         ReviewData.find({movie_id:req.params.id}).sort({created_date: -1}).limit(5)
         .exec(function(err,review){
            movieData['reviews'] = review;
            console.log(movieData);
            //res.status(200).json(movieData);
         })
      })
      .then(function(){
        movieData['genre'] = genres;
        movieData['cast'] = {};

        Cast.findOne({id:req.params.id})
          .exec(function(err, cast) {
            movieData['cast'] = cast['cast'];
            console.log('----CAST----',cast['cast']);
            res.status(200).json(movieData);

          });
      });
  }
};

module.exports.getLatestAll = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie
      .find({active:true}).sort( { release_date: -1 } )
      .exec(function(err, movie) {

        res.status(200).json(movie);
      });
}
};
module.exports.getTopratedAll = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie
      .find({active:true}).sort( { vote_average: -1 } )
      .exec(function(err, movie) {

        res.status(200).json(movie);
      });
}
};

module.exports.getGenreData = function(req, res) {
  console.log("inside genre data");
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      var id = parseInt(req.params.id);
      Movie
      .find({genre_ids:id, active:true})
      .exec(function(err, movies){
        res.status(200).json(movies);
      });
  }

};
module.exports.updateMovie = function(req, res) {
  console.log("inside update Movie");
  var info = {msg: "Success"};
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
      console.log("got movie", req.body);
      Movie.findOne({id:req.body.id})
      .exec(function(err, movie){
        if(movie){
          movie.title = req.body.title;
          movie.overview = req.body.overview;
          movie.genre_ids = req.body.genre_ids;
          movie.release_date = req.body.release_date;
          movie.image = req.body.image;
          movie.save(function(err){
            res.status(200).json("Movie Updated");
          })
        }
      })
  }
};

module.exports.deleteMovie = function(req, res){
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie.findOne({id:req.params.id})
    .exec(function(err, movie){
      if(movie){
        movie.active = false;
        movie.save(function(err){
            res.status(200).json("Movie Deleted");
        })
      }
    })
  }
};

module.exports.showMovie = function(req, res){
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Movie.findOne({id:req.params.id})
    .exec(function(err, movie){
      if(movie){
        movie.active = true;
        movie.save(function(err){
            res.status(200).json("Movie is now available");
        })
      }
    })
  }
};

