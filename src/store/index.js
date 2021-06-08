import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: '',
    sideMenu: null,
    miniMenu: false,
    globalNotification: '',
    success: false,
    logs: [],
    logGroups: [],
    selectedLogGroup: -1,
    logTimestep: 20,
    realTimeMode: false
  },
  mutations: {
    SET_ACCESS_TOKEN(state, accessToken){
      state.accessToken = accessToken;
      localStorage.accessToken = accessToken;
    },
    SET_SIDE_MENU(state, payload){
      state.sideMenu = payload;
    },
    SET_MINI_MENU(state, payload){
      state.miniMenu = payload;
    },
    SET_GLOBAL_NOTIFICATION(state, payload){
      state.globalNotification = payload;
    },
    SET_SUCCESS(state, payload){
      state.success = payload;
    },
    SET_SHIP_LOGS(state, logs){
      for(let i = 0; i < logs.length; i++){
        logs[i].timestamp = moment(logs[i].timestamp);
      }
      state.logs = logs;
    },
    SET_SHIP_LOG_GROUPS(state, groups){
      for(let i = 0; i < groups.length; i++){
        groups[i].first_log_timestamp = moment(groups[i].first_log_timestamp);
        groups[i].last_log_timestamp = moment(groups[i].last_log_timestamp);
        groups[i].last_updated = moment(groups[i].last_updated);
        
        //New additions
        groups[i].name = groups[i].first_log_timestamp.format("DD.MM.YYYY HH:mm") + " - " + groups[i].last_log_timestamp.format("HH:mm")
      }
      state.logGroups = groups;
    },
    SET_SELECTED_LOG_GROUP(state, group){
      state.selectedLogGroup = group;
    },
    SET_LOG_TIMESTEP(state, timestep){
      state.logTimestep = timestep;
    },
    SET_REAL_TIME_MODE(state, value){
      state.realTimeMode = value;
    }
  },
  actions: {
    loginUser({commit, dispatch}, payload){
      return new Promise((resolve, reject) => {
        axios.post('https://server.mindchip.ee/login',null, {
          auth:{
            username: payload.email,
            password: payload.password
          }
        })
        .then(response => {
          if(response.status == 200){
            commit('SET_ACCESS_TOKEN', response.data.access_token);
            resolve();
          }
          else{
            if(response.status == 401){
              commit('SET_ACCESS_TOKEN', '');
            }
            dispatch('notifyUser',{globalNotification: "Wrong username and/or password!", success: false});
            reject();
          }
        })
        .catch(error => {
          if(error.response){
              if(error.response.status == 401){
                dispatch('notifyUser',{globalNotification: "Wrong username and/or password!", success: false});
                return;
              }
          }
          dispatch('notifyUser',{globalNotification: "Something went wrong while logging in!", success: false});
          reject();
        });
      });
    },
    notifyUser({commit}, payload){
      commit('SET_GLOBAL_NOTIFICATION', payload.globalNotification);
      commit('SET_SUCCESS', payload.success);
      setTimeout(() => {
        commit('SET_GLOBAL_NOTIFICATION', '');
        commit('SET_SUCCESS', false);
      },1500);
    },
    fetchShipLogs({commit, dispatch, state}, payload){
      return new Promise((resolve, reject) => {
        axios.get('https://server.mindchip.ee/shiplogs',{
          headers: {
            Authorization: 'Bearer ' + state.accessToken
          },
          params:{
            group_id: payload.group_id,
            rows: payload.rows,
            timestep: payload.timestep
          }, 
        })
        .then(response => {
          if(response.status == 200){
            commit('SET_SHIP_LOGS', response.data);
            resolve();
          }
          else{
            if(response.status == 401){
              commit('SET_ACCESS_TOKEN', '');
            }
            dispatch('notifyUser',{globalNotification: "Could not fetch Ship Logs!", success: false});
            reject();
          }
        })
        .catch(error => {
          dispatch('notifyUser',{globalNotification: "Could not fetch Ship Logs! Error: " + error, success: false});
          reject();
        });
      });      
    },
    fetchRealTimeShipLogs({commit, dispatch, state}){
      return new Promise((resolve, reject) => {
        axios.get('https://server.mindchip.ee/shiplogs/realtime',{
          headers: {
            Authorization: 'Bearer ' + state.accessToken
          },
          params:{
            rows: 1
          }, 
        })
        .then(response => {
          if(response.status == 200){
            commit('SET_SHIP_LOGS', response.data);
            resolve();
          }
          else{
            if(response.status == 401){
              commit('SET_ACCESS_TOKEN', '');
            }
            dispatch('notifyUser',{globalNotification: "Could not fetch Ship Logs!", success: false});
            reject();
          }
        })
        .catch(error => {
          dispatch('notifyUser',{globalNotification: "Could not fetch Ship Logs! Error: " + error, success: false});
          reject();
        });
      });      
    },
    fetchShipLogGroups({commit, dispatch, state}){
      return new Promise((resolve, reject) => {
        axios.get('https://server.mindchip.ee/shiplogs/groups',{
          headers: {
            Authorization: 'Bearer ' + state.accessToken
          },
        })
        .then(response => {
          if(response.status == 200){
            commit('SET_SHIP_LOG_GROUPS', response.data);
            resolve();
          }
          else{
            if(response.status == 401){
              commit('SET_ACCESS_TOKEN', '');
            }
            dispatch('notifyUser',{globalNotification: "Could not fetch Ship Log Groups!", success: false});
            reject();
          }
        })
        .catch(error => {
          if(error.response.status == 401){
            commit('SET_ACCESS_TOKEN', '');     
          }
          dispatch('notifyUser',{globalNotification: "Could not fetch Ship Log Groups! Error: " + error, success: false});
          reject();
        });
      });   
    }
  },
  modules: {
  }
});
