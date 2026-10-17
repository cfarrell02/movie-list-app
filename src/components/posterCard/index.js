import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import defaultImage from "../../images/default.jpg";

const posterUrl = (item) => {
  const path = item.poster_path || item.backdrop_path;
  return path ? `https://image.tmdb.org/t/p/w342${path}` : defaultImage;
};

// Shared poster tile used for movies and TV shows so every grid looks the same
const PosterCard = ({ item, title, date, to }) => {
  const year = date ? new Date(date).getFullYear() : null;
  const rating = item.vote_average ? (Math.round(item.vote_average * 10) / 10).toFixed(1) : null;

  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "transparent",
        border: "none",
        overflow: "visible",
        "&:hover .poster-frame": { transform: "translateY(-4px)", boxShadow: 8 },
      }}
    >
      <CardActionArea component={RouterLink} to={to} sx={{ borderRadius: '12px' }}>
        <Box
          className="poster-frame"
          sx={{
            position: "relative",
            aspectRatio: "2 / 3",
            borderRadius: '12px',
            overflow: "hidden",
            bgcolor: "action.hover",
            boxShadow: 2,
            transition: "transform .2s ease, box-shadow .2s ease",
          }}
        >
          <Box
            component="img"
            src={posterUrl(item)}
            alt={title}
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {rating && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                gap: 0.25,
                px: 0.75,
                py: 0.25,
                borderRadius: '6px',
                bgcolor: "rgba(0,0,0,.72)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                backdropFilter: "blur(4px)",
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 14, color: "#F5B544" }} />
              {rating}
            </Box>
          )}
        </Box>
        <Box sx={{ pt: 1, px: 0.25 }}>
          <Typography variant="body2" fontWeight={600} noWrap title={title}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {year || "TBA"}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default PosterCard;
