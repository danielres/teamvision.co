import bcrypt from 'bcrypt';
import config from '../config';

const {
  bcrypt: { saltRounds },
} = config;

export const allowOnlyInEnvs = (...envs) => {
  if (!envs.includes(process.env.NODE_ENV)) throw new Error('Forbidden action in this environment');
};

export const hashPassword = password => bcrypt.hash(password, saltRounds);

export const verifyPassword = bcrypt.compare;

export const reportError = error => {
  console.error('');
  console.error('== REPORT '.padEnd(70, '='));
  console.error(error);
  console.error(''.padEnd(70, '='));
  console.error('');
};

export const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));
