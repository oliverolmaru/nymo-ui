<template>
  <v-container>
    <v-card v-if="logs.length > 0">
      <v-card-title v-if="realTimeMode">
        Viide: {{delay.toFixed(1)}} s
      </v-card-title>
      <v-card-text>
        <span v-if="latestShipLog.timestamp">Viimane logi: {{latestShipLog.timestamp.format('DD.MM.YYYY HH:mm:ss')}}</span>
        <v-row>
          <v-col cols="5">
            <v-img src="@/assets/stream.jpg">
              <div class="camera-overlay">
                <div class="text">Kaamera välja lülitatud</div>
              </div>
            </v-img>
            <v-btn @click="loadCameraStill">Kuva</v-btn>
          </v-col>
          <v-col cols="3">
            <v-card elevation="3" ref="canvasBoundingBox">
              <canvas ref="boatCanvas" height="480px"/>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card elevation="3">
              <l-map ref="map" :center="mapStartCenter" :zoom="zoom" style="height: 480px; width: 100%" @ready="mapMounted">
                <!-- url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" -->
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <l-tile-layer
                  url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <l-polyline :lat-lngs="latestShipLocations" color="blue"></l-polyline>
                <!-- <l-marker :lat-lng="mapStartCenter" :icon="icon"/> -->
                <!-- <l-polyline :lat-lngs="shipPath" color="blue"></l-polyline> -->
              </l-map>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <v-card flat>
              <v-card-title>Toiteallikas</v-card-title>
              <v-row>
                <v-col cols="9" class="d-flex justify-center align-center">
                  <v-progress-linear 
                  :value="latestShipLog.battery_current.average/150*100" 
                  :color="'rgba(' + (latestShipLog.battery_current.average/150*255).toFixed(0).toString() +',' + (255-latestShipLog.battery_current.average/150*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                </v-col>
                <v-col cols="3">
                  {{latestShipLog.battery_current.average.toFixed(0)}} A
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="9" class="d-flex justify-center align-center">
                  <v-progress-linear 
                  :value="latestShipLog.battery_voltage.average/18*100" 
                  :color="'rgba(' + (latestShipLog.battery_voltage.average/18*255).toFixed(0).toString() +',' + (255-latestShipLog.battery_voltage.average/18*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                </v-col>
                <v-col cols="3">
                  {{latestShipLog.battery_voltage.average.toFixed(0)}} V
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="9" class="d-flex justify-center align-center">
                  <v-progress-linear 
                  :value="latestShipLog.battery_soc.average/100" 
                  :color="'rgba(' + (latestShipLog.battery_soc.average/10000*255).toFixed(0).toString() +',' + (255-latestShipLog.battery_soc.average/10000*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                </v-col>
                <v-col cols="3">
                  {{(latestShipLog.battery_soc.average/100).toFixed(2)}} %
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card flat>
              <h2 class="py-3">Keskkond</h2>
              <v-row>
                <v-col cols="6">
                  Tuule kiirus
                </v-col>
                <v-col cols="6">
                  {{latestShipLog.wind_speed.average.toFixed(1)}} sõlme
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  Tuule suund
                </v-col>
                <v-col cols="6">
                  {{latestShipLog.wind_direction.average.toFixed(0)}} kraadi
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  Autopiloot
                </v-col>
                <v-col cols="6">
                  {{latestShipLog.ap_mode == 'ACRO' ? 'SEES' : 'VÄLJAS'}}
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              
              <v-card-title>
                Mootorid
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    Vasak
                    <v-row>
                      <v-col cols="9" class="d-flex justify-center align-center">
                        <v-progress-linear 
                        :value="latestShipLog.motor_left_rpm.average/5000*100" 
                        :color="'rgba(' + (latestShipLog.motor_left_rpm.average/5000*255).toFixed(0).toString() +',' + (255-latestShipLog.motor_left_rpm.average/5000*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                      </v-col>
                      <v-col cols="3">
                        {{latestShipLog.motor_left_rpm.average.toFixed(0)}} RPM
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="9" class="d-flex justify-center align-center">
                        <v-progress-linear 
                        :value="latestShipLog.motor_left_temp.average" 
                        :color="'rgba(' + (latestShipLog.motor_left_temp.average/100*255).toFixed(0).toString() +',' + (255-latestShipLog.motor_left_temp.average/100*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                      </v-col>
                      <v-col cols="3">
                        {{latestShipLog.motor_left_temp.average.toFixed(0)}} °C
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="9" class="d-flex justify-center align-center">
                        <v-progress-linear 
                        :value="latestShipLog.motor_left_power.average/3000*100" 
                        :color="'rgba(' + (latestShipLog.motor_left_power.average/3000*255).toFixed(0).toString() +',' + (255-latestShipLog.motor_left_power.average/3000*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                      </v-col>
                      <v-col cols="3">
                        {{latestShipLog.motor_left_power.average.toFixed(0)}} W
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    Parem
                    <v-row>
                      <v-col cols="9" class="d-flex justify-center align-center">
                        <v-progress-linear 
                        :value="latestShipLog.motor_right_rpm.average/5000*100" 
                        :color="'rgba(' + (latestShipLog.motor_right_rpm.average/5000*255).toFixed(0).toString() +',' + (255-latestShipLog.motor_right_rpm.average/5000*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                      </v-col>
                      <v-col cols="3">
                        {{latestShipLog.motor_right_rpm.average.toFixed(0)}} RPM
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="9" class="d-flex justify-center align-center">
                        <v-progress-linear 
                        :value="latestShipLog.motor_right_temp.average" 
                        :color="'rgba(' + (latestShipLog.motor_right_temp.average/100*255).toFixed(0).toString() +',' + (255-latestShipLog.motor_right_temp.average/100*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                      </v-col>
                      <v-col cols="3">
                        {{latestShipLog.motor_right_temp.average.toFixed(0)}} °C
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="9" class="d-flex justify-center align-center">
                        <v-progress-linear 
                        :value="latestShipLog.motor_right_power.average/3000*100" 
                        :color="'rgba(' + (latestShipLog.motor_right_power.average/3000*255).toFixed(0).toString() +',' + (255-latestShipLog.motor_right_power.average/3000*255).toFixed(0).toString() + ', 0, 1)'" height="14px"/>
                      </v-col>
                      <v-col cols="3">
                        {{latestShipLog.motor_right_power.average.toFixed(0)}} W
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import { mapState } from 'vuex';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { LMap, LTileLayer, /*LMarker,*/LPolyline } from 'vue2-leaflet';
import { drawSimpleCircleSector, drawRadarFromMeasurements} from '../helpers/canvasRadarHelpers';

