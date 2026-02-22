import { youtubeTrailer } from "../modules/movieDatabaseHelpers";
import { director } from "../modules/movieDatabaseHelpers";
import { fetchMovieInfo } from "../modules/fetchers";
import { topThreeStars } from "../modules/movieDatabaseHelpers";
import { useState, useEffect } from "react";

export default function MovieCard({ movieID }) {
  const [trailerIsVisible, setTrailerIsVisible] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await fetchMovieInfo(movieID);
        setMovieInfo(data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    loadMovie();
  }, [movieID]);

  if (error) {
    return <p>Error loading movie.</p>;
  }

  if (!movieInfo) {
    return <p>Loading...</p>;
  }

  const title = movieInfo.title;
  const year = movieInfo.release_date.slice(0, 4);
  const description = movieInfo.description;
  const poster = `https://image.tmdb.org/t/p/w94_and_h141_face/${movieInfo.backdrop_path}`;
  const stars = topThreeStars(movieInfo);
  const direct = director(movieInfo);
  const youtubeCode = youtubeTrailer(movieInfo);

  return (
    <section className="filmCard">
      <div className="filmCardPosterWrapper">
        <img className="filmCardPoster" src={poster}></img>
      </div>
      <section className="filmCardInfo">
        <div className="filmCardTitleWrapper">
          <h3 className="filmCardTitle">{title}</h3>
          <p className="filmCardYear">{year}</p>
          <button onClick={() => setTrailerIsVisible(true)}>
            Watch Trailer
          </button>
        </div>
        <p className="filmCardDescription">Director: {direct}</p>
        <p className="filmCardDescription">Starring: {stars}</p>
      </section>

      {trailerIsVisible && (
        <div className="modal" onClick={() => setTrailerIsVisible(false)}>
          <iframe
            width="100%"
            height="auto"
            src={
              youtubeCode
                ? `https://www.youtube.com/embed/${youtubeCode}?si=AC682HuqAQsnaPVO`
                : "https://www.youtube.com/embed/Aq5WXmQQooo?si=vF3-F1cF88KaQxhg"
            }
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      )}
    </section>
  );
}
