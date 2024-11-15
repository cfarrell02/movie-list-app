import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box"; // Required for rendering options with images
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserById } from "../../api/userDataStorage";
import { SiteDataContext } from "../../contexts/siteDataContext";
import { getSearchResults } from "../../api/TMDBAPI"; // Assuming this API call fetches search results
import defaultImage from "../../images/default.jpg";
import chilli from "../../images/chilli.png";
import './index.css';

const Header = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { adultContent , darkMode} = React.useContext(SiteDataContext);
  const [searchResults, setSearchResults] = useState([]); // State for storing search results
  const [searchHistory, setSearchHistory] = useState([]); // State for storing search history
  const [inputValue, setInputValue] = useState(""); // State for storing user input

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
      getSearchResults(inputValue).then((results) => {
        //filter out tv shows and movies
        setSearchResults(results);
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

    //reload
    window.location.reload();
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
      <AppBar
        position="static"
        sx={{
          margin: ".25em 1em 1em 1em",
          borderRadius: "1em",
          width: "calc(100% - 2em)",
        }}
      >
        <Toolbar>
          {user !== null ? (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button color="inherit" onClick={() => navigate("/home")}>
                  Movie App - {user.firstName} {user.lastName}{"  "}
                  {adultContent ? '🌶️' : ''}
                </Button>
              </Typography>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "25em",
                  height: "75%", // Updated height to match the text box
                }}

                id="search-container"
              >
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
              </Container>
              <Button color="inherit" onClick={() => navigate("/movielist")}>
                Watch Lists
              </Button>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Settings
              </Button>
            </>
          ) : (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Movie App
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
