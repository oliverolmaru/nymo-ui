<template>
  <v-container>
    <v-card v-if="logs.length > 0">
      <v-card-title>
        Hangitud andmepunkte: {{logs.length}}
      </v-card-title>
      <v-card-text>
        <span v-if="latestShipLog.timestamp">Viimane logi: {{latestShipLog.timestamp.format('DD.MM.YYYY HH:mm:ss')}}</span>
        <v-row>
          <v-col cols="6">
              <simple-number-line-chart 
                :logs="logs"
                attribute="speed"
                labelMin="Kiirus (min)"
                labelAvg="Kiirus"
                labelMax="Kiirus (max)"
              />
          </v-col>
          <v-col cols="6">
            <v-card id="nav-map" elevation="3">
              <l-map :center="mapStartCenter" :zoom="zoom" style="height: 480px; width: 100%">
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <l-polyline :lat-lngs="shipPath" color="blue"></l-polyline>
              </l-map>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import { mapState } from 'vuex';
//import L from 'leaflet';
import { LMap, LTileLayer/*, LMarker*/,LPolyline } from 'vue2-leaflet';
import SimpleNumberLineChart from '../components/SimpleNumberLineChart.vue';
//import LineChart from '../components/LineChart.vue';

export default {
  name: 'Navigation',
  components: {
    LMap,
    LTileLayer,
    LPolyline,
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
