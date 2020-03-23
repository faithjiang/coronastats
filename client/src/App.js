import React, {Component} from 'react';
import Chart from "react-google-charts";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.getChart();
  }

  getChart = () => {
    fetch('/getData', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    .then(res=> res.json())
    .then(resData => {
      this.createLineGraph(resData);
    }).catch(err => {
      throw(err);
    });
    this.createLineGraph("test");
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
        width: '50%',
        height: '70%'
      },
      width: '700px',
      height: '600px',
      hAxis: {
        title: 'Day',
        textStyle: _textStyle,
        titleTextStyle: _textStyle,
        gridlines: {color: '#465164', minSpacing: 20}
      },
      vAxis: {
        title: 'Number of Cases',
        textStyle: _textStyle,
        titleTextStyle: _textStyle,
        gridlines: {color: '#465164', minSpacing: 40}
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


  render() {
    return (
      <div className="App">
        <h1>COVID-19 Stats</h1>
        <div className='Dashboard'>
          <div className='Card'>{this.state.chart}</div>
        </div>
      </div>
    );
  }
}

export default App;
