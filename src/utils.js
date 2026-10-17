import cloudIcon from './images/001-cloud.svg';
import rainyIcon from './images/003-rainy.svg';
import rainy1Icon from './images/004-rainy-1.svg';
import hailIcon from './images/005-hail.svg';
import snowyIcon from './images/006-snowy.svg';
import nightIcon from './images/007-night.svg';
import storm1Icon from './images/009-storm-1.svg';
import cloudyIcon from './images/011-cloudy.svg';
import storm2Icon from './images/013-storm-2.svg';
import fogIcon from './images/017-foog.svg';
import night1Icon from './images/019-night-1.svg';
import storm3Icon from './images/020-storm-3.svg';
import night3Icon from './images/022-night-3.svg';
import snowflakeIcon from './images/031-snowflake.svg';
import snowy2Icon from './images/035-snowy-2.svg';
import cloudy3Icon from './images/038-cloudy-3.svg';
import sunIcon from './images/039-sun.svg';
import thunderIcon from './images/045-thunder.svg';
//utils.js

export const getUserRoles = (index) => {
    const userRoles = ['Viewer', 'User', 'Admin','Owner']
    return userRoles[index];
}
export const dayOfTheWeek = (index) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[index];
}

export const monthsOfTheYear = (index) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"];
    return months[index];
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

export const ageFormatter = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const age = today.getFullYear() - targetDate.getFullYear();
  const month = today.getMonth() - targetDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < targetDate.getDate())) {
    return age - 1;
  }
  return age;
}



//Method to convert date to x days ago
export const dateReadableFormatter = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const seconds = Math.floor((today - targetDate) / 1000);
    if(seconds < 86400){
        if(seconds < 60){
        return 'Just now';
        }else if(seconds < 3600){
            return `${Math.floor(seconds/60)}m ago`;
        }else if(seconds < 86400){
            return `${Math.floor(seconds/3600)}h ago`;
        }
    }else if(today.getFullYear() === targetDate.getFullYear()){
        return `${targetDate.getDate()} ${monthsOfTheYear(targetDate.getMonth()).substring(0,3)}`;
    }else{
        return `${targetDate.getDate()} ${monthsOfTheYear(targetDate.getMonth()).substring(0,3)}, ${targetDate.getFullYear()}`;
    }
  }


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
// Firestore returns dates as Timestamps ({ seconds }); older records may hold strings or Dates
export const toDate = (value) => {
  if (!value) return null;
  if (value.seconds !== undefined) return new Date(value.seconds * 1000);
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export const ADULT_AGE = 18;

export const isOfAdultAge = (dateOfBirth) => {
  const date = toDate(dateOfBirth);
  return date ? ageFormatter(date) >= ADULT_AGE : false;
};

// Adult content is only shown when the account has opted in and is old enough
export const canViewAdultContent = (userData) =>
  !!userData && !!userData.adultAllowed && isOfAdultAge(userData.dateOfBirth);

// Remove items TMDB flags as adult unless the viewer has adult content enabled
export const filterAdult = (items, adultContent) =>
  adultContent ? items || [] : (items || []).filter((item) => !item.adult);
