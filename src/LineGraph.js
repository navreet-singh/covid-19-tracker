import { blue, red } from '@material-ui/core/colors';
import React,{ useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from 'numeral';
import './LineGraph.css';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersects: false,
        callbacks: {
            label: function(tooltipItem, date){
                return numeral(tooltipItem.value).format('+0.0');
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values){
                        return numeral(value).format('0a');
                    },
                },
            },
        ],
    },
}

function LineGraph({country, casesType = 'cases'}) {

    const [data, setData] = useState({});

    const buildChartData = (data, casesType) => {
        const temp = data.hasOwnProperty('timeline') ? data['timeline'] : data
        const chartData = [];
        let lastDataPoint;
        for(let date in temp[casesType]) {
            if (lastDataPoint){
                const newdataPoint = {
                    x: date,
                    y: temp[casesType][date]-lastDataPoint
                }
                chartData.push(newdataPoint);
            }
            lastDataPoint = temp[casesType][date];
        }
        return chartData;
    }

    useEffect(() => {
        const code = country==='worldwide' ? 'all': country;
        const fetchData = async () => {
            await fetch(`https://disease.sh/v3/covid-19/historical/${code}?lastdays=0`)
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, casesType);
                setData(chartData);
            })
        }
        fetchData();
    }, [country, casesType]);

    return (
        <div className='lineGraph'>
            {data?.length > 0 && (
                <Line
                    options={options} 
                    data={{
                        datasets: [
                            {
                                backgroundColor: 'rgba(204,16,52,0.5)',
                                borderColor: '#CC1034',
                                data: data
                            }
                        ]
                    }}
                />  
            )}
        </div>
    )
}

export default LineGraph;
