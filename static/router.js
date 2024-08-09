import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';
import VueRouter from 'https://cdn.jsdelivr.net/npm/vue-router@3.5.2/dist/vue-router.esm.browser.js';

import Home from "./components/Home.js";
import Login from "./components/login.js";
import Section from "./components/Section.js";
import Feedback from "./components/Feedback.js";
import AvailableEbook from "./components/AvailableEbook.js";
import AdminDashboard from "./components/adminDashboard.js";
import AdminRequests from './components/AdminRequests.js';
import UserDashboard from './components/userDashboard.js';
import SectionBooks from './components/SectionBooks.js'; 
import PurchaseIssuedEbooks from './components/PurchaseIssuedEbooks.js';
import UpdateProfile from './components/UpdateProfile.js';

Vue.use(VueRouter);

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/sections', component: Section },
    { path: '/feedback', component: Feedback, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/available-ebooks', component: AvailableEbook, meta: { requiresAuth: true, role: 'user' } },
    { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' }},
    { path: '/user/dashboard', component: UserDashboard, meta: { requiresAuth: true, role: 'user' }},
    { path: '/admin-requests', component: AdminRequests, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/section-books/:sectionId', name: 'section-books', component: SectionBooks, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/purchase-issued-ebooks', component: PurchaseIssuedEbooks },
    { path: '/update-profile', component: UpdateProfile },
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
