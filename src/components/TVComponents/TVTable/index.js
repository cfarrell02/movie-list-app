import React, { useState, useEffect } from 'react';
import TVTableRow from '../TVTableRow';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper,
  CircularProgress,
  TablePagination,
  TextField,
  Rating,
  Slider,
  Chip,
  Stack,
  Select,
  Switch,
  Grid,
  Alert,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Filter, Label, Refresh } from '@mui/icons-material';
import { orderBy } from 'lodash';
import { AlertContext } from '../../../contexts/alertContext';
import Checkbox from '@mui/material/Checkbox';

const TVTable = ({ tvShows, deleteTVShow, editTVShow, loading, accessType}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [field, setField] = useState('first_air_date');
  const [operator, setOperator] = useState('=');
  const [value, setValue] = useState('');
  const [filteredTVShows, setFilteredTVShows] = useState([]);
  const [filters, setFilters] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');
  const {addAlert} = React.useContext(AlertContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    sortConfig.direction = 'asc';
    sortConfig.key = 'addedDate';
    handleSort('addedDate');
  }, []);

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  
    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    const sortedTVShows = orderBy(tvShows, [sortConfig.key], [sortConfig.direction]);
  
    const getSortIcon = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === 'asc' ? <ArrowUpward style={{ fontSize: 'inherit' }}/> : <ArrowDownward style={{ fontSize: 'inherit' }}/>;
      }
      return null;
    };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (filters && filters.length > 0) {
      let filteredTVShows = [...sortedTVShows];
      filters.forEach((filter) => {
        filteredTVShows = filteredTVShows.filter((tvShow) => {
          let value = filter.field === 'first_air_date' || field === 'addedDate' ? tvShow[filter.field].substring(0,4) :  tvShow[filter.field];
          if (filter.operator === '=') {
            return  value == filter.value;
          } else if (filter.operator === '<') {
            return value < filter.value;
          } else if (filter.operator === '>') {
            return value > filter.value;
          }
          return true;
        });
      });
      setFilteredTVShows(filteredTVShows);
    } else {
      setFilteredTVShows([]);
    }
  }, [filters]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if(term === '') {
      setSearchResults([]);
      return;
    }
    const filteredTVShows = tvShows.filter((tvShow) => {
      return tvShow.name.toLowerCase().includes(term.toLowerCase());
    });

    setSearchResults(filteredTVShows);
  }
    

  const startRowIndex = page * rowsPerPage;
  const endRowIndex = startRowIndex + rowsPerPage;
  const paginatedTVShows = sortedTVShows.slice(startRowIndex, endRowIndex);

  useEffect(() => {
    if(field === 'watched'){
    setOperator('=');
    }
  }, [field]);

  const renderOperatorOptions = () => {
    if (field === 'watched') {
      return (
        <>
          <option value="=">=</option>
        </>
      );
    } else {
      return (
        <>
          <option value="=">=</option>
          <option value="<">&lt;</option>
          <option value=">">&gt;</option>
        </>
      );
    }
  };

  const renderFilterValueInput = () => {
    console.log(field);
    if (field === 'watched') {
        return (
          <Switch onChange={(e) => setValue(e.target.checked)}
          size='large'/>
        );
        }else if(field === 'first_air_date' || field === 'addedDate'){
          return (
            <TextField onChange={(e) => setValue(e.target.value)}
            label='Year'
            />
          );
        }else if(field === 'episode_run_time'){
      
          return (
            <div style={{ marginTop: '16px' }}>
              <Slider
                onChange={(e, newValue) => setValue(newValue)}
                min={1}
                max={240}
                valueLabelDisplay="on"
              />
            </div>
          );
        }else {
          return (
            <TextField onChange={(e) => setValue(e.target.value)}
            label='Rating'
            InputProps={{
              endAdornment: <InputAdornment position="start">/10</InputAdornment>,
            }}
            />
          );
        }
  };
        
  
  
  
  const handleFilter = () => {
    if(filters.length >=6){
      addAlert('error', 'You can only have 6 filters at a time.');
      return;
    }
      const newFilter = {field: field, operator: operator, value: value, label: `${field} ${operator} ${value}`};
      
      setFilters([...filters, newFilter]);
  };

  const handleDelete = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  }
  
  

  return (
    <TableContainer component={Paper}>
    <Grid container spacing={2} sx={{ p: 2 }} alignItems="center">
      <Grid item md={9} xs={12} align="left">
        <TextField
          variant="outlined"
          margin="normal"
          label="Search Title"
          fullWidth
          onChange={handleSearch}
        />
      </Grid>



      <Grid item md={3} xs={12} align="centre">
        <Typography variant="subtitle2" component="div">
          Show watched TV shows</Typography>
        <Checkbox defaultChecked={true}
        value={!filters.some((filter) => filter.label === 'watched = false')}
          onChange={(e) => {
            if(!e.target.checked){
              setFilters([...filters, {field: 'watched', operator: '=', value: false, label: 'watched = false'}]);
            }else{
              setFilters(filters.filter((filter) => filter.label !== 'watched = false'));
            }
          }}
        />


          
      </Grid>


  

    </Grid>
      {/* <Stack direction="row" spacing={1} justifyContent="center">
        {filters.map((filter, index) => (
          <Chip label={filter.label} variant="outlined" onDelete={() => handleDelete(index)} key={index}/>
        ))}
    </Stack> */}
      <Table sx={{ minWidth: isMobile ? 0 : 650 }} aria-label="simple table">
      <TableHead>
          <TableRow align="left">
          <TableCell >
              <Typography align="center" variant="subtitle2" component="div">
                Poster
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Title {getSortIcon('name')}
              </Typography>
            </TableCell>
            {isMobile ? null : (<>
            <TableCell align="center" onClick={() => handleSort('first_air_date')} style={{ cursor: 'pointer'}} >
            <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
            Years Aired {getSortIcon('first_air_date')}
          </Typography>
          </TableCell>
            <TableCell align="center" onClick={() => handleSort('vote_average')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Rating {getSortIcon('vote_average')}
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('episode_run_time')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Seasons {getSortIcon('episode_run_time')}
              </Typography>
            </TableCell>
            <TableCell align="center" onClick={() => handleSort('addedDate')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Added {getSortIcon('addedDate')}
              </Typography>
            </TableCell>
            </>)}
            <TableCell align="center" onClick={() => handleSort('watched')} style={{ cursor: 'pointer' }}>
              <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                Watched {getSortIcon('watched')}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            filters.length!== 0 && filteredTVShows ?
            filteredTVShows.map((tvShow) => (
              <TVTableRow
                handleDelete={deleteTVShow}
                handleEdit={editTVShow}        //Filtered TV Shows
                key={tvShow.id}
                tv={tvShow}
                accessType={accessType}
              />
            ))
            
            :(
            searchTerm.length===0 ?

            paginatedTVShows.map((tvShow) => (
              <TVTableRow
                handleDelete={deleteTVShow}
                handleEdit={editTVShow}   // Non Filtered TV Shows
                key={tvShow.id}
                tv={tvShow}
                accessType={accessType}
              />
            ))
            : searchResults.length!==0 ? 
            (
            searchResults.map((tvShow) => (
              <TVTableRow
              handleDelete={(tvShow) => {      // Search Results
                deleteTVShow(tvShow);
                if(searchResults.includes(tvShow)) {
                  setSearchResults(searchResults.filter((item) => item.id !== tvShow.id));
                }
              }}
              handleEdit={editTVShow}
              key={tvShow.id}
              tv={tvShow}
              accessType={accessType}
            />
            
            )) 
            ) : 
            <TableCell align="center" colSpan={6}>
            <Typography variant="subtitle2" component="div" sx={{ whiteSpace: 'nowrap' }}> 
            No results found
          </Typography>
          </TableCell>
            )

          )}
        </TableBody>
      </Table>
     {searchTerm.length===0 && filters.length === 0 ? (
      <TablePagination
        rowsPerPageOptions={[50, 75, 100, { label: 'All', value: tvShows.length }]}
        component="div"
        count={tvShows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? 'Shows' : 'Shows per page'}
      />
     ): null
     }
    </TableContainer>
  );
};

export default TVTable;
