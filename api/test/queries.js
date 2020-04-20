import queries from '../src/schema/queries';
import client from './graphlClient';

const useClient = query => (variables, { headers: reqHeaders } = {}) =>
  client({ headers: reqHeaders, query, variables }).then(({ body: { data, errors }, headers }) => ({
    data,
    errors,
    headers,
  }));

export const me = useClient(queries.ME);
export const resetPasswordRequest = useClient(queries.RESET_PASSWORD_REQUEST);
export const signIn = useClient(queries.SIGN_IN);
export const signOut = useClient(queries.SIGN_OUT);
export const signUp = useClient(queries.SIGN_UP);
