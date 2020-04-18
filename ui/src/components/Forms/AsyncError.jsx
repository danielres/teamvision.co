import get from 'lodash/get';
import React from 'react';
import alerts from '../../css/alerts';

const css = {
  alerts,
};

export default ({ error }) => {
  const asyncErrors = get(error, 'graphQLErrors', []);

  if (asyncErrors.length > 0)
    return (
      <ul className={css.alerts.warning.outer}>
        {asyncErrors.map(e => (
          <li className={css.alerts.warning.item}>{e.message}</li>
        ))}
      </ul>
    );

  return null;
};
