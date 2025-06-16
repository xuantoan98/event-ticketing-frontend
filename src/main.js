import { createApp } from 'vue'
// Import elemnt plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(router);
app.use(ElementPlus);

app.mount('#app');