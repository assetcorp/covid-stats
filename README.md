# COVID STATS

Coronavirus COVID-19 live updates. Provides API access and a webpage for simple user-interaction.

Visit [COVID STATS](https://covid.delalify.com/) to view website.

## API REFERENCE

The API URI endpoint for all routes is [https://covid.delalify.com/api/](https://covid.delalify.com/api/). Responses are served via HTTPS and all responses are of the form:

```json
{
 "error": false,
 "status": 200,
 "message": "",
 "response": {}
}
```

### API ROUTES

#### GET GLOBAL LATEST DATA

Send a `GET` request to [http://covid.delalify.com/api/latest](http://covid.delalify.com/api/latest "Latest data route")

`>> GET http://covid.delalify.com/api/latest`
```json
{
 "error": false,
 "status": 200,
 "message": "",
 "response": {
    "confirmed": 1196944,
    "recovered": 246110,
    "deaths": 64577,
    "active": 886257,
    "lastUpdated": "2020-04-04T22:07:08.204Z"
  }
}
```

#### GET COUNTRIES DATA

Send a `GET` request to [http://covid.delalify.com/api/countries](http://covid.delalify.com/api/countries "Countries data route") to get data for all countries

`>> GET http://covid.delalify.com/api/countries`
```json
{
 "error": false,
 "status": 200,
 "message": "",
 "response": [
    {
      "confirmed": 309728,
      "confirmedToday": 32567,
      "recovered": 14741,
      "deaths": 8441,
      "deathsToday": 1037,
      "country": "USA",
      "countryCode": "USA",
      "confirmedByDay": [],
      "recoveredByDay": [],
      "deathsByDay": [],
      "lastUpdated": "2020-04-04T23:07:07.251Z",
      "active": 286546,
      "critical": 8206,
      "mortalityPer": "2.73",
      "recoveredPer": "4.76"
    }
  ]
}
```

Send a `GET` request to [http://covid.delalify.com/api/countries/GH](http://covid.delalify.com/api/countries/GH "Countries data route with country code GH") to get data for a single country with country code `GH`

You can obtain the country code from all countries data as described above.

`>> GET http://covid.delalify.com/api/countries/GH`

```json
{
  "error": false,
  "status": 200,
  "message": "",
  "response": {
    "confirmed": 205,
    "confirmedToday": 0,
    "recovered": 31,
    "deaths": 5,
    "deathsToday": 0,
    "country": "Ghana",
    "countryCode": "GH",
    "confirmedByDay": [],
    "recoveredByDay": [],
    "deathsByDay": [],
    "lastUpdated": "2020-04-04T22:15:12.566968Z",
    "active": 169,
    "critical": 2,
    "mortalityPer": "2.44",
    "recoveredPer": "15.12"
    }
  }
}
```

#### GET GENERAL DATA

Send a `GET` request to [http://covid.delalify.com/api/general](http://covid.delalify.com/api/general "General data route") to get all data in the system covering all countries and locations. This route is useful if you want to get records pertaining to not just countries, but locations.

The data is grouped according to latest, confirmed, recovered, and deaths.

`>> GET http://covid.delalify.com/api/general`
```json
{
 "error": false,
 "status": 200,
 "message": "",
 "response": {
    "latest": {
      "confirmed": 1196944,
      "recovered": 246110,
      "deaths": 64577,
      "active": 886257,
      "lastUpdated": "2020-04-04T22:07:08.204Z"
    },
    "confirmed": [
      {
        "country": "Afghanistan",
        "country_code": "AF",
        "province": "",
        "coordinates": {
          "lat": "33.0",
          "long": "65.0"
        },
        "history": {},
        "latest": 281,
      }
    ],
    "recovered": [
      {
        "country": "Afghanistan",
        "country_code": "AF",
        "province": "",
        "coordinates": {
          "lat": "33.0",
          "long": "65.0"
        },
        "history": {},
        "latest": 10,
      }
    ],
    "deaths": [
      {
        "country": "Afghanistan",
        "country_code": "AF",
        "province": "",
        "coordinates": {
          "lat": "33.0",
          "long": "65.0"
        },
        "history": {},
        "latest": 6,
      },
    ]
  }
}
```
## API SOURCES

There are 2 major API sources used in the project. The first is from @javieraviles [covidAPI](https://github.com/javieraviles/covidAPI). I rely on data from this project to provide information on all affected countries. The second source is from @ExpDev [coronavirus-tracker-api](https://github.com/ExpDev07/coronavirus-tracker-api). I use data from this project to handle location information for all affected places.

I conjoin data from these sources to store them in a database. I update the database with the fetched data every hour to ensure that updates are served without too much delay.

These 2 projects also pull data from one or more of the following sources:

[World Health Organization (WHO)](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports)
[Ghana Health Service](https://ghanahealthservice.org/covid19/)
[China CDC (CCDC)](http://weekly.chinacdc.cn/news/TrackingtheEpidemic.htm)
[US CDC](https://www.cdc.gov/coronavirus/2019-ncov/index.html)
[Government of Canada](https://www.canada.ca/en/public-health/services/diseases/coronavirus.html)
[Australia Government Department of Health](https://www.health.gov.au/news/coronavirus-update-at-a-glance)
[European Centre for Disease Prevention and Control (ECDC)](https://www.moh.gov.sg/covid-19)
[Italy Ministry of Health](http://www.salute.gov.it/nuovocoronavirus)
[1Point3Arces](https://coronavirus.1point3acres.com/en)
[WorldoMeters](https://www.worldometers.info/coronavirus/)
