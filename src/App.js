import React, { useEffect, useState } from 'react';
import { Card, CardContent, FormControl, MenuItem, Select} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';



function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(()=> {
    const getContriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map(country => ({
            name: country.country, // United States, United Kingdom, France
            value: country.countryInfo.iso2 // USA, UK, FR
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
      });
    }

    // Make getCountiesData call
    getContriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide'  ?  'https://disease.sh/v3/covid-19/all':
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    });
  }

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>

          {/* Header */}
          <h1>COVID-19 Tracker</h1>


          {/* Title + Select input dropdown field */}
          <FormControl className='app__dropdown'>
            <Select variant='outlined'
              onChange={onCountryChange}
              value={country}>
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {countries.map(country => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>

          {/* Info boxes title = covid cases*/}
          <InfoBox
            onClick = {e => setCasesType('cases')}
            title='Covid Cases' 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}/>

          {/* Info boxes title = covid recoveries*/}
          <InfoBox
            onClick = {e => setCasesType('recovered')}
            title='Recovered' 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}/>

          {/* Info boxes */}
          <InfoBox
            onClick = {e => setCasesType('deaths')}
            title='Deaths' 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}/>
          
        </div>

        <div className='app__lineGraph'>
          <h3>{country} new {casesType}</h3>
          <LineGraph country={country} casesType={casesType}/>
        </div>

        <div className='app__dev'>
          <br/>
          <h4>Developed by:</h4> 
          <a href={"mailto:" + 'navreetsingh61@gmail.com'}>Navreet Singh</a>
          <br/>
        </div>

      </div>

      <Card className='app__right'>
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
