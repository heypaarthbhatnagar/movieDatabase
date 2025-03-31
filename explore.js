const API_KEY = "d787815864d22e6f9656784e3a810622"; // Replace with your TMDb API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Function to fetch and display a random movie
async function fetchRandomMovie() {
    try {
        const randomPage = Math.floor(Math.random() * 100) + 1; // Get a random page number
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${randomPage}`
        );
        const data = await response.json();
        const movies = data.results;

        if (movies.length > 0) {
            const randomIndex = Math.floor(Math.random() * movies.length);
            const movie = movies[randomIndex];
            displayMovieDetails(movie);
        } else {
            document.getElementById("movie-details").innerHTML =
                "<p>No movie found. Try again later.</p>";
        }
    } catch (error) {
        console.error("Error fetching random movie:", error);
        document.getElementById("movie-details").innerHTML =
            "<p>Failed to load movie details. Please try again later.</p>";
    }
}

// Function to display movie details and navigate to movies.html on click
function displayMovieDetails(movie) {
    const posterPath = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : "placeholder.jpg";
    const releaseYear = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";
    const movieDetails = `
        <div class="movie-details">
            <img src="${posterPath}" alt="${movie.title}" onclick="viewMovieDetails(${movie.id})">
            <h2 onclick="viewMovieDetails(${movie.id})" style="cursor:pointer; color:#ff4081;">${movie.title}</h2>
            <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
            <p><strong>Overview:</strong> ${movie.overview || "No description available."}</p>
            <p><strong>Rating:</strong> ⭐ ${movie.vote_average}/10</p>
        </div>
    `;
    document.getElementById("movie-details").innerHTML = movieDetails;
}

// Function to navigate to movie details page
function viewMovieDetails(movieId) {
    window.location.href = `movies.html?id=${movieId}`;
}

// Fetch a random movie when page loads
window.onload = fetchRandomMovie;
