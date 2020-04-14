import classnames from 'classnames';
import React from 'react';

const response = `bg-gray-100 px-4 py-2 rounded-lg overflow-auto font-mono text-xs`;

const css = {
  data: classnames(`bg-white`, response),
  error: classnames(`bg-red-200`, response),
};

export default ({ data = null, error = null }) => {
  if (error) return <pre className={css.error}>{JSON.stringify(error, null, 2)}</pre>;

  if (data) return <pre className={css.data}>{JSON.stringify(data, null, 2)}</pre>;

  return null;
};