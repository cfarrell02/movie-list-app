import React from "react";
import PosterCard from "../../posterCard";
import { coverUrl, workId } from "../../../api/bookAPI";

// Works with Open Library search/trending docs and with books stored in lists
export default function BookCard({ book }) {
  const authors = book.author_name || book.authors || [];
  const subtitle = [authors[0], book.first_publish_year].filter(Boolean).join(" · ") || "Unknown";
  return (
    <PosterCard
      item={book}
      title={book.title}
      to={`/book/${workId(book.key || book.id)}`}
      image={coverUrl(book.cover_i)}
      rating={book.ratings_average || null}
      subtitle={subtitle}
    />
  );
}
