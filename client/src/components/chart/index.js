import React from 'react';
import Chart from "react-google-charts";

function CovidChart(props) {
    const _data = props.data;

    const _loader = <div>Loading Chart</div>
    const _textStyle = {
      fontName: 'Roboto',
      color: '#ECEEED',
      italic: false,
      bold: true
    }

    const _bgcolor = {fill: '#344055', opacity: 0}
    const _options = {
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

    return (
        <Chart
        chartType="LineChart"
        loader={_loader}
        data={_data}
        options={_options}
        rootProps={{ 'data-testid': '2' }}
        legendToggle
        />
    )
}

export default CovidChart;