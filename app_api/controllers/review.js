var mongoose = require('mongoose');
var Review = mongoose.model('reviews','reviews');
var Movie = mongoose.model('moviesData','moviesData');

module.exports.postMovieReview = function(req, res) {


  var tempdate = new Date();
  tempdate.setDate(tempdate.getDate());
  tempdate = tempdate.toISOString();

  	var newReview = new Review({
    "user_id" : req.body.email,
    "name" : req.body.name,
    "movie_id" : req.body.id,
    "review" : req.body.review,
    "rating" : req.body.rating,
    "created_date" : tempdate,
    "updated_date" : null
	});
	console.log("User name ----> ",req.body.name);
	console.log("Data ----",newReview);
  Movie.findOne({id: req.body.id})
  .exec(function(err, movie){
    if(err) throw err;

    if(req.body.rating){
      var rating = movie.vote_average;
      var count = movie.vote_count;

      rating = ((rating*count) + req.body.rating)/(count + 1);
      movie.vote_average = Number(Math.round(rating+'e1')+'e-1');
      movie.vote_count = count + 1;
   }
    //console.log(movie);
    movie.save(function(err){
      if(err) throw err;
    });

    newReview.save(function(err){
     if (err)
           console.log("Unable to save data");
        else {
           console.log('save user successfully...');
           res.status(200).json("Comment");
        }
    })
  })

};

module.exports.getMovieReview = function(req, res){
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    MovieReview = {};
    Review
      .find({user_id:req.payload.email})
      .exec(function(err, data) {
        MovieReview = JSON.parse(JSON.stringify(data));
        dummy = [];
        var len = MovieReview.length;
        var i = 0;
        MovieReview.forEach(function(value){
          Movie.findOne({id:value['movie_id']})
          .exec(function(err, final) {
            i = i + 1;
            value['movieName'] = final['title'];
            if(final.active)
              dummy.push(value);
            if (i == len){
                res.status(200).json(dummy);
            }
          });
    });
  });
 }
};

module.exports.updateReview = function(req, res){
  console.log("Inside updateReview");
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  }else{
    //console.log(req.body);
    Review.findOne({user_id: req.body.user_id, movie_id: req.body.movie_id})
    .exec(function(err, review){

      Movie.findOne({id: req.body.movie_id})
      .exec(function(err, movie){
        var newrating;
        if(!req.body.rating){
          if(!review.rating){
            newrating = movie.vote_average;
          }else{
            req.body.rating = review.rating;
            newrating = ((movie.vote_average*movie.vote_count) - review.rating + req.body.rating)/movie.vote_count;
            movie.vote_average = Number(Math.round(newrating+'e1')+'e-1');
          }
        }else{
          if(!review.rating){
            var rating = movie.vote_average;
            var count = movie.vote_count;

            rating = ((rating*count) + req.body.rating)/(count + 1);
            movie.vote_average = Number(Math.round(rating+'e1')+'e-1');
            movie.vote_count = count + 1;
          }else{
            newrating = ((movie.vote_average*movie.vote_count) - review.rating + req.body.rating)/movie.vote_count;
            movie.vote_average = Number(Math.round(newrating+'e1')+'e-1');
          }
        }
        console.log(movie);
        review.review = req.body.review;
        review.rating = req.body.rating;
        var tempdate = new Date();
        tempdate.setDate(tempdate.getDate());
        tempdate = tempdate.toISOString();
        review.updated_date = tempdate;
        console.log(review);

        movie.save(function(err){
          if(err) throw err;
        });

        review.save(function(err){
          if (err)
             console.log("Unable to save data");
          else {
             //console.log('save user successfully...');
             res.status(200).json({msg: "Review Updated"});
          }
        });
      });
    });
  }
};
