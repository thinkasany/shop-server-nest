import * as _ from 'lodash';
import { v3Pay } from './v3';
export const generateOrderNumber = () => {
  const date = new Date();
  return (
    date.getFullYear() +
    _.padStart(date.getMonth(), 2, '0') +
    _.padStart(date.getDay(), 2, '0') +
    _.padStart(date.getHours(), 2, '0') +
    _.padStart(date.getMinutes(), 2, '0') +
    _.padStart(date.getSeconds(), 2, '0') +
    _.random(100000, 999999)
  );
};

export { v3Pay };
