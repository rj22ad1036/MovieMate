from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack, csr_matrix
import pandas as pd
import requests
import re
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the movies dataset
df = pd.read_csv("movies.csv")

# Normalize the Rating column only
scaler = MinMaxScaler()
df['Rating'] = scaler.fit_transform(df[['Rating']])

# Define the recommendation function
def recommend_movies(movie_name, num_recommendations=9):
    vectorizer = TfidfVectorizer()
    movie_title = vectorizer.fit_transform(df['Movie Name'])

    # Select relevant features
    genre_columns = ['War', 'Horror', 'Romance', 'Drama', 'Action', 'Comedy', 'Family', 'Animation', 'Science Fiction', 'Adventure']
    numerical_features = csr_matrix(df[['Rating'] + genre_columns].values)
    feature_matrix = hstack([numerical_features, movie_title])
    similarity_matrix = cosine_similarity(feature_matrix)

    matching_movies = df[df['Movie Name'].str.lower().str.contains(movie_name.lower(), na=False)]
    if matching_movies.empty:
        return None

    movie_index = matching_movies.index[0]
    movie_similarity = similarity_matrix[movie_index]
    top_similar_movies = movie_similarity.argsort()[::-1][1:num_recommendations+1]

    recommendations = df.iloc[top_similar_movies][['Movie Name', 'Rating', 'Time']]

    # Multiply rating by 100 and append '%'
    recommendations['Rating'] = recommendations['Rating'].apply(lambda x: f"{x * 100:.2f}%")

    recommendations['Time'] = recommendations['Time'].apply(lambda x: f"{x} min")

    # Return Time as it is in the dataset
    return recommendations.to_dict(orient="records")

@app.route("/recommend", methods=["GET"])
def recommend():
    movie_name = request.args.get("movie_name")
    if not movie_name:
        return jsonify({"error": "Movie name is required"}), 400

    recommendations = recommend_movies(movie_name)
    if not recommendations:
        return jsonify({"error": f"Movie '{movie_name}' not found."}), 404

    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)


# Trailer fetching function
def fetch_imdb_trailer(movie_name):
    query = f"{movie_name} trailer site:imdb.com"
    search_url = f"https://www.google.com/search?q={'+'.join(query.split())}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }

    try:
        # Search IMDb on Google
        response = requests.get(search_url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Find the first IMDb link in the search results
            imdb_link = None
            for a_tag in soup.find_all("a", href=True):
                if "imdb.com/title" in a_tag["href"]:
                    imdb_link = a_tag["href"]
                    if imdb_link.startswith("/url?q="):
                        imdb_link = imdb_link.split("/url?q=")[1].split("&")[0]  # Clean the URL
                    break

            if imdb_link:
                # Fetch the IMDb page
                imdb_response = requests.get(imdb_link, headers=headers)
                if imdb_response.status_code == 200:
                    imdb_soup = BeautifulSoup(imdb_response.text, "html.parser")
                    
                    # Find the trailer link on IMDb
                    trailer_div = imdb_soup.find("a", href=True, text=re.compile("Watch Trailer", re.IGNORECASE))
                    if trailer_div:
                        trailer_url = f"https://www.imdb.com{trailer_div['href']}"
                        return trailer_url
    except Exception as e:
        print(f"Error fetching trailer: {e}")
    
    return None

@app.route("/recommend", methods=["GET"])
def recommend():
    movie_name = request.args.get("movie_name")
    if not movie_name:
        return jsonify({"error": "Movie name is required"}), 400

    recommendations = recommend_movies(movie_name)
    if not recommendations:
        return jsonify({"error": f"Movie '{movie_name}' not found."}), 404

    # Fetch trailers for the recommended movies
    for movie in recommendations:
        trailer_url = fetch_imdb_trailer(movie["Movie Name"])
        movie["trailer_url"] = trailer_url

    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)
