import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  TableContainer,
  Paper,
} from "@mui/material";
import { getTVSeason } from "../../../api/TMDBAPI";
import { hover } from "@testing-library/user-event/dist/hover";

const TVEpisodesSummary = ({ tvShow }) => {
  const [seasons, setSeasons] = useState([]);
  const [longest, setLongest] = useState({});

  useEffect(() => {
    const fetchSeasons = async () => {
      let seasons = tvShow.seasons || [];

      seasons = seasons.filter((season) => season.name !== "Specials");

      seasons = await Promise.all(
        seasons.map(async (season) => {
          const seasonData = await getTVSeason(tvShow.id, season.season_number);
          seasonData.vote_average = Math.round(seasonData.vote_average * 10) / 10;
          seasonData.episodes = seasonData.episodes.map((episode) => {
            episode.vote_average = Math.round(episode.vote_average * 10) / 10;
            return episode;
          });
          return { ...season, ...seasonData };
        })
      );

      const longest = seasons.length
        ? seasons.reduce((a, b) => (a.episodes.length > b.episodes.length ? a : b))
        : {};
      setLongest(longest);
      setSeasons(seasons);
    };
    fetchSeasons();
  }, [tvShow]);

const getColor = (rating) => {
    if (rating >= 9) return "rgb(0, 100, 0)"; // dark green
    if (rating >= 8) return "rgb(0, 128, 0)"; // green
    if (rating >= 6) return "rgb(255, 165, 0)"; // orange
    if (rating === 0) return /* grey */ "rgb(128, 128, 128)";
    return "rgb(255, 0, 0)"; // red
};

return (
    <Container>
        <TableContainer component={Paper} sx={{ p: 2, borderRadius: 3, maxHeight:'40em', overflowX: "auto" }}>
            <Table sx={{ borderCollapse: "separate", borderSpacing: "10px" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerCellStyle}>Season</TableCell>
                        {longest.episodes &&
                            longest.episodes.map((episode, index) => (
                                <TableCell key={index} sx={headerCellStyle}>{`Ep${index + 1}`}</TableCell>
                            ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {seasons.map((season) => (
                        <TableRow key={season.id}>
                            <TableCell sx={bodyCellStyle}>{season.name}</TableCell>
                            {season.episodes.map((episode, index) => (
                                <Tooltip title={episode.name} key={index}>
                                    <TableCell
                                        sx={{
                                            ...bodyCellStyle,
                                            backgroundColor: getColor(episode.vote_average),
                                            "&:hover": {
                                                backgroundColor: (theme) =>
                                                    theme.palette.augmentColor({
                                                        color: { main: getColor(episode.vote_average) },
                                                    }).dark,
                                            },
                                        }}
                                    >
                                        {episode.vote_average !== 0 ? episode.vote_average : "-"}
                                    </TableCell>
                                </Tooltip>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
);
};

// Common styles for cells
const headerCellStyle = {
  backgroundColor: "#1976d2",
  color: "white",
  fontWeight: "bold",
  borderRadius: "10px",
  padding: "12px",
  textAlign: "center",
};

const bodyCellStyle = {
  backgroundColor: "#1976d2",
  borderRadius: "10px",
  padding: "12px",
  textAlign: "center",
};

export default TVEpisodesSummary;
