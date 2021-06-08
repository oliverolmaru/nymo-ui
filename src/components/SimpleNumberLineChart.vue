<template>
    <line-chart v-if="chartData" :chartData="chartData" :options="options" :styles="styles">
    </line-chart>
</template>

<script>
import LineChart from '../components/LineChart.vue';
import {generateData} from '../helpers/chartDataFactory';

export default {
    name: 'SimpleNumberLineChart',
    props: {
        logs: Array,
        attribute: String,
        labelMin: String,
        labelAvg: String,
        labelMax: String
    },
    components: {
        LineChart,
    },
    data(){
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index'
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: "#FFF",
                        fontFamily: "'Lexend Deca', sans-serif",
                        fontSize: 18
                    }
                },
                scales: {
                    xAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#FFF",
                        fontFamily: "'Lexend Deca', sans-serif",
                        major: {
                        fontSize: 14
                        },
                        maxTicksLimit: 20
                    },
                    scaleLabel: {
                        display: false,
                        fontColor: "#FFF",
                        fontFamily: "'Lexend Deca', sans-serif"
                    }
                    }],
                    yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#FFF",
                        fontFamily: "'Lexend Deca', sans-serif"
                    },
                    scaleLabel: {
                        fontColor: "#FFF",
                        fontFamily: "'Lexend Deca', sans-serif"
                    }
                    }]
                }
            },
            styles: {
                backgroundColor: "#444444"
            }            
        }
    },
    computed: {
        chartData: function(){
            if(this.logs.length == 0) return null;
            const data = generateData(this.logs,this.attribute);
            return {
                labels: data.labels,
                datasets: [
                {
                    label: this.labelAvg,
                    data: data.averageData,
                    backgroundColor:"rgba(151,200,240,1)",
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(60, 145, 230,1)",
                    borderColor: "rgba(255,255,255,1)",
                    fillColor: "rgba(151,249,190,0.5)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(220,220,220,1)",
                },
                {
                    label: this.labelMin,
                    data: data.minimumData,
                    hidden: true,
                    backgroundColor:"rgba(50,249,190,0.2)",
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(50,249,190,0.2)",
                    borderColor: "rgba(255,255,255,0.2)",
                    fillColor: "rgba(50,249,190,0.2)",
                    strokeColor: "rgba(255,255,255,0.2)",
                    pointColor: "rgba(220,220,220,0.2)",
                },
                {
                    label: this.labelMax,
                    data: data.maximumData,
                    backgroundColor:"rgba(200,100,100,0.2)",
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(200,100,100,0.2)",
                    borderColor: "rgba(255,255,255,0.2)",
                    fillColor: "rgba(200,100,100,0.5)",
                    strokeColor: "rgba(255,255,255,0.2)",
                    pointColor: "rgba(220,220,220,0.2)",
                }
                ]
            };
        }
    }
}
</script>

<style>

</style>