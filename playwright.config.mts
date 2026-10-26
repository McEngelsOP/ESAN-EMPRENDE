import { defineConfig } from '@playwright/test';
import chromium from '@sparticuz/chromium';
export default defineConfig({testDir:'./tests',workers:1,use:{baseURL:'http://127.0.0.1:3000',launchOptions:{executablePath:await chromium.executablePath(),args:chromium.args.filter(arg=>arg!=='--single-process')}},webServer:{command:'npm run start',url:'http://127.0.0.1:3000',reuseExistingServer:true},projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}]});
