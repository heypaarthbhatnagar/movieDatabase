const API_KEY = 'd787815864d22e6f9656784e3a810622'; // TMDB API Key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKGROUND_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const PROFILE_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Create star rating system with improved functionality
function createStarRating(movieId) {
    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('star-rating');

    const storedRating = localStorage.getItem(`rating-${movieId}`) || 0;

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = '★';
        star.dataset.rating = i;
        star.classList.add('star');
        if (i <= storedRating) {
            star.classList.add('active');
        }

        // Highlight stars on hover
        star.addEventListener('mouseover', () => highlightStars(ratingDiv, i));
        star.addEventListener('mouseleave', () => resetStars(ratingDiv, storedRating));

        // Handle star click
        star.addEventListener('click', () => handleRating(movieId, i, ratingDiv));
        ratingDiv.appendChild(star);
    }

    // Add feedback message
    const feedbackMessage = document.createElement('p');
    feedbackMessage.classList.add('feedback-message');
    feedbackMessage.innerText = getFeedbackMessage(storedRating);
    ratingDiv.appendChild(feedbackMessage);

    return ratingDiv;
}

// Highlight stars dynamically on hover
function highlightStars(ratingDiv, rating) {
    const stars = ratingDiv.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

// Reset stars to previously selected rating
function resetStars(ratingDiv, storedRating) {
    const stars = ratingDiv.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < storedRating);
    });
}

// Handle star click and save rating in localStorage
function handleRating(movieId, rating, ratingDiv) {
    const scaledRating = rating * 2;
    localStorage.setItem(`rating-${movieId}`, rating);

    const stars = ratingDiv.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });

    // Update feedback message dynamically
    const feedbackMessage = ratingDiv.querySelector('.feedback-message');
    feedbackMessage.innerText = getFeedbackMessage(rating);

    alert(`You rated this movie ${rating} stars!`);
}

// Get feedback message based on rating
function getFeedbackMessage(rating) {
    switch (parseInt(rating)) {
        case 1: return "😞 Not impressed!";
        case 2: return "😐 Could be better.";
        case 3: return "🙂 Decent movie!";
        case 4: return "😊 Really good!";
        case 5: return "🤩 Absolutely amazing!";
        default: return "Rate this movie!";
    }
}

// Fetch and display movie details
async function fetchMovieDetails() {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        const movie = await response.json();

        const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'placeholder.jpg';
        const backgroundPath = movie.backdrop_path ? `${BACKGROUND_IMAGE_BASE}${movie.backdrop_path}` : 'placeholder.jpg';

        // Set background poster dynamically
        document.getElementById('background-poster').style.backgroundImage = `url(${backgroundPath})`;

        const title = movie.title || 'N/A';
        const originalTitle = movie.original_title || 'N/A';
        const tagline = movie.tagline || '';
        const overview = movie.overview || 'No overview available.';
        const releaseDate = movie.release_date || 'N/A';
        const runtime = movie.runtime ? `${movie.runtime} minutes` : 'N/A';
        const voteAverage = movie.vote_average || 'N/A';
        const voteCount = movie.vote_count || '0';
        const genres = movie.genres && movie.genres.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'N/A';
        const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A';
        const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A';
        const status = movie.status || 'N/A';
        const popularity = movie.popularity ? movie.popularity.toFixed(1) : 'N/A';
        const languages = movie.spoken_languages && movie.spoken_languages.length > 0 ? movie.spoken_languages.map(l => l.name).join(', ') : 'N/A';
        const productionCompanies = movie.production_companies && movie.production_companies.length > 0 ? movie.production_companies : [];

        // Populate movie details
        const movieDetailsDiv = document.getElementById('movie-details');
        movieDetailsDiv.innerHTML = `
            <div class="movie-poster">
                <img src="${posterPath}" alt="${title}">
            </div>
            <div class="movie-info">
                <h2>${title}</h2>
                ${tagline ? `<p><em>${tagline}</em></p>` : ''}
                <p><strong>Original Title:</strong> ${originalTitle}</p>
                <p><strong>Overview:</strong> ${overview}</p>
                <p><strong>Release Date:</strong> ${releaseDate}</p>
                <p><strong>Runtime:</strong> ${runtime}</p>
                <p><strong>Rating:</strong> ${voteAverage} / 10 (${voteCount} votes)</p>
                <p><strong>Genres:</strong> ${genres}</p>
                <p><strong>Budget:</strong> ${budget}</p>
                <p><strong>Revenue:</strong> ${revenue}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Popularity:</strong> ${popularity}</p>
                <p><strong>Spoken Languages:</strong> ${languages}</p>
                <p><strong>Production Companies:</strong> ${productionCompanies.map(company => company.name).join(', ') || 'N/A'}</p>
                ${productionCompanies.length > 0 ? `
                    <div class="production-logos">
                        ${productionCompanies.map(company => 
                            company.logo_path ? `<img src="${IMAGE_BASE_URL}${company.logo_path}" alt="${company.name}" class="production-logo">` : ''
                        ).join('')}
                    </div>` : ''}
            </div>
        `;

        // Add star rating to movie details
        const starRating = createStarRating(movieId);
        movieDetailsDiv.querySelector('.movie-info').appendChild(starRating);

        // Fetch additional details
        fetchMovieTrailer(movieId);
        fetchMovieCast(movieId);
        fetchSimilarMovies(movieId);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        document.getElementById('movie-details').innerHTML = '<p>Failed to load movie details.</p>';
    }
}

