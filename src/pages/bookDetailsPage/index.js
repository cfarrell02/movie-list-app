import React, { useState, useEffect, useMemo} from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  CircularProgress,
  Tab,
  Tabs,
  Select,
  MenuItem,
  Card,
  FormControl,
  Divider,
  ButtonGroup,
  InputLabel,
  useMediaQuery,
  Stack,
  Box
} from '@mui/material';
import { getBook } from '../../api/bookAPI';
import { getMovieListById, addMovieToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { useParams } from 'react-router-dom';



const BookDetailsPage = (props) => {
  const {id} = useParams();
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const formattedTitle = useMemo(() => {
    if (book.title) {
      return book.title;
    }
    return '';
  }
    , [book.title]);

    useEffect(() => {
        setLoading(true);
        getBook(id).then((data) => {
            setBook(data || {});
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching book:', error);
            setLoading(false);
        });
        }, [id]);



  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', padding: '0 2%', margin: '2% 5% 2% 5%', alignContent: 'center'}}>
      {loading ? 
      <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
        <CircularProgress/>
      </Container>
      : <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', justifyContent: isMobile ? 'center' : 'flex-start'}} >
      <Typography variant="h3" sx={{marginTop: '1em', marginBottom: '.2em'}}>{formattedTitle}</Typography>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: isMobile ? 'center' : 'flex-end' }}>
        <Stack> 
        {/* <FormControl sx={{ m: 1, minWidth: '15em' }} size='small'>
        <InputLabel> Add to list</InputLabel>
        <Select
        autoWidth
        onChange={handleChange}
        label="Add to list"
        title= 'Select a list to add this movie to'
        >
          {movieLists.map((list) => (
          <MenuItem value={list.id}>{list.title}</MenuItem>
          ))}
        </Select>
        </FormControl> */}
        {/* <ButtonGroup sx={{marginBottom: '.5em', marginRight:'auto',marginLeft:'auto'}}>
          {movie.imdb_id && <Button variant="contained" target="_blank" href={`https://www.imdb.com/title/${movie.imdb_id}`} title='IMDB'>IMDB</Button>}
          {movie.id && <Button variant="contained" target="_blank" href={`https://www.themoviedb.org/movie/${movie.id}`} title='TMDB'>TMDB</Button>}
          {stremioLinkEnding && <Button variant="contained" target="_blank" href={`https://www.strem.io/s/movie/${stremioLinkEnding}`} title='Stremio'>Stremio</Button>}
        </ButtonGroup> */}
        </Stack>
      </Grid>
      <Grid item xs={9}>
          <Typography variant="h6" component="p">
            {book.description}
            </Typography>
          </Grid>
          <Grid item xs={3}>
   
          </Grid>
    </Grid> 
     </> }
    </Card>
  );
};

export default BookDetailsPage;
