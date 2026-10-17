import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import { SiteDataContext } from "../../contexts/siteDataContext";
import { getSearchResults } from "../../api/TMDBAPI";
import { coverUrl, getBookSearchResults, workId } from "../../api/bookAPI";
import { FeatureFlagContext } from "../../contexts/featureFlagContext";
import { filterAdult } from "../../utils";

const SEARCH_DEBOUNCE_MS = 300;

const mediaLabel = { movie: "Movie", tv: "TV", person: "Person", book: "Book" };
const MAX_TMDB_RESULTS = 10;
const MAX_BOOK_RESULTS = 4;

// Group headings in the dropdown, in display order
const groupOf = (option) => (option.media_type === "person" ? "People" : option.media_type === "book" ? "Books" : "Movies & TV");
const GROUP_ORDER = ["Movies & TV", "People", "Books"];
const byGroup = (options) => [...options].sort((a, b) => GROUP_ORDER.indexOf(groupOf(a)) - GROUP_ORDER.indexOf(groupOf(b)));

const toBookOption = (doc) => ({
  media_type: "book",
  id: workId(doc.key),
  title: doc.title,
  author: doc.author_name?.[0],
  year: doc.first_publish_year,
  cover: coverUrl(doc.cover_i, "S"),
});

const getOptionTitle = (option) => (option.media_type === "movie" || option.media_type === "book" ? option.title : option.name) || "";

const getOptionYear = (option) => {
  if (option.media_type === "book") return option.year || null;
  const date = option.media_type === "movie" ? option.release_date : option.first_air_date;
  return date ? new Date(date).getFullYear() : null;
};

