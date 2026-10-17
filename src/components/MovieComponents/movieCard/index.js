import React from "react";
import PosterCard from "../../posterCard";

export default function MovieCard({ movie }) {
  return <PosterCard item={movie} title={movie.title} date={movie.release_date} to={`/movie/${movie.id}`} />;
}
