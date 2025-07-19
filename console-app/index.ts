import { sayHello } from 'soap-models/test';
import { TranslationList } from 'soap-models/plans';
import all from './translations.json';

sayHello();

const trans = (all as TranslationList)

trans.list.forEach(t => {
  console.log(`Short: ${t.short} - Long: ${t.long}`);
});