import React from "react";
import PosterCard from "../../posterCard";

export default function TVCard({ tv }) {
  return <PosterCard item={tv} title={tv.name} date={tv.first_air_date} to={`/tvshow/${tv.id}`} />;
}
