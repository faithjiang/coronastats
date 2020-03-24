import React, {Component} from 'react';
import Chart from "react-google-charts";
import Form from 'react-bootstrap/Form';
import './App.css';
const {countries} = require('./countries');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: countries,
      chart: null
    };
  }

  componentDidMount = () => {
    this.getChart();
  }

  createCountryButton = country => {
    let checkBox = this.createCheckBox(country);
    return (
      <div className='country-btn'>
        {checkBox}
        <button type='button' onClick={() => {this.toggleProvinces(country)}}><i className="fas fa-angle-down"></i></button>
      </div>
    )
  }

  toggleProvinces = country => {
    let tmpCountry = this.state.countries;
    tmpCountry[country]['flag'] = !(this.state.countries[country]['flag']);

    this.setState({countries : tmpCountry});
  }

  createSelectTable = () => {
    let _countries = this.state.countries;
    let selectList = [];
    for (let country in _countries) {
      if ('provinces' in _countries[country]) {
        selectList.push(this.createAccordion(country))
      } else {
        let checkBox = this.createCheckBox(country);
        selectList.push(checkBox);
      }
    }
    return <div className='SelectBox'>{selectList}</div>; 
  }

  createAccordion = country => {
    let provincesList = this.getProvincesDiv(country);
    let countryButton = this.createCountryButton(country);
    return ( 
      <div key={country}>
        {countryButton}
        <div className='provinces'>{provincesList}</div>
      </div>
    )
  }
  
  getProvincesDiv = country => {
    if (this.state.countries[country]['flag'] === false) { return <div></div> }
    return this.createProvincesList(country);
  }

  createProvincesList = country => {
    let provincesList = [];
    for (let province in this.state.countries[country]['provinces']) {
      provincesList.push(this.createCheckBox(country, province));
    }
    return provincesList;
  }

  createCheckBox = (country, province) => {
    let labelText = province? province: country;
    let checkValue = province? this.state.countries[country]['provinces'][province] : this.state.countries[country]['checked'];
    return (
      <Form.Check 
        key={labelText} 
        type='checkbox' 
        onChange={e => {this.handleChange(e)}}
        country={country} 
        province={province} 
        label={labelText} 
        checked={checkValue}/>
    )
  }

  handleChange = e => {
    let country = e.target.getAttribute('country');
    let province = e.target.getAttribute('province');
    let tmpCountry = this.state.countries;
    if (e.target.checked) {
      if (province) {
        tmpCountry[country] = this.add2Provinces(tmpCountry[country], province);
      } else {
        tmpCountry[country] = this.add2Country(tmpCountry[country]);
      }
    } else {
      if (province) {
        tmpCountry[country] = this.removeFrmProvinces(tmpCountry[country], province);
      } else {
        tmpCountry[country] = this.removeFrmCountry(tmpCountry[country]);
      }
    }
    this.setState({countries: tmpCountry});
    this.getChart();
  }

  add2Provinces = (countryObj, province) => {
    let tmpCountry = countryObj;
    tmpCountry.provinces[province] = true;
    if (this.allProvincesChecked(tmpCountry.provinces)) { 
      tmpCountry.checked = true;
    } 
    return tmpCountry;
  }

  allProvincesChecked = provinceList => {
    for (let checked of Object.values(provinceList)) {
      if (checked === false) {return false}
    }
    return true;
  }

  add2Country = countryObj => {
    let tmpCountry = countryObj;
    tmpCountry.checked = true;
    if ('provinces' in tmpCountry) {
      tmpCountry.provinces = this.setAllProvinces(tmpCountry.provinces, true)
    }
    return tmpCountry;
  }

  setAllProvinces = (provincesObj, value) => {
    let tmpProvinces = provincesObj;
    for (let prov in tmpProvinces) {
      tmpProvinces[prov] = value;
    }
    return tmpProvinces;
  }

  removeFrmProvinces = (countryObj, province) => {
    let tmpCountry = countryObj;
    tmpCountry.provinces[province] = false;
    tmpCountry.checked = false;
    return tmpCountry;
  }

  removeFrmCountry = countryObj => {
    let tmpCountry = countryObj;
    tmpCountry.checked = false;
    if ('provinces' in tmpCountry) {
      tmpCountry.provinces = this.setAllProvinces(tmpCountry.provinces, false);
    }
    return tmpCountry;
  }

  getChart = () => {
    let query = this.getQuery();
    if (query.length < 1 ){return}
    fetch(`/stats?${query}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    .then(res=> res.json())
    .then(resData => {
      this.createLineGraph(resData);
    }).catch(err => { 
      this.setState({chart: err.toString()});
      });
  }

  createLineGraph = resData => {
    let _data = resData;

    let _loader = <div>Loading Chart</div>
    let _textStyle = {
      fontName: 'Roboto',
      color: '#ECEEED',
      italic: false,
      bold: true
    }

    let _bgcolor = {fill: '#344055', opacity: 0}
    let _options = {
      title: 'COVID-19 Statistics',
      chartArea: {
        backgroundColor: _bgcolor,
        width: '80%',
        height: '80%'
      },
      width: '100%',
      height: '100%',
      hAxis: {
        title: 'Day',
        textStyle: _textStyle,
        titleTextStyle: _textStyle,
        gridlines: {color: '#465164', minSpacing: 10}
      },
      vAxis: {
        title: 'Number of Cases',
        textStyle: _textStyle,
        titleTextStyle: _textStyle,
        gridlines: {color: '#465164', minSpacing: 100}
      },
      trendlines: {
        0: {
          type: 'polynomial',
          degree: 3
        }
      },
      legend: {
        textStyle: _textStyle,
        titleTextStyle: _textStyle
      },
      backgroundColor: _bgcolor,       
      textStyle: _textStyle,
      titleTextStyle: {..._textStyle, ...{fontSize: '18'}}
    };

    let _chart = (<Chart
      chartType="LineChart"
      loader={_loader}
      data={_data}
      options={_options}
      rootProps={{ 'data-testid': '2' }}
      legendToggle
    />)

    this.setState({chart: _chart});
  }

  getQuery = () => {
    let query = {country: [], province: []};
    let _countries = this.state.countries;
    let out = [];
    for (let country in _countries) {
      if (country === 'chart') { continue }
      if (_countries[country].checked === true) {
        query.country.push(country);
      } else {
        if (!('provinces' in _countries[country])) { continue }
        for (let province in _countries[country]['provinces']) {
          if (_countries[country][province] === true) {
            query.province.push(country+'-'+province);
          }
        }
      }
    }

    if (query.country.length > 0) {
      out.push('country=' + query.country.join(','));
    }
    if (query.province.length > 0) {
      out.push('&province=' + query.province.join(','));
    }
    return out.join('&');
  }

  render() {
    let selectBar = this.createSelectTable();
    return (
      <div className="App">
        <h1>COVID-19 Stats</h1>
        <div className='Dashboard'>
          <div className='Card'>{this.state.chart}</div>
          {selectBar}
        </div>
      </div>
    );
  }
}

export default App;
