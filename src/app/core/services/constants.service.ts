import { Injectable, OnInit } from "@angular/core";
import Config from "../../../../proxy.conf.json";
import * as process from 'process';

@Injectable({
  providedIn: "root"
})
export class ConstantsService{
  private env: string;
  private config: any;
  private recatpchaKey: string;



  constructor() {
    this.env = process.env.NODE_ENV || 'prod';
    this.config = Config.config[this.env];
    // console.log('Inside constructor for ConstantsService with Config '+JSON.stringify(this.config));
  }

  getConfig() {
    // console.debug('Environment configuration: '+JSON.stringify(this.config));
    return this.config;
  }

  getReCaptchaKey() {
    this.recatpchaKey = Config.captchaConfig.siteKey;
    // console.log('Recaptcha key in config: '+JSON.stringify(this.recatpchaKey));
    return this.recatpchaKey;
  }

  getAPIUrl() {
    const {baseUrl} = this.getConfig();
    return baseUrl
  }
}