const SearchBar = ({ fullWidth }) => {
  const navigate = useNavigate();
  const { adultContent } = useContext(SiteDataContext);
  const { getFeatureFlag } = useContext(FeatureFlagContext);
  const booksEnabled = !!getFeatureFlag("Books")?.enabled;
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  // Debounce lookups and ignore responses that arrive out of order
  useEffect(() => {
    const query = inputValue.trim();
    if (!query) {
      setOptions([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      // TMDB usually answers faster than Open Library, so show its results first and add books when they arrive
      let tmdb = [];
      let books = [];
      const update = () => {
        if (id === requestId.current) setOptions(byGroup([...tmdb, ...books]));
      };
      const tmdbRequest = getSearchResults(1, query)
        .then((results) => {
          tmdb = filterAdult(results, adultContent)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, MAX_TMDB_RESULTS);
          update();
        })
        .catch((error) => console.error(error));
      const bookRequest = booksEnabled
        ? getBookSearchResults(1, query, MAX_BOOK_RESULTS)
            .then((data) => {
              books = (data.docs || []).slice(0, MAX_BOOK_RESULTS).map(toBookOption);
              update();
            })
            .catch((error) => console.error(error))
        : Promise.resolve();
      await Promise.all([tmdbRequest, bookRequest]);
      if (id === requestId.current) {
        update();
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, adultContent, booksEnabled]);

  const handleSelect = (event, value) => {
    if (!value || typeof value === "string") return;
    const paths = { movie: "movie", tv: "tvshow", person: "person", book: "book" };
    const path = paths[value.media_type] || "person";
    navigate(`/${path}/${value.id}`);
    setInputValue("");
    setOptions([]);
  };

  return (
    <Autocomplete
      id="site-search"
      sx={{ width: fullWidth ? "100%" : { md: 320, lg: 420 } }}
      options={options}
      value={null}
      inputValue={inputValue}
      onInputChange={(event, value, reason) => {
        if (reason !== "reset") setInputValue(value);
      }}
      onChange={handleSelect}
      filterOptions={(x) => x}
      groupBy={groupOf}
      getOptionLabel={getOptionTitle}
      isOptionEqualToValue={(a, b) => a.id === b.id && a.media_type === b.media_type}
      loading={loading}
      noOptionsText={inputValue.trim() ? (loading ? "Searching…" : "No results") : booksEnabled ? "Search movies, TV, people and books" : "Search movies, TV shows and people"}
      autoHighlight
      forcePopupIcon={false}
      blurOnSelect
      clearOnBlur={false}
      renderOption={(props, option) => {
        const tmdbImage = option.media_type === "person" ? option.profile_path : option.poster_path;
        const imageUrl = option.media_type === "book" ? option.cover : tmdbImage ? `https://image.tmdb.org/t/p/w92${tmdbImage}` : undefined;
        const year = getOptionYear(option);
        return (
          <Box component="li" {...props} key={`${option.media_type}-${option.id}`} sx={{ gap: 1.5 }}>
            <Avatar
              variant={option.media_type === "person" ? "circular" : "rounded"}
              src={imageUrl || undefined}
              sx={{ width: 36, height: option.media_type === "person" ? 36 : 54, bgcolor: "action.hover" }}
            >
              {getOptionTitle(option).charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {getOptionTitle(option)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {mediaLabel[option.media_type] || option.media_type}
                {option.author ? ` · ${option.author}` : ""}
                {year ? ` · ${year}` : ""}
                {option.adult ? " · Adult" : ""}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder={booksEnabled ? "Search movies, TV, people, books…" : "Search movies, TV, people…"}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 0.5 }}>
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

const NavButton = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
  return (
    <Button
      component={RouterLink}
      to={to}
      color="inherit"
      sx={{
        color: active ? "primary.main" : "text.secondary",
        bgcolor: active ? (theme) => alpha(theme.palette.primary.main, 0.1) : "transparent",
        "&:hover": { color: "text.primary" },
      }}
    >
      {children}
    </Button>
  );
};

const Header = ({ user }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { adultContent, darkMode, setDarkMode } = useContext(SiteDataContext);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "";

  const go = (path) => {
    setMenuAnchor(null);
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "saturate(180%) blur(12px)",
        backgroundColor: alpha(theme.palette.background.default, 0.8),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1.5, minHeight: { xs: 60, md: 68 } }}>
          <Box
            component={RouterLink}
            to={user ? "/home" : "/usermgmt"}
            sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", color: "text.primary", mr: 1 }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                display: "grid",
                placeItems: "center",
                color: "#fff",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              <MovieFilterIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Watchlist
            </Typography>
          </Box>

          {user && !isMobile && (
            <>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <NavButton to="/home">Browse</NavButton>
                <NavButton to="/movielist">Watch Lists</NavButton>
              </Box>
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <SearchBar />
              </Box>
            </>
          )}
          {(!user || isMobile) && <Box sx={{ flex: 1 }} />}

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Back">
                <IconButton size="small" onClick={() => navigate(-1)} aria-label="Go back">
                  <ArrowBackIosNewIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Forward">
                <IconButton size="small" onClick={() => navigate(1)} aria-label="Go forward">
                  <ArrowForwardIosIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
            <IconButton onClick={() => setDarkMode(!darkMode)} aria-label="Toggle colour theme">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {user && (
            <>
              <Tooltip title="Account">
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0.5 }} aria-label="Account menu">
                  <Avatar sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 700, bgcolor: "primary.main" }}>
                    {initials || "?"}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { mt: 1, minWidth: 220 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography fontWeight={700}>
                    {user.firstName} {user.lastName} {adultContent ? "🌶️" : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
                {isMobile && <MenuItem onClick={() => go("/home")}>Browse</MenuItem>}
                {isMobile && <MenuItem onClick={() => go("/movielist")}>Watch Lists</MenuItem>}
                <MenuItem onClick={() => go("/usermgmt")}>
                  <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                  Account & settings
                </MenuItem>
                {user.admin && (
                  <MenuItem onClick={() => go("/admin")}>
                    <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                    Admin
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Toolbar>
        {user && isMobile && (
          <Box sx={{ pb: 1.5 }}>
            <SearchBar fullWidth />
          </Box>
        )}
      </Container>
    </AppBar>
  );
};

export default Header;