export default {
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    //LMarker
    LPolyline,
  },
  data(){
    return{
      delay: 0,
      timer: '',
      zoom: 12,
      offset: 0,
      marker: null,
      weatherPredictionRectangles: [],
      shipImg: null,
      latestCameraStill: null,
      latestShipLocations: [],
      maxNoOfLocations: 15,
      icon: L.icon({
        iconUrl: require('../assets/ship_big.png'),
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
    }
  },
  created(){
    this.timer = setInterval(this.updateDelay,100);
    const image = new Image();
    image.src = require('../assets/ship_big.png');
    image.onload = () => {
      this.image = image;
    };
  },
  mounted(){
  },
  methods: {
    loadCameraStill(){
      console.log("fetching");
      axios.get('http://87.119.174.101:8080/Streaming/channels/1/picture',{
        auth: {
          username: 'twin',
          password: 'O!iver2.'
        }, 
      })
      .then(response => {
        if(response.status == 200){
          this.latestCameraStill = response.data;
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    mapMounted(mapObject){
      this.marker = L.marker(this.mapStartCenter,{icon: this.icon});
      this.marker.addTo(mapObject);
      // var latitude = 59.95;
      // var longitude = 24.43;

      // for(let x = 0; x < 10; x++){
      //   for(let y = 0; y < 10; y++){
      //     const rect = L.rectangle([[latitude-x*0.1,longitude+y*0.1],[latitude-x*0.1+0.1,longitude+y*0.1+0.1]],
      //     {color: "#000", weight: 1, fill: false});
      //     rect.addTo(mapObject);
      //     this.weatherPredictionRectangles.push(rect);
      //     console.log("generated tile");
      //   }
      // }
    },
    updateDelay(){
      if(this.latestShipLog != null){
        let now = moment(new Date());
        let lastUpdate = this.latestShipLog.timestamp;
        this.delay = moment.duration(now.diff(lastUpdate)).asSeconds();
        let radius = 150;

        //Boat Marker

        this.marker.setRotationAngle(this.latestShipLog.course);
        this.marker.setLatLng(this.mapStartCenter);

        // if(this.latestShipLocations.length > this.maxNoOfLocations){
        //   this.latestShipLocations.splice(this.latestShipLocations.length-1,1);
        // }


        //RADAR & LIDAR view

        this.$refs['boatCanvas'].width = this.$refs['canvasBoundingBox'].$el.getBoundingClientRect().width;
        const ctx = this.$refs['boatCanvas'].getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, this.$refs['boatCanvas'].width,this.$refs['boatCanvas'].height);


        //Let's create scanning zone - FRONT
        drawSimpleCircleSector(ctx, ctx.canvas.width/2, ctx.canvas.height/2, 60, 0, radius, 'rgba(100,255,100,0.2)');

        //Let's create scanning zone - LEFT
        drawSimpleCircleSector(ctx, ctx.canvas.width/2, ctx.canvas.height/2, 60, -60, radius, 'rgba(255,100,100,1)');

        //Let's create scanning zone - RIGHT
        drawSimpleCircleSector(ctx, ctx.canvas.width/2, ctx.canvas.height/2, 60, 60, radius, 'rgba(100,255,100,0.2)');

        const measurements = [];
        for(let i = 0; i < 360; i++){
          measurements.push({
            angle: i,
            distance: 150,
          });
        }
        drawRadarFromMeasurements(ctx, ctx.canvas.width/2, ctx.canvas.height/2, measurements, 36,'gray' );


        //let fontSize = 14;
        ctx.fillStyle = "black";
        ctx.font = "14px Lexend Deca";
        let width = ctx.measureText(this.latestShipLog.front_center_sensor_dist.average.toFixed(0) + " m").width;
        let angle = -Math.PI/2;
        let posX = ctx.canvas.width/2 + Math.cos(angle)*(radius+10)-width/2;
        let posY = ctx.canvas.height/2 + Math.sin(angle)*(radius+10);
        ctx.fillText(this.latestShipLog.front_center_sensor_dist.average.toFixed(0) + " m", posX, posY);

                //let fontSize = 14;
        ctx.font = "14px Lexend Deca";
        width = ctx.measureText(this.latestShipLog.front_left_sensor_dist.average.toFixed(0) + " m").width;
        angle = -Math.PI/2-Math.PI/3;
        posX = ctx.canvas.width/2 + Math.cos(angle)*(radius+10)-width/2;
        posY = ctx.canvas.height/2 + Math.sin(angle)*(radius+10);
        ctx.fillText(this.latestShipLog.front_left_sensor_dist.average.toFixed(0) + " m", posX, posY);

                //let fontSize = 14;
        ctx.font = "14px Lexend Deca";
        width = ctx.measureText((this.latestShipLog.front_right_sensor_dist.average/100).toFixed(0) + " m").width;
        angle = -Math.PI/2+Math.PI/3;
        posX = ctx.canvas.width/2 + Math.cos(angle)*(radius+10)-width/2;
        posY = ctx.canvas.height/2 + Math.sin(angle)*(radius+10);
        ctx.fillText((this.latestShipLog.front_right_sensor_dist.average/100).toFixed(2) + " m", posX, posY);

        //Heading
        ctx.font = "20px Lexend Deca";

        let headingTxt = "Kurss: " + this.latestShipLog.course.toFixed(1) + "°";

        width = ctx.measureText(headingTxt).width;
        posX = ctx.canvas.width/2 -width/2;
        posY = ctx.canvas.height - 20;
        ctx.fillText(headingTxt, posX, posY);

        

        // ctx.beginPath();
        // ctx.fillStyle="black";
        // ctx.arc(ctx.canvas.width/2,ctx.canvas.height/2,20,0,2*Math.PI);
        // ctx.fill();


        ctx.font = "24px Lexend Deca";
        ctx.fillText("LIDAR / Radar", 10, 34);

        if(this.image != null){

          let centerX = ctx.canvas.width/2;
          let centerY = ctx.canvas.height/2;
          let endWidth = 64;
          let endHeight = 64;
          ctx.fillStyle = 'black';
          ctx.drawImage(this.image, 0, 0, this.image.width,this.image.height, centerX-endWidth/2, centerY-endHeight/2, endWidth, endHeight);
        }

        // let path1 = new Path2D("m321.5,231.5c4,0 82.0061,0 81.5,-0.5c0.5061,0.5 0.5,-99.50495 0,-100c0,0.49874 -0.5,-35.5 24.5,-56.5c24,22 20,57 19.5,56.5c0.5,0.5 0.5,270.50741 0,270c0,0.51155 -37.5,0.5 -38,0c0.49667,0 0.5,-82.10751 0,-83c0,0.94819 -88.65807,1.5 -89,0c0.43082,0 0.5,79.65047 0,79c0,0.62726 -37.56055,0.5 -38,0c0.47001,0 0.5,-270.50186 0,-271c0,0.49954 -0.5,-47.5 15.5,-57.5c14,10 18,60 17.5,59.5c0.5,0.5 2.5,103.5 6.5,103.5z");
        // path1.moveTo(ctx.canvas.width/2,ctx.canvas.height/2);
        // ctx.fill(path1);
      }
    }
  },
  watch: {
    latestShipLog: function(){
      if(this.latestShipLocations.length > 0){
        if(this.latestShipLocations[this.latestShipLocations.length-1][0] ==  this.latestShipLog.latitude && this.latestShipLocations[this.latestShipLocations.length-1][1] ==  this.latestShipLog.longitude) return;
      }
      this.latestShipLocations.push([
        this.latestShipLog.latitude,
        this.latestShipLog.longitude
      ]);
      if(this.latestShipLocations.length > this.maxNoOfLocations) this.latestShipLocations.splice(0,1);
    }
  },
  computed:{
    
    ...mapState(['logs','logGroups','logTimestep','selectedLogGroup','realTimeMode']),
    latestShipLog: function(){
      if(this.logs.length > 0) return this.logs[this.logs.length-1];
      return null;
    },
    mapStartCenter: function(){
      if(this.logs.length > 0) return [this.logs[0].latitude,this.logs[0].longitude];
      return null;
    },
    shipMarkerLatLng: function(){
      if(this.logs.length > 0) return {
        lat: this.logs[0].latitude,
        lng: this.logs[0].longitude
      };
      return null;
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
canvas{
  background-color: white;
}

.camera-overlay{
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.2);
}

.camera-overlay .text{
  flex: 0;
  line-height: 100%;
  font-size: 48px;
  text-align: center;
  background: rgba(0,0,0,0.5);
  padding: 10px 0px;
}
</style>

