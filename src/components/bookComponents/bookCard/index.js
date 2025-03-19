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
import { useNavigate } from "react-router-dom";
import {
  getMovieListsByUserId,
  addMovieToList,
  getMovieListById,
} from "../../../api/movieStorage";
import { AlertContext } from "../../../contexts/alertContext";
import { getUserById } from "../../../api/userDataStorage";
import { auth } from "../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import Stack from "@mui/material/Stack";
import { NativeSelect, FormControl } from "@mui/material";
import defaultImage from "../../../images/default.jpg";

export default function BookCard({ book }) {
  const [user, setUser] = React.useState(null);
  const { addAlert } = React.useContext(AlertContext);
  const [posterUrl, setPosterUrl] = React.useState("");
  const navigate = useNavigate();
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
    if (book) {
      const localURL = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : defaultImage;
      setPosterUrl(localURL);
    }
  }, [book]);

  return (
    <Card
      onClick={() => navigate(`/book/${book.title}`, { state: { book } })}
      sx={{
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
        height: "25em",
        '&:hover': {
          boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.5)",
          transform: "translateY(-5px)",
        }
      }}
    >

      <CardMedia
        sx={{ height: "100%", position: "relative" }}
        title={book.title}
        image={posterUrl}
      >
        <Grid
          container
          sx={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 1))",
            color: "white",
            padding: "0 .3em .1em .3em",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          {book.first_publish_year ? (
            <>
              <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon fontSize="small" sx={{ marginRight: "4px" }} />
                <Typography variant="h6" component="p">
                  {book.first_publish_year}
                </Typography>
              </Grid>
            </>
          ) : (
            ""
          )}
          {book.author_name ? (
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
                  {book.author_name.join(", ")}
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
