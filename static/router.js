import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';
import VueRouter from 'https://cdn.jsdelivr.net/npm/vue-router@3.5.2/dist/vue-router.esm.browser.js';

import Home from "./components/Home.js";
import Login from "./components/login.js";
// import Section from "./components/Section.js";
import Request from "./components/Request.js";
import Feedback from "./components/Feedback.js";
import IssuedEbook from "./components/IssuedEbook.js";
import AdminDashboard from './components/AdminDashboard.js';

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    // { path: '/sections', component: Section },
    { path: '/requests', component: Request },
    { path: '/feedback', component: Feedback },
    { path: '/issued-ebooks', component: IssuedEbook },
    { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' }}
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        next('/login');
      } else if (to.matched.some(record => record.meta.role && record.meta.role !== role)) {
        next('/'); 
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router;
