import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import * as queries from '../../queries';
import Inspector from '../Inspector';

const css = {};

export default () => {
  const { data, loading, error } = useQuery(queries.TOPICS, {
    variables: { tenantId: 'XXX' }, // FIXME
  });

  if (loading) return 'Loading...';

  return (
    <h2>
      Topics!
      <Inspector data={data} error={error} />
    </h2>
  );
};
