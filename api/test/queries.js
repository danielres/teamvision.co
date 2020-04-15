import queries from '../src/schema/queries';
import { GraphqlClient } from './graphlClient';

const { mutate } = GraphqlClient();


export const signUp = variables =>
  mutate({ query: queries.SIGN_UP, variables }).then(({ body: { data, errors }, headers }) => ({
    data,
    errors,
    headers,
  }));
