import { createApp } from 'vue';
// Import elemnt plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './axios';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
