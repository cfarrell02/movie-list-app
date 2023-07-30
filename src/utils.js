import cloudIcon from './images/001-cloud.svg';
import cloud1Icon from './images/002-cloud-1.svg';
import rainyIcon from './images/003-rainy.svg';
import rainy1Icon from './images/004-rainy-1.svg';
import hailIcon from './images/005-hail.svg';
import snowyIcon from './images/006-snowy.svg';
import nightIcon from './images/007-night.svg';
import stormIcon from './images/008-storm.svg';
import storm1Icon from './images/009-storm-1.svg';
import windyIcon from './images/010-windy.svg';
import cloudyIcon from './images/011-cloudy.svg';
import snowy1Icon from './images/012-snowy-1.svg';
import storm2Icon from './images/013-storm-2.svg';
import compassIcon from './images/014-compass.svg';
import dayIcon from './images/015-day.svg';
import floodIcon from './images/016-flood.svg';
import fogIcon from './images/017-foog.svg';
import flood1Icon from './images/018-flood-1.svg';
import night1Icon from './images/019-night-1.svg';
import storm3Icon from './images/020-storm-3.svg';
import night2Icon from './images/021-night-2.svg';
import night3Icon from './images/022-night-3.svg';
import windy1Icon from './images/023-windy-1.svg';
import night4Icon from './images/024-night-4.svg';
import humidityIcon from './images/025-humidity.svg';
import rainbowIcon from './images/026-rainbow.svg';
import rainbow1Icon from './images/027-rainbow-1.svg';
import dropIcon from './images/028-drop.svg';
import shootingStarIcon from './images/029-shooting-star.svg';
import windIcon from './images/030-wind.svg';
import snowflakeIcon from './images/031-snowflake.svg';
import starIcon from './images/032-star.svg';
import hurricaneIcon from './images/033-hurricane.svg';
import cloudy1Icon from './images/034-cloudy-1.svg';
import snowy2Icon from './images/035-snowy-2.svg';
import storm4Icon from './images/036-storm-4.svg';
import cloudy2Icon from './images/037-cloudy-2.svg';
import cloudy3Icon from './images/038-cloudy-3.svg';
import sunIcon from './images/039-sun.svg';
import sunriseIcon from './images/040-sunrise.svg';
import sunsetIcon from './images/041-sunset.svg';
import coldIcon from './images/042-cold.svg';
import warmIcon from './images/043-warm.svg';
import warm1Icon from './images/044-warm-1.svg';
import thunderIcon from './images/045-thunder.svg';
import tornadoIcon from './images/046-tornado.svg';
import tornado1Icon from './images/047-tornado-1.svg';
import umbrellaIcon from './images/048-umbrella.svg';
import windy2Icon from './images/049-windy-2.svg';
import windy3Icon from './images/050-windy-3.svg';
//utils.js

export const getUserRoles = (index) => {
    const userRoles = ['Viewer', 'User', 'Admin','Owner']
    return userRoles[index];
}
export const dayOfTheWeek = (index) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[index];
}

export const dateFormatter = (date) => {
  const formattedDate = new Date(date).toLocaleDateString();
  return formattedDate === "Invalid Date" ? "" : formattedDate;
}

export const timeFormatter = (date) => {
  // Time as Hours:Minutes 
  const formattedTime = new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return formattedTime === "Invalid Date" ? "" : formattedTime;
}

export const convertArrayOfObjectsToCSV = (array, keys) => {
    let result;
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    array.forEach((item) => {
      keys.forEach((key, index) => {
        if (item[key] && typeof item[key] === 'string') {
          item[key] = item[key].replace(/,/g, '');
        }
      });
    });
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key, index) => {
        if (ctr > 0) result += columnDelimiter;
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });
    return result;
  };
  

export const weatherCodeTranslator = (code) => {
    const weatherInterpretationCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog and depositing rime fog",
        48: "Fog and depositing rime fog",
        51: "Drizzle: Light intensity",
        53: "Drizzle: Moderate intensity",
        55: "Drizzle: Dense intensity",
        56: "Freezing Drizzle: Light intensity",
        57: "Freezing Drizzle: Dense intensity",
        61: "Rain: Slight intensity",
        63: "Rain: Moderate intensity",
        65: "Rain: Heavy intensity",
        66: "Freezing Rain: Light intensity",
        67: "Freezing Rain: Heavy intensity",
        71: "Snowfall: Slight intensity",
        73: "Snowfall: Moderate intensity",
        75: "Snowfall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight intensity",
        81: "Rain showers: Moderate intensity",
        82: "Rain showers: Violent intensity",
        85: "Snow showers: Slight intensity",
        86: "Snow showers: Heavy intensity",
        95: "Thunderstorm: Slight intensity",
        96: "Thunderstorm: Slight hail",
        99: "Thunderstorm: Heavy hail",
      };
      
        return weatherInterpretationCodes[code];
    };
      
    export const weatherCodeIcons = (code) => {
      const weatherIcons = {
        "0": sunIcon, "-1": night3Icon,
        "1": cloudy3Icon, "-2": nightIcon,
        "2": cloudIcon, 
        "3": cloudyIcon, 
        "45": fogIcon, 
        "48": fogIcon,
        "51": rainyIcon,
        "53": rainyIcon,
        "55": rainy1Icon,
        "56": hailIcon,
        "57": hailIcon,
        "61": rainyIcon,
        "63": rainy1Icon,
        "65": rainy1Icon,
        "66": snowy2Icon, '-67' : night1Icon,
        "67": snowy2Icon, '-68' : night1Icon,
        "71": snowyIcon,
        "73": snowyIcon,
        "75": snowflakeIcon,
        "77": snowflakeIcon,
        "80": storm1Icon, '-81': storm3Icon,
        "81": storm1Icon, '-82': storm3Icon,
        "82": storm2Icon,
        "85": snowyIcon,
        "86": snowyIcon,
        "95": thunderIcon,
        "96": thunderIcon,
        "99": thunderIcon
      };      
      let icon = weatherIcons[code];
      if (icon === undefined) {
        const newIndex = (parseInt(code) + 1) * -1;
        icon = weatherIcons[newIndex];
      }
      return icon;
    };

    export const formateName = (option) => {
 
        let newName = option.name;
        if (option.admin2) newName += ', ' + option.admin2;
        if (option.admin1) newName += ', ' + option.admin1;
        if (option.country) newName += ', ' + option.country;
        return newName ? newName : 'Error fetching name';
        
        }