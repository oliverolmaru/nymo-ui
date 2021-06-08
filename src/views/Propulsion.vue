<template>
  <v-container>
    <v-card v-if="logs.length > 0">
      <v-card-title>
        Hangitud andmepunkte: {{logs.length}}
      </v-card-title>
      <v-card-text>
        <span v-if="latestShipLog.timestamp">Viimane logi: {{latestShipLog.timestamp.format('DD.MM.YYYY HH:mm:ss')}}</span>
        <v-row>
          <v-col cols="12">
            <h2 class="text-center">Pöördekiirus (RPM)</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <h2 class="text-center mb-6">Vasak mootor</h2>
            <simple-number-line-chart 
              :logs="logs"
              attribute="motor_left_current"
              labelMin="Voolutugevus (min)"
              labelAvg="Voolutugevus"
              labelMax="Voolutugevus (max)"
            />
            <simple-number-line-chart 
              :logs="logs"
              attribute="motor_left_rpm"
              labelMin="Pöördekiirus (rpm)"
              labelAvg="Pöördekiirus"
              labelMax="Pöördekiirus (max)"
            />
            <simple-number-line-chart 
              :logs="logs"
              attribute="motor_left_temp"
              labelMin="Temperatuur (min)"
              labelAvg="Temperatuur"
              labelMax="Temperatuur (max)"
            />
          </v-col>
          <v-col cols="6">
            <h2 class="text-center mb-6">Parem mootor</h2>
            <simple-number-line-chart 
              :logs="logs"
              attribute="motor_right_current"
              labelMin="Voolutugevus (min)"
              labelAvg="Voolutugevus"
              labelMax="Voolutugevus (max)"
            />
            <simple-number-line-chart 
              :logs="logs"
              attribute="motor_right_rpm"
              labelMin="Pöördekiirus (min)"
              labelAvg="Pöördekiirus"
              labelMax="Pöördekiirus (max)"
            />
            <simple-number-line-chart 
              :logs="logs"
              attribute="motor_right_temp"
              labelMin="Temperatuur (min)"
              labelAvg="Temperatuur"
              labelMax="Temperatuur (max)"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import { mapState } from 'vuex';
//import L from 'leaflet';
import SimpleNumberLineChart from '../components/SimpleNumberLineChart.vue';
//import LineChart from '../components/LineChart.vue';

export default {
  name: 'Propulsion',
  components: {
    SimpleNumberLineChart
    //LMarker,
  },
  data(){
    return{
      zoom: 12
    }
  },
  created(){
  },
  methods:{
  },
  computed:{
    ...mapState(['logs','logGroups','logTimestep','selectedLogGroup']),
    latestShipLog: function(){
      if(this.logs.length > 0) return this.logs[this.logs.length-1];
      return null;
    },
    mapStartCenter: function(){
      if(this.logs.length > 0) return [this.logs[0].latitude,this.logs[0].longitude];
      return null;
    },
    shipPath: function(){
      const path = []
      for(let i = 0; i < this.logs.length; i++){
        path.push([
          this.logs[i].latitude,
          this.logs[i].longitude
        ]);
      }
      return path;
    }
  }
}
</script>

<style>
.map {
  height:640px;
}

#nav-map .leaflet-pane{
  z-index: 1;
}


</style>
