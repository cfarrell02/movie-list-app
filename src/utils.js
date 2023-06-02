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
        "0": "039-sun.png",
        "1": "038-cloudy-3.png",
        "2": "001-cloud.png",
        "3": "011-cloudy.png",
        "45": "017-foog.png",
        "48": "017-foog.png",
        "51": "003-rainy.png",
        "53": "003-rainy.png",
        "55": "004-rainy-1.png",
        "56": "005-hail.png",
        "57": "005-hail.png",
        "61": "003-rainy.png",
        "63": "004-rainy-1.png",
        "65": "004-rainy-1.png",
        "66": "035-snowy-2.png",
        "67": "035-snowy-2.png",
        "71": "006-snowy.png",
        "73": "006-snowy.png",
        "75": "031-snowflake.png",
        "77": "031-snowflake.png",
        "80": "009-storm-1.png",
        "81": "009-storm-1.png",
        "82": "013-storm-2.png",
        "85": "006-snowy.png",
        "86": "006-snowy.png",
        "95": "045-thunder.png",
        "96": "045-thunder.png",
        "99": "045-thunder.png"
      };
      
      return weatherIcons[code];
    };