import { gql } from 'apollo-boost';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as api from 'api/exports';

const queries = Object.entries(api.queries)
  .map(([k, v]) => ({
    [k]: gql`
      ${v}
    `,
  }))
  .reduce((acc, val) => ({ ...acc, ...val }), {});

export default {
  ...queries,

  // FIXME: move to api:
  TOPICS: gql`
    query Topics($tenantId: ID!) {
      topics(tenantId: $tenantId) {
        id
      }
    }
  `,
};
