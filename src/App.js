import { Card, CardContent, FormControl,MenuItem, Select} from '@material-ui/core';
import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios'
import InfoBox from './component/InfoBox'
import Map from './component/Map'
import Table from './component/Table'
import {sortData,prettyprintstat} from './util'
import LineGraph from './component/LineGraph'
import "leaflet/dist/leaflet.css";

//https://disease.sh/v3/covid-19/continents
function App() {
  const [countries, setCountries] = useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo,setCountryInfo]=useState([]);
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapcenter]=useState({lat:34.80746,lng:-40.4796})
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases")
  useEffect(()=>{
      fetch('https://disease.sh/v3/covid-19/all')
      .then(res=>res.json())
      .then(data=>{
        setCountryInfo(data)
      });
  },[])
  useEffect(() => {
   async function getCountries(){
    await axios.get('https://disease.sh/v3/covid-19/countries')
    .then((res)=>{
     const countries = res.data.map((country)=>(
        {
          name:country.country,
          value:country.countryInfo.iso3
        }
     )) ;
     setCountries(countries);
     const sortedData=sortData(res.data);
     setMapCountries(res.data);
     setTableData(sortedData);
  })
  .catch((err)=>{
    console.log(err)
  })
}
getCountries();
 
  }, [countries]);
  const onCountryChange=async(e)=>{
     const countryCode=e.target.value;
     
     const url=countryCode ==='worldwide'?'https://disease.sh/v3/covid-19/all'
     :`https://disease.sh/v3/covid-19/countries/${countryCode}`
     //https://disease.sh/v3/covid-19/all
     //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
     await fetch(url)
     .then(res=>res.json())
     .then(data=>{
       setCountry(countryCode);
       setCountryInfo(data);
       data.countryInfo && setMapcenter([data.countryInfo?.lat,data.countryInfo?.long]);
       setMapZoom(4);
     })
  }
  console.log(countryInfo)
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select
        variant="outlined"
        value={country}
        onChange={onCountryChange}
        >
         <MenuItem value='worldwide'>Worldwide</MenuItem> 
        {
           
          countries.map((country,index)=>(
           
          <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
          ))
        }
        </Select>
      </FormControl>
      </div>
      <div className="app__stats">
         <InfoBox
           isRed
          active={casesType ==="cases"}
           onClick={e=>setCasesType('cases')}
          title="Coronavirus Cases" total={prettyprintstat(countryInfo?.cases)} cases={prettyprintstat(countryInfo?.todayCases)}/>
         <InfoBox 
         active={casesType ==="recovered"}
         onClick={e=>setCasesType('recovered')}
         title="Recovered"  total={prettyprintstat(countryInfo?.recovered)} cases={prettyprintstat(countryInfo?.todayRecovered)}/>
         <InfoBox
         isRed
         active={casesType ==="deaths"} 
         onClick={e=>setCasesType('deaths')}
         title="Deaths"  total={prettyprintstat(countryInfo?.deaths)} cases={prettyprintstat(countryInfo?.todayDeaths)} />
        
      </div>
      <Map casesType={casesType}countries={mapCountries} center={mapCenter}
      zoom={mapZoom}/>
      </div>
     <div className="app__right">
       <Card>
         <CardContent>
           <h3>Live cases</h3>
           <Table countries={tableData}>

           </Table>
      <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
         </CardContent>
         <LineGraph className="app__graph" casesType={casesType}/>
       </Card>
      
     </div>
      
    </div>
  );
}

export default App;
