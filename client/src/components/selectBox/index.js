import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
const {countries} = require('../../countries');

class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign(countries, {min: 0, input: ''});
    }

    componentDidMount = () => {
        let query = this.getQuery(this.state);
        this.props.getChart(query);
    }

    updateList = e =>{
        this.setState({input: e.target.value});
    }

    createSelectTable = () => {
        let selectList = [];
        for (let country in this.state) {
            if (country === 'input' || country === 'min') { continue }
            if (this.state.input !== '' && !(country.startsWith(this.state.input))) { continue }
            if ('provinces' in this.state[country]) {
                selectList.push(this.createAccordion(country))
            } else {
                let checkBox = this.createCheckBox(country);
                selectList.push(checkBox);
            }
        }
        return selectList;
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
        if (this.state[country]['flag'] === false) { return <div></div> }
        return this.createProvincesList(country);
    }

    createProvincesList = country => {
        let provincesList = [];
        for (let province in this.state[country]['provinces']) {
          provincesList.push(this.createCheckBox(country, province));
        }
        return provincesList;
    }

    createCheckBox = (country, province) => {
        let labelText = province? province: country;
        let checkValue = province? this.state[country]['provinces'][province] : this.state[country]['checked'];
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
        let query = this.state;
        if (e.target.id === 'min_count') {
            query.min = e.target.value;
        } else {
            let country = e.target.getAttribute('country');
            let province = e.target.getAttribute('province');
            if (e.target.checked) {
              if (province) {
                query[country] = this.add2Provinces(query[country], province);
              } else {
                query[country] = this.checkCountry(query[country], true);
              }
            } else {
              if (province) {
                query[country] = this.removeFrmProvinces(query[country], province);
              } else {
                query[country] = this.checkCountry(query[country], false);
              }
            }
        }

        this.props.getChart(this.getQuery(query));
    }


    setAllProvinces = (provincesObj, value) => {
        let tmpProvinces = provincesObj;
        for (let prov in tmpProvinces) {
            tmpProvinces[prov] = value;
        }
        return tmpProvinces;
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
            if (checked === false) { return false }
        }
        return true;
    }    

    removeFrmProvinces = (countryObj, province) => {
        let tmpCountry = countryObj;
        tmpCountry.provinces[province] = false;
        tmpCountry.checked = false;
        return tmpCountry;
    }

    checkCountry = (countryObj, value) => {
        let tmpCountry = countryObj;
        tmpCountry.checked = value;
        if ('provinces' in tmpCountry) {
            tmpCountry.provinces = this.setAllProvinces(tmpCountry.provinces, value)
        }
        return tmpCountry;       
    }

    getQuery = currentSelectList => {
        let query = {country: [], province: []};
        let out = [];
        for (let country in currentSelectList) {
            if (country === 'input' || country === 'min') { continue }
            if (currentSelectList[country].checked === true) {
                query.country.push(country);
            } else {
                if (!('provinces' in currentSelectList[country])) { continue }
                for (let province in currentSelectList[country]['provinces']) {
                    if (currentSelectList[country]['provinces'][province] === true) {
                        query.province.push(country+'-'+province);
                    }
                }
            }
        }
        out.push('min=' + currentSelectList.min);
        if (query.country.length > 0) {
            out.push('country=' + query.country.join('--'));
        }
        if (query.province.length > 0) {
            out.push('province=' + query.province.join('--'));
        }
        return out.join('&');
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
        let tmpCountry = this.state[country];
        tmpCountry['flag'] = !(this.state[country]['flag']);

        this.setState({[country]: tmpCountry});
    }   

    getRangeSelect = () => {
        return (
            <Form.Group className="minRangeSelector">
                <Form.Label>SELECT MIN CASES:</Form.Label>
                <Form.Control  type="range" id="min_count" min='0' max='2000' value={this.state.min} onChange={e => {this.handleChange(e)}} />
            </Form.Group>
        )
    }

    render() {
        let selectList = this.createSelectTable();
        let rangeSelect = this.getRangeSelect();
        return(
            <div className='SelectBox'>
                {rangeSelect}
                <input type='text' onChange={e => {this.updateList(e)}} className="searchInput" />
                <div className="CountriesList">{selectList}</div>
            </div>
        )
    }

}

export default SelectBox;
