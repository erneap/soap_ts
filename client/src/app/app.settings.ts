import { InjectionToken } from "@angular/core";

export interface AppSettings {
  title: string;
  version: string;
  apiUrl: string;
}

export const appSettings: AppSettings = {
  title: 'SOAP Journal',
  version: '1.0',
  apiUrl: 'https://www.soapjournal.org/api'
};

export const APP_SETTINGS = new InjectionToken<AppSettings>('app.settings');