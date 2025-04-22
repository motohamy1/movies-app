/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/movieCard.jsx'
import { useDebounce } from 'react-use'
import { /* getTrendingMovies, */ updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [searchTerm, setSearchTerm] = useState('');

    const [movieList, setMovieList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const [trendingMovies, setTrendingMovies] = useState([]);

    // Debounce the search term to prevent making too many API requests
    // by waiting for the user to stop typing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        setMovieList([]); // Clear previous results when starting a new fetch

        try {
            const endpoint = query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);
            const data = await response.json(); // Parse JSON regardless of response.ok

            if(!response.ok) {
                // Use TMDB's status message if available, otherwise a generic error
                throw new Error(data.status_message || `HTTP error! status: ${response.status}`);
            }

            // Removed OMDb-specific check:
            // if(data.Response === 'False') { ... }

            if (!data.results || data.results.length === 0) {
                setErrorMessage(query ? `No movies found for "${query}"` : 'No popular movies found.');
                // Keep movieList empty, already cleared above
            } else {
                setMovieList(data.results);
            }

            // Only call updateSearchCount if it was a search query and results were found
            if(query && data.results && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            // Display a user-friendly error message
            setErrorMessage(error.message || 'Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    // const loadTrendingMovies = async () => {
    //     try {
    //         // Ensure getTrendingMovies returns data compatible with MovieCard
    //         const movies = await getTrendingMovies();
    //         // Add default values for fields potentially missing from Appwrite data
    //         const formattedMovies = movies.map(movie => ({
    //             ...movie, // Includes id, poster_path, title from getTrendingMovies mapping
    //             vote_average: movie.vote_average || 0, // Provide default
    //             release_date: movie.release_date || '', // Provide default
    //             original_language: movie.original_language || 'N/A' // Provide default
    //         }));
    //         setTrendingMovies(formattedMovies);
    //     } catch (error) {
    //         console.error(`Error fetching trending movies: ${error}`);
    //         // Optionally set an error message for trending movies
    //     }
    // }

        useEffect(() => {
        fetchMovies(debouncedSearchTerm);
        }, [debouncedSearchTerm]);

        // useEffect(() => {
        // loadTrendingMovies();
        // }, []);

    return (
    <>
        <main>
            <div className="pattern"/>

            <div className="wrapper">
            <header>
                <img src="/hero-img.png" alt="Hero Banner" />
                <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            {/* Use MovieCard for trending movies and ensure data structure matches */}
            {/* {trendingMovies.length > 0 && (
                <section className="trending">
                <h2>Trending Movies</h2>
                <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {trendingMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </ul>
                </section>
            )} */}

            <section className="all-movies">
                <h2>All Movies</h2>

                {isLoading ? (
                <Spinner />
                ) : errorMessage ? (
                <p className="text-red-500 text-center py-4">{errorMessage}</p> // Centered error message
                // Check if movieList is empty *after* loading and no error occurred
                ) : movieList.length === 0 && !isLoading ? (
                    <p className="text-gray-400 text-center py-4">No movies to display.</p> // Handle empty state explicitly
                ) : (
                // Use the same grid layout as trending
                <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                    ))}
                </ul>
                )}
            </section>
            </div>
        </main>
    </>
    )
}

export default App