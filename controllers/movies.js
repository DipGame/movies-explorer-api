const Movie = require('../models/movie');

const {
  NOT_FOUND, CREATED, FORBIDDEN, BAD_REQUEST,
} = require('../errors/errors');

const addMovie = (req, res, next) => {
  const id = req.user._id;
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner: id,
  })
    .then((newMovie) => {
      res.status(CREATED).send(newMovie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Введены некорректные данные при добавлении видео'));
      } else {
        next(err);
      }
    });
};

const getMyMovies = (req, res, next) => {
  const id = req.user._id;

  Movie.find({ owner: id })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const id = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NOT_FOUND('Карточка не найдена'));
      }
      const isEqual = movie.owner.equals(id);
      if (isEqual) {
        Movie.findByIdAndDelete(movieId)
          .orFail()
          .then((movies) => {
            res.send(movies);
          })
          .catch(next);
      } else {
        next(new FORBIDDEN('Эта карточка не ваша)'));
      }
    })
    .catch(next);
};

module.exports = {
  addMovie, getMyMovies, deleteMovie,
};
