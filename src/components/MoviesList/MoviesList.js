import React, {useEffect, useState} from 'react';
import axios from "axios";
import MovieCard from "../MovieCard/MovieCard";
import './MoviesList.css';
import YouTube from "react-youtube";

const MoviesList = () => {

    const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
    const API_URL = 'https://api.themoviedb.org/3'
    const [movies, setMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState({})
    const [searchKey, setSearchKey] = useState('')
    const [playTrailer, setPlayTrailer] = useState(false)

    const fetchMovies = async (searchKey) => {
        const type = searchKey ? 'search' : 'discover'
        const {data: {results}} = await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: process.env.REACT_APP_MOVIE_API_KEY,
                query: searchKey
            }
        })
        setMovies(results)
        await selectMovie(results[0])
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: process.env.REACT_APP_MOVIE_API_KEY,
                append_to_response: 'videos'
            }
        })
        return data;
    }

    const selectMovie = async (movie) => {
        setPlayTrailer(false)
        const data = await fetchMovie(movie.id)
        setSelectedMovie(data)
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    const renderMovies = () => {
        return movies.map(movie => (
            <MovieCard
                key={movie.id}
                movie={movie}
                selectMovie={selectMovie}
            />
        ))
    }

    const SearchMovies = (e) => {
        e.preventDefault()
        fetchMovies(searchKey)
    }

    const renderTrailer = () => {
        const trailer = selectedMovie.videos.results.find(vid => vid.name === 'Official Trailer')
        const key = trailer ? trailer.key : selectedMovie.videos.results[0].key

        return (
            <YouTube
                videoId={key}
                className='youtube_container'
                opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        autoplay: 1,
                        controls: 0
                    }
                }}
            />
        )
    }

    return (
        <div className=''>
            <header className='header max_width'>
                <span>Movies Trailer App</span>
                <form onSubmit={SearchMovies}>
                    <input type='text' onChange={(e) => setSearchKey(e.target.value)}/>
                    <button type='submit'>Search</button>
                </form>
            </header>

            <div className='hero'
                 style={{backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`}}>
                <div className='hero_content max_width'>
                    {playTrailer ? <button className='btn btn_close'
                                           onClick={() => setPlayTrailer(false)}>Close</button> : null}
                    {selectedMovie.videos && playTrailer ? renderTrailer() : null}
                    <button className='btn' onClick={() => setPlayTrailer(true)}>Play Trailer</button>
                    <h1 className='hero_title'>{selectedMovie.title}</h1>
                    {selectedMovie.overview ? <p className='hero_overview'>{selectedMovie.overview}</p> : null}
                </div>
            </div>
            <div className='container max_width'>
                {renderMovies()}
            </div>
        </div>
    )
}


export default MoviesList;