import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';
import router from './router.js';
import Navbar from './components/Navbar.js';

new Vue({
  el: '#app',
  template: `
    <div>
      <navbar></navbar>
      <router-view></router-view>
    </div>
  `,
  components: { Navbar },
  router,
});
