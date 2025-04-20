import React from 'react'
import PropTypes from 'prop-types';

// Define the component first
const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language } }) => {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-white">
            <img
                src={poster_path ?
                    `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-poster.png'} // Ensure /no-poster.png exists in public
                alt={title}
                className="w-full h-auto object-cover" // Basic image styling
            />

            <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate" title={title}>{title || 'No Title'}</h3>

                <div className="content flex items-center gap-2 text-sm text-gray-400">
                    <div className="rating flex items-center">
                        <img src="/star.svg" alt="Star" className="w-4 h-4 mr-1" /> {/* Ensure /star.svg exists */}
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className="lang uppercase">{original_language || 'N/A'}</p>

                    <span>•</span>
                    <p className="year">
                        {/* Corrected typo: splite -> split */}
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}

// Define propTypes *after* the component declaration
MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        vote_average: PropTypes.number,
        poster_path: PropTypes.string,
        release_date: PropTypes.string,
        original_language: PropTypes.string
    }).isRequired
}

export default MovieCard
