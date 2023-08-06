import React, { useContext  } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import { FormControl} from "@mui/base";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { getMovieListsByUserId, addMovieToList, getMovieListById } from "../../../api/movieStorage";
import { AlertContext } from "../../../contexts/alertContext";
import { getUserById } from "../../../api/userDataStorage";
import { auth } from "../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import Stack from '@mui/material/Stack';


export default function MovieCard({ movie }) {
 const [user, setUser] = React.useState(null);
  const [movieLists, setMovieLists] = React.useState([]);
  const {addAlert} = React.useContext(AlertContext);
  React.useEffect(() => {
    const fetchData = async () => {
      try {

        if(user){
        const fetchedMovieLists = await getMovieListsByUserId(user.uid);
        setMovieLists(fetchedMovieLists);
        }
       
      } catch (error) {
        console.error(error);
        // Handle the error, show an error message, or take appropriate action.
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

  const handleChange = async (event) => {
    const userData = await getUserById(user.uid);
    try{
      movie.addedDate = new Date().toISOString();
      movie.addedBy = user.uid;
      const movieList = await getMovieListById(event.target.value);
      if(movieList.movies.find(m => m.id === movie.id)) throw new Error('Movie already in list');
      addMovieToList(event.target.value, movie);
      addAlert('success', `${movie.title} added to ${movieList.title}`);
    }
    catch(error){
      addAlert('error', error.message);
    }
  };

 
   return (
    <Card >
       <CardHeader
        title={
          <Typography variant="h6" component="p">
            {movie.title}{" "}
          </Typography>
        }
      />

      <CardMedia
        sx={{ height: 500 }}
        image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <CalendarIcon fontSize="small" />
              {new Date(movie.release_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{display:"flex",  alignItems: 'flex-end', justifyContent:'flex-end'}}>
            <Typography variant="h6" component="p">
              <StarRateIcon fontSize="small" />
              {"  "}{movie.vote_average}{" "}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
      <Link to={`/movie/${movie.id}`}>
        <Button variant="outlined" size="medium" color="primary">
          More Info ...
        </Button>
      </Link>
      {/* <FormControl sx={{ m: 1, minWidth: 80 }} size='small'>
        <InputLabel> Add to list</InputLabel>
        <Select
        autoWidth
        sx={{marginRight:'1em'}}
        onChange={handleChange}
        label="Add to list"
        title= 'Select a list to add this movie to'
        >
          {movieLists.map((list) => (
          <MenuItem value={list.id}>{list.title}</MenuItem>
          ))}
        </Select>
        </FormControl> */}
      </CardActions>
    </Card>
  );
}