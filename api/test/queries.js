import queries from '../src/schema/queries';
import { GraphqlClient } from './graphlClient';

const { mutate, query } = GraphqlClient();

export const me = ({ headers: reqHeaders } = {}) =>
  query({ query: queries.ME, headers: reqHeaders }).then(({ body: { data, errors }, headers }) => ({
    data,
    errors,
    headers,
  }));

export const signIn = variables =>
  mutate({ query: queries.SIGN_IN, variables }).then(({ body: { data, errors }, headers }) => ({
    data,
    errors,
    headers,
  }));

export const signOut = () =>
  mutate({ query: queries.SIGN_OUT }).then(({ body: { data, errors }, headers }) => ({
    data,
    errors,
    headers,
  }));

export const signUp = variables =>
  mutate({ query: queries.SIGN_UP, variables }).then(({ body: { data, errors }, headers }) => ({
    data,
    errors,
    headers,
  }));
