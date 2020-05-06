import { number, object, string } from 'yup';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const config = {
  api: {
    uri: isTest ? process.env.GRAPHQL_URI_TEST : process.env.GRAPHQL_URI,
  },

  devServer: {
    port: isTest ? process.env.UI_DEV_SERVER_PORT_TEST : process.env.UI_DEV_SERVER_PORT,
  },

  mailcatcher: {
    ui: {
      url: process.env.MAILCATCHER_UI_URL,
    },
  },
};

const validator = object().shape({
  api: object().shape({
    uri: string().required(),
  }),

  devServer: object().shape({
    port: number().required(),
  }),

  mailcatcher: object().shape({
    ui: object().shape({
      url: isDev || isTest ? string().required() : string(),
    }),
  }),
});

validator.validate(config, { abortEarly: false });

export default config;