// Fetch and display movie trailer
async function fetchMovieTrailer(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) {
            throw new Error('Failed to fetch trailer');
        }
        const data = await response.json();
        const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

        const trailerContainer = document.getElementById('trailer-container');
        if (trailer) {
            trailerContainer.innerHTML = `
                <iframe width="100%" height="500" src="https://www.youtube.com/embed/${trailer.key}" 
                    frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            `;
        } else {
            trailerContainer.innerHTML = '<p>No trailer available for this movie.</p>';
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        document.getElementById('trailer-container').innerHTML = '<p>Failed to load trailer.</p>';
    }
}

// Fetch and display movie cast
async function fetchMovieCast(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) {
            throw new Error('Failed to fetch cast');
        }
        const data = await response.json();
        const cast = data.cast.slice(0, 5); // Limit to top 5 cast members

        const castList = document.getElementById('cast-list');
        if (cast.length > 0) {
            castList.innerHTML = cast.map(actor => `
                <div class="actor">
                    ${actor.profile_path ? `<img src="${PROFILE_IMAGE_BASE}${actor.profile_path}" alt="${actor.name}">` : '<img src="placeholder.jpg" alt="No Image">'}
                    <h3>${actor.name}</h3>
                    <p><strong>Character:</strong> ${actor.character || 'N/A'}</p>
                </div>
            `).join('');
        } else {
            castList.innerHTML = '<p>No cast information available.</p>';
        }
    } catch (error) {
        console.error('Error fetching cast:', error);
        document.getElementById('cast-list').innerHTML = '<p>Failed to load cast details.</p>';
    }
}

// Fetch and display similar movies
async function fetchSimilarMovies(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
        if (!response.ok) {
            throw new Error('Failed to fetch similar movies');
        }
        const data = await response.json();
        const similarMovies = data.results.slice(0, 5); // Limit to 5 similar movies

        const similarMoviesDiv = document.getElementById('similar-movies');
        if (similarMovies.length > 0) {
            similarMoviesDiv.innerHTML = similarMovies.map(movie => `
                <div class="movie">
                    ${movie.poster_path ? `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">` : '<img src="placeholder.jpg" alt="No Image">'}
                    <h2>${movie.title}</h2>
                    <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'} / 10</p>
                </div>
            `).join('');
        } else {
            similarMoviesDiv.innerHTML = '<p>No similar movies found.</p>';
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        document.getElementById('similar-movies').innerHTML = '<p>Failed to load similar movies.</p>';
    }
}

// Fetch and display movie details
fetchMovieDetails();