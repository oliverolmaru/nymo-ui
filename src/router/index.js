import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Navigation from '../views/Navigation.vue'
import Battery from '../views/Battery.vue'
import Propulsion from '../views/Propulsion.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      guest: true,
      title: "DigiNYMO - Login"
    }
  },
  {
    path: '/navigation',
    name: 'Navigatsioon',
    component: Navigation,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/battery',
    name: 'Battery',
    component: Battery,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/propulsion',
    name: 'Propulsion',
    component: Propulsion,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (!localStorage.accessToken) {
        next({
            path: '/login',
            params: { nextUrl: to.fullPath }
        })
      } else {
        next();
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(!localStorage.accessToken){
          next()
      }
      else{
        next({
          path: '/',
          params: { nextUrl: to.fullPath }
      })
      }
  }else {
      next()
  }
})

export default router
