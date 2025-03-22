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
import { getBook, getAuthor } from '../../api/bookAPI';
import { getPersonExternalIDs, getPersonSearchResults } from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, getMovieListsByUserId, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import { Link, useParams } from 'react-router-dom';
import { auth } from '../../firebase-config';



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
        const fetchBook = async () => {
            setLoading(true);
            const bookData = await getBook(id);
            const authorData = await Promise.all(bookData.authors.map(async (a) => {
                const id = a.author.key.split('/').pop();
                const authorData = await getAuthor(id);
                return authorData;
            }));
            let tmdbAuthoData = await Promise.all(authorData.map(async (author) => {
                const authorData = await getPersonSearchResults(1,author.name);
                return authorData;
            }));
            tmdbAuthoData = await Promise.all(tmdbAuthoData.map(async (authors) => {
                authors.forEach(async (author) => {
                    const externalIDs = await getPersonExternalIDs(author.id);
                    author.imdb_id = externalIDs.imdb_id;
                });
                return authors;
            }));

            authorData.forEach((author) => {
                tmdbAuthoData.forEach((authors) => {
                    authors.forEach((a) => {
                        if (a.name === author.name) {
                            author.tmdbData = a;
                        }
                    });
                });
            });
            bookData.authors = authorData;

            setBook(bookData);
            
            setLoading(false);
        }
        fetchBook();
        
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
            {book.description && book.description.value ? book.description.value : book.description}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {book.authors && book.authors.map((author) => (
              <Typography variant="h6" component="p">
                {author.tmdbData ? <Link to={`/person/${author.tmdbData.id}`}>{author.name}</Link> : author.name}
              </Typography>
            ))}
   
          </Grid>
    </Grid> 
     </> }
    </Card>
  );
};

export default BookDetailsPage;
