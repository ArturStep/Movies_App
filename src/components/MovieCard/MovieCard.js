import React from "react";
import './MovieCard.css'

const MovieCard = ({movie, selectMovie}) => {
    const IMAGE_PATH='https://image.tmdb.org/t/p/w500'
    return (
        <div className='movie_card' onClick={() => selectMovie(movie)}>
            {movie.poster_path ?
                <img className='movie_cover'
                     src={`${IMAGE_PATH}${movie.poster_path}`}
                     alt='poster' />
            : <div className='movie_placeholder'>No image poster</div>}
            <h5 className='movie_title'>{movie.title}</h5>
        </div>
    )
}

export default MovieCard;