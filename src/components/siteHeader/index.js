import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Container, useMediaQuery, Grid, Icon, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box"; 
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserById } from "../../api/userDataStorage";
import { SiteDataContext } from "../../contexts/siteDataContext";
import { getSearchResults } from "../../api/TMDBAPI"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './index.css';

const Header = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { adultContent, darkMode } = React.useContext(SiteDataContext);
  const [searchResults, setSearchResults] = useState([]); // State for storing search results
  const [searchHistory, setSearchHistory] = useState([]); // State for storing search history
  const [inputValue, setInputValue] = useState(""); // State for storing user input
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:850px)');
  const [canGoForward, setCanGoForward] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [lastScrollY, setLastScrollY] = useState(0); // Track the last scroll position
  const [visible, setVisible] = useState(true); // Track the visibility of the header
  const [headerPos, setHeaderPos] = useState("static"); // Track the position of the header

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserById(user.uid).then((userData) => {
          setUser(userData);
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch search results based on input value
  useEffect(() => {
    if (inputValue) {
      setLoadingSearch(true);
      getSearchResults(inputValue).then((results) => {
        setSearchResults(results);
        setLoadingSearch(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [inputValue]);

  const handleSearch = (event, value) => {
    if (!value) return;
    setSearchHistory([...searchHistory, value]);
    if (value.media_type === "movie") {
      navigate(`/movie/${value.id}`);
    } else if (value.media_type === "tv") {
      navigate(`/tvshow/${value.id}`);
    } else {
      navigate(`/person/${value.id}`);
    }
  };

  const handleAutoFill = (event, value) => {
    const query = event.target.value;
    console.log(isMobile ? 'mobile' : 'desktop');
    getSearchResults(1, query).then((results) => {
      setSearchResults(results.sort((a, b) => b.popularity - a.popularity));
    });
  };

  const capitalize = (string) => {
    if (!string) return '';
    if (string === 'tv') return 'TV';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "0" }}>
      <AppBar
        position="static"
        sx={{
          margin: isMobile ? ".1em 0.1em 1em 0.1em" : isTablet ? ".2em 0.5em 1em 0.5em" : ".25em 1em 1em 1em",
          borderRadius: "1em",
          width: isMobile ? "calc(100% - .1em)" : isTablet ? "calc(100% - 1em)" : "calc(100% - 2em)",
          justifyContent: "center",
        }}
      >
        <Toolbar sx={{ flexDirection: isMobile ? "column" : "row" }}>
          {user && user.active ? (
            <>
              <Container sx={{
                display: isMobile ? 'block' : 'flex',
                justifyContent: 'flex-start',
                width: isMobile ? '100%' : '50em',
                flexGrow: 1,
                flexDirection: isTablet ? 'column' : 'row',
                alignItems: isTablet ? 'center' : 'flex-start',
                alignContent: isTablet ? 'center' : 'flex-start',
                justifyItems: isTablet ? 'center' : 'flex-start',
                marginLeft: '0 !important',
              }}>
                <Typography variant="h6" component="div" sx={{ marginTop: isMobile ? '.5em' : 0, width: isMobile ? '100%' : '18em', display: 'flex', justifyContent: isMobile || isTablet ? 'center' : 'flex-start' }}>
                  <Button color="inherit" onClick={() => navigate("/home")}>
                    Movie App - {user.firstName} {user.lastName}{"  "}
                    {adultContent ? '🌶️' : ''}
                  </Button>
                </Typography>

                <Grid container spacing={2} sx={{ display: isMobile ? 'flex' : null, justifyContent: isMobile || isTablet  ? 'center' : 'flex-start', width: '100%' }}>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => navigate(-1)}><ArrowBackIcon /></Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => navigate(1)}><ArrowForwardIcon /></Button>
                  </Grid>
                </Grid>
              </Container>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: isTablet ? 'column' : 'row',
                  width: isMobile ? "100%" : "25em",
                  marginTop: isMobile ? ".5em" : 0, // Adds space on mobile view
                }}
                >
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: isMobile ? "100%" : isTablet ? '20em' :"25em",
                  height: "75%",
                  marginTop: isMobile || isTablet ? ".5em" : 0, // Adds space on mobile view
                }} 
                id="search-container"
              >
                {loadingSearch ? (
                  <CircularProgress />
                ) : (
                  <Autocomplete
                    id="search-bar"
                    sx={{
                      backgroundColor: darkMode ? "#333333" : "#f0f0f0",
                      borderRadius: 2,
                      width: "100%",
                    }}
                    options={searchResults ? searchResults : searchHistory}
                    autoHighlight
                    getOptionLabel={(option) =>
                      option.media_type === "movie" ? option.title : option.name
                    }
                    onChange={handleSearch}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <img
                          loading="lazy"
                          width="25"
                          src={`https://image.tmdb.org/t/p/w500/${
                            option.media_type === "person"
                              ? option.profile_path
                              : option.poster_path
                          }`}
                          alt=""
                        />
                        {option.media_type === "movie" ? option.title : option.name}{" "}
                        ({capitalize(option.media_type)}){" "}
                        {option.adult ? "(Adult)" : ""}
                        {option.media_type === "person"
                          ? option.media_type === "movie"
                            ? option.release_date
                            : option.first_air_date
                          : ""}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search the database..."
                        inputProps={{
                          ...params.inputProps,
                        }}
                        onChange={handleAutoFill}
                        onAction={handleSearch}
                      />
                    )}
                  />
                )}
              </Container>
              <Container sx={{ display: "flex", marginBottom: isMobile ? '.5em' : 0, justifyContent: isMobile || isTablet ? 'center' : 'flex-end', width: isMobile ? '100%' : '18em', marginRight: '0 !important' }}>
                <Button color="inherit" sx={{ marginTop: isMobile ? "0.5em" : 0, marginRight: isMobile ? '.5em' : 0 }} onClick={() => navigate("/movielist")}>
                  Watch Lists
                </Button>
                <Button color="inherit" sx={{ marginTop: isMobile ? "0.5em" : 0, marginLeft: isMobile ? '.5em' : 0 }} onClick={() => navigate("/usermgmt")}>
                  Settings
                </Button>
              </Container>
              </Container>
            </>
          ) : (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginTop: isMobile ? '.5em' : 0 }}>
              Movie App
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
