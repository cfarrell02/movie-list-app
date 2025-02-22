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
  const { adultContent , darkMode } = React.useContext(SiteDataContext);
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const isMobile = useMediaQuery('(max-width:600px)');
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

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) return; // Don't hide the header on non-mobile screens

      if (window.scrollY < 100) {
        setVisible(true); // Always visible at the top
        setHeaderPos("static");
      } else if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        setVisible(false);
        setHeaderPos("fixed");
      } else if (window.scrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
        setHeaderPos("fixed");
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

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
    getSearchResults(1, query).then((results) => {
      setSearchResults(results.sort((a, b) => b.popularity - a.popularity));
    });
  };

  const capitalize = (string) => {
    if(!string) return '';
    if(string === 'tv') return 'TV';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "0" }}>
      {headerPos === "fixed" && isMobile && (
        <div
          style={{
            width: "100%",
            height: "14em",
            backgroundColor: darkMode ? "#333333" : "#f0f0f0",
            top: 0,
            zIndex: 1000,
          }}
        ></div>
      )}
      <AppBar
        position={isMobile ? headerPos : "static"}
        sx={{
          margin: isMobile ? ".1em 0.1em 1em 0.1em" : ".25em 1em 1em 1em",
          borderRadius: "1em",
          width: isMobile ? "calc(100% - .1em)" : "calc(100% - 2em)",
          justifyContent: "center",
          top: visible ? 0 : "-16em", // Subtle hide when scrolling down
          transition: "top 0.3s ease-in-out", // Smooth transition for hiding/showing the header
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
                alignItems: 'flex-start',
                alignContent: 'flex-start',
                marginLeft: '0 !important',
              }}>
                <Typography variant="h6" component="div" sx={{ marginTop: isMobile ? '.5em' : 0, width: isMobile ? '100%' : '18em', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start'}}>
                  <Button color="inherit" onClick={() => navigate("/home")}>
                    Movie App - {user.firstName} {user.lastName}{"  "}
                    {adultContent ? '🌶️' : ''}
                  </Button>
                </Typography>
                
                <Grid container spacing={2} sx = {{display: isMobile ? 'flex' : null, justifyContent: isMobile ? 'center' : 'flex-start', width: '100%'}}>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => navigate(-1)}><ArrowBackIcon/></Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => navigate(1)}><ArrowForwardIcon/></Button>
                  </Grid>
                </Grid>
              </Container>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: isMobile ? "100%" : "25em",
                  height: "75%",
                  marginTop: isMobile ? ".5em" : 0,
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
              <Container sx={{ display: "flex", marginBottom: isMobile ? '.5em' : 0 , justifyContent: isMobile ? 'center' : 'flex-end', width: isMobile ? '100%' : '18em', marginRight: '0 !important'}}>
                <Button color="inherit" sx={{ marginTop: isMobile ? "0.5em" : 0, marginRight: isMobile ? '.5em' : 0 }} onClick={() => navigate("/movielist")}>
                  Watch Lists
                </Button>
                <Button color="inherit" sx={{ marginTop: isMobile ? "0.5em" : 0,  marginLeft: isMobile ? '.5em' : 0}} onClick={() => navigate("/usermgmt")}>
                  Settings
                </Button>
              </Container>
            </>
          ) : (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 , marginTop: isMobile ? '.5em' : 0}}>
              Movie App
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
