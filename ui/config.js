import { number, object, string } from 'yup';

const isDev = process.env.NODE_ENV === 'dev';
const isE2e = process.env.NODE_ENV === 'e2e';
const isTest = process.env.NODE_ENV === 'test';

const config = {
  api: {
    url: process.env.API_URL,
  },

  devServer: {
    port: Number(process.env.UI_PORT),
  },

  mailcatcher: {
    ui: {
      url: process.env.MAILCATCHER_UI_URL,
    },
  },
};

const validator = object().shape({
  api: object().shape({
    url: string().required(),
  }),

  devServer: object().shape({
    port: number().required(),
  }),

  mailcatcher: object().shape({
    ui: object().shape({
      url: isDev || isTest || isE2e ? string().required() : string(),
    }),
  }),
});

validator.validate(config, { abortEarly: false });

export default config;
