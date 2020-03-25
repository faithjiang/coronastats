import React, {Component} from 'react';
import CovidChart from './components/chart';
import SelectTable from './components/selectBox';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { chart: null };
  }

  getChart = query => {
    if (query === undefined || query.length < 1){ return }
    fetch(`/stats?${query}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    .then(res=> res.json())
    .then(resData => {
      this.setState({chart: <CovidChart data={resData} />})
    }).catch(err => { 
      this.setState({chart: err.toString()});
      });
  }

  render() {
    let selectBar = <SelectTable getChart={this.getChart} />
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
