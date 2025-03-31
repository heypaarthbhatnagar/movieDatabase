const API_KEY = 'd787815864d22e6f9656784e3a810622';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const genresList = ["Action", "Comedy", "Drama"]; // For demo purposes

// Global storage for movies (to support filtering)
let moviesData = {
    trending: [],
    latest: [],
    top_rated: []
};

// ----------------------
// Fetch & Display Movies
// ----------------------
async function fetchMovies(endpoint, section) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        const movies = data.results.slice(0, 6);
        moviesData[section] = movies;

        const container = document.getElementById(`${section}-movies`);
        container.innerHTML = "";

        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');

            const randomGenre = genresList[Math.floor(Math.random() * genresList.length)];
            movieDiv.setAttribute('data-genre', randomGenre);
            movieDiv.setAttribute('data-rating', movie.vote_average);

            const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'placeholder.jpg';
            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

            movieDiv.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}">
                <h2 onclick="openMovieDetails(${movie.id})">${movie.title}</h2>
                <p>Director: N/A</p>
                <p>Genre: ${randomGenre}</p>
                <p>⭐ ${movie.vote_average}/10 | ${releaseYear}</p>
            `;

            movieDiv.onmouseover = function() {
                movieDiv.style.border = "2px solid #ff4081";
            };
            movieDiv.onmouseout = function() {
                movieDiv.style.border = "none";
            };

            container.appendChild(movieDiv);
        });
    } catch (error) {
        console.error(`Error fetching movies for ${section}:`, error);
        document.getElementById(`${section}-movies`).innerHTML = '<p>Failed to load movies. Please try again later.</p>';
    }
}

// Open movie details on movies.html
function openMovieDetails(movieId) {
    window.location.href = `movies.html?id=${movieId}`;
}

// Fetch movies for each section
fetchMovies('/trending/movie/week', 'trending');
fetchMovies('/movie/now_playing', 'latest');
fetchMovies('/movie/top_rated', 'top_rated');
// ----------------------
// Filtering Functions
// ----------------------
function filterMovies(category) {
    const sections = ['trending', 'latest', 'top_rated'];
    sections.forEach(sec => {
        const el = document.getElementById(`${sec}-movies`);
        el.style.display = sec === category ? 'flex' : 'none';
    });
}

function filterByGenre(selectedGenre) {
    document.querySelectorAll('.movie').forEach(movieDiv => {
        const genre = movieDiv.getAttribute('data-genre');
        movieDiv.style.display = (selectedGenre === "" || genre === selectedGenre) ? 'block' : 'none';
    });
}

function filterByRating() {
    // Get all selected rating filters
    const checkboxes = document.querySelectorAll('.rating-filters input[type="checkbox"]');
    let selected = [];
    checkboxes.forEach(box => {
        if (box.checked) {
            selected.push(box.value);
        }
    });

    document.querySelectorAll('.movie').forEach(movieDiv => {
        const rating = parseFloat(movieDiv.getAttribute('data-rating'));
        let show = false;
        if (selected.length === 0) {
            show = true; // Show all if no filter is selected
        } else {
            if (selected.includes("low") && rating < 5) show = true;
            if (selected.includes("medium") && rating >= 5 && rating <= 7) show = true;
            if (selected.includes("high") && rating > 7) show = true;
        }
        movieDiv.style.display = show ? 'block' : 'none';
    });
}


// ----------------------
// Modal for Movie Details
// ----------------------
function openModal(movie) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${movie.title}</h2>
            <p>${movie.overview || "No overview available."}</p>
        </div>
    `;
    document.body.appendChild(modal);
}
