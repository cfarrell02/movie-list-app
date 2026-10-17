import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  TableContainer,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getTVSeason } from "../../../api/TMDBAPI";

const TVEpisodesSummary = ({ tvShow }) => {
  const [seasons, setSeasons] = useState([]);
  const [longest, setLongest] = useState({});
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasons = async () => {
      let seasons = tvShow.seasons || [];
      setLoading(true);

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
      setLoading(false);
    };
    fetchSeasons();
  }, [tvShow]);

const getColor = (rating) => {
    if (!rating) return "#6B7280"; // unrated
    if (rating >= 9) return "#15803D";
    if (rating >= 8) return "#16A34A";
    if (rating >= 7) return "#65A30D";
    if (rating >= 6) return "#D97706";
    return "#DC2626";
};

return (
  <Box>
    {loading ? (
    <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "5em" }}>
      <CircularProgress />
    </Container>
    ) : (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ p: 1, borderRadius: '16px', maxHeight: '40em', overflowX: "auto" }}>
      <Table sx={{ borderCollapse: "separate", borderSpacing: "6px" }}>
        <TableHead>
        <TableRow>
          <TableCell sx={{ ...headerCellStyle, textAlign: "left" }}>Season</TableCell>
          {longest.episodes &&
          longest.episodes.map((episode, index) => (
            <TableCell key={index} sx={headerCellStyle}>{index + 1}</TableCell>
          ))}
        </TableRow>
        </TableHead>
        <TableBody>
        {seasons.map((season) => (
          <TableRow key={season.id}>
          <TableCell sx={seasonCellStyle}>{season.name}</TableCell>
          {season.episodes.map((episode, index) => (
            <Tooltip title={episode.name} key={index} onClick={() => setSelectedEpisode(episode)}>
            <TableCell
              sx={{
              ...bodyCellStyle,
              backgroundColor: getColor(episode.vote_average),
              outline: episode === selectedEpisode ? "3px solid" : "none",
              outlineColor: "text.primary",
              outlineOffset: "1px",
              "&:hover": {
                backgroundColor: (theme) =>
                theme.palette.augmentColor({
                  color: { main: getColor(episode.vote_average) },
                }).dark,
              },
              }}
            >
              {episode.vote_average !== 0 ? episode.vote_average.toFixed(1) : "–"}
            </TableCell>
            </Tooltip>
          ))}
          </TableRow>
        ))}
        </TableBody>
      </Table>
      </TableContainer>

      {selectedEpisode && (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: "primary.main", mt: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          S{selectedEpisode.season_number} · E{selectedEpisode.episode_number}
          {selectedEpisode.air_date ? ` · ${new Date(selectedEpisode.air_date).toLocaleDateString()}` : ""}
        </Typography>
        <Typography variant="h6">{selectedEpisode.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{selectedEpisode.overview || "No synopsis available."}</Typography>
      </Paper>
      )}
    </>
    )}
  </Box>
);
};

// Common styles for cells
const headerCellStyle = {
  color: "text.secondary",
  fontWeight: 600,
  fontSize: 12,
  border: 0,
  p: 0.5,
  textAlign: "center",
  whiteSpace: "nowrap",
};

const seasonCellStyle = {
  fontWeight: 600,
  whiteSpace: "nowrap",
  border: 0,
  py: 1,
  px: 1.5,
  borderRadius: "8px",
  bgcolor: "action.hover",
};

const bodyCellStyle = {
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  border: 0,
  borderRadius: "8px",
  py: 1,
  px: 0.5,
  minWidth: 44,
  textAlign: "center",
  cursor: "pointer",
};

export default TVEpisodesSummary;
