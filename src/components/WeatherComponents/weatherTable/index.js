import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { dayOfTheWeek, weatherCodeIcons, weatherCodeTranslator } from '../../../utils';

const WeatherTable = ({ days }) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">High</TableCell>
            <TableCell align="right">Low</TableCell>
            <TableCell align="right">Rain %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((day) => (
            <TableRow key={day.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {dayOfTheWeek(day.time.getDay())}
              </TableCell>
              <TableCell align="center">
                <img height={"100px"} src={weatherCodeIcons(day.description)} alt={weatherCodeTranslator(day.description)} />
              </TableCell>
              <TableCell align="right">{day.temperature_2m_max}</TableCell>
              <TableCell align="right">{day.temperature_2m_min}</TableCell>
              <TableCell align="right">{day.precipitationProbability}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeatherTable;
