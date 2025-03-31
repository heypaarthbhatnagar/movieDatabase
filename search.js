// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    console.log("Search Query:", query); // Debugging: Check if query is received

    // Display the query in the page
    const queryText = document.getElementById("query-text");
    queryText.textContent = query || "No Query Provided";

    // Check if query is valid
    if (query && query.trim() !== "") {
        searchMovies(query);
    } else {
        document.getElementById("search-results").innerHTML =
            "<p>Please enter a valid search query.</p>";
    }
});

// Search for movies using TMDB API
async function searchMovies(query) {
    const apiKey = "d787815864d22e6f9656784e3a810622"; // Your TMDB API key
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Data:", data); // Debugging: Inspect the response

        // Check if results exist
        if (data.results && data.results.length > 0) {
            displayResults(data.results);
        } else {
            document.getElementById("search-results").innerHTML =
                "<p>No results found for this query!</p>";
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        document.getElementById("search-results").innerHTML =
            `<p>Error loading search results: ${error.message}. Please try again later.</p>`;
    }
}

// Display search results dynamically
function displayResults(movies) {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    movies.forEach((movie) => {
        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image";

        const movieCard = `
            <div class="movie" onclick="redirectToMovie(${movie.id})">
                <img src="${posterPath}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}/10</p>
                <p>${movie.release_date || "N/A"}</p>
            </div>
        `;
        resultsContainer.innerHTML += movieCard;
    });
}

// Redirect to movies.html with movie ID
function redirectToMovie(movieId) {
    window.location.href = `movies.html?id=${movieId}`;
}
