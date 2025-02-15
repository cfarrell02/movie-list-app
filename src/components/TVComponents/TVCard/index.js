import React, { useContext } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {
  getMovieListsByUserId,
  addTVShowToList,
  getMovieListById,
} from "../../../api/movieStorage";
import { AlertContext } from "../../../contexts/alertContext";
import { getUserById } from "../../../api/userDataStorage";
import { auth } from "../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import Stack from "@mui/material/Stack";
import { NativeSelect, FormControl } from "@mui/material";
import defaultImage from "../../../images/default.jpg";
import { useNavigate } from "react-router-dom";

export default function TVCard({ tv }) {
  const [user, setUser] = React.useState(null);
  const [tvLists, setTVLists] = React.useState([]);
  const { addAlert } = React.useContext(AlertContext);
  const [posterUrl, setPosterUrl] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const fetchedTVLists = await getMovieListsByUserId(user.uid);
          setTVLists(
            fetchedTVLists.filter((list) => {
              return (
                list.users.find((userObj) => userObj.uid === user.uid)
                  .accessType > 0
              );
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (tv) {
      const localURL = tv.poster_path
        ? `https://image.tmdb.org/t/p/w500/${tv.poster_path}`
        : tv.backdrop_path
        ? `https://image.tmdb.org/t/p/w500/${tv.backdrop_path}`
        : defaultImage;
      setPosterUrl(localURL);
    }
  }, [tv]);

  const handleChange = async (event) => {
    const userData = await getUserById(user.uid);
    try {
      tv.addedDate = new Date().toISOString();
      tv.addedBy = user.uid;
      tv.watched = 0;
      const tvList = await getMovieListById(event.target.value);
      if (tvList.tvs.find((t) => t.id === tv.id))
        throw new Error("TV show already in list");
      addTVShowToList(event.target.value, tv);
      addAlert("success", `${tv.name} added to ${tvList.title}`);
    } catch (error) {
      addAlert("error", error.message);
    }
  };

  return (
    <Card
      onClick={() => navigate(`/tvShow/${tv.id}`)}
      sx={{ cursor: "pointer" }}
    >
      <CardMedia
        sx={{ height: "auto", paddingTop: "150%", position: "relative" }}
        title={tv.name}
        image={posterUrl}
      >
        <Grid
          container
          sx={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 1))",
            color: "white",
            padding: "0 .3em .1em .3em",
          }}
        >
          {tv.first_air_date ? (
            <>
              <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon fontSize="small" sx={{ marginRight: "4px" }} />
                <Typography variant="h6" component="p">
                  {new Date(tv.first_air_date).getFullYear()}
                </Typography>
              </Grid>
            </>
          ) : (
            ""
          )}
          {tv.vote_average ? (
            <>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Typography variant="h6" component="p">
                  <StarRateIcon fontSize="small" sx={{ marginRight: "4px" }} />
                  {tv.vote_average ? Math.round(tv.vote_average * 10) / 10 : ""}
                </Typography>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
      </CardMedia>
    </Card>
  );
}
