import { InjectionToken } from "@angular/core";

export interface AppSettings {
  title: string;
  version: string;
  apiUrl: string;
}

export const appSettings: AppSettings = {
  title: 'SOAP Bible Journaling',
  version: '1.0',
  apiUrl: 'http://localhost:4000/api'
};

export const APP_SETTINGS = new InjectionToken<AppSettings>('app.settings');