import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import alerts from '../../css/alerts';

const css = {
  alerts,
};

export default ({ error }) => {
  const asyncErrors = get(error, 'graphQLErrors', []);

  if (asyncErrors.length > 0)
    return (
      <ul className={css.alerts.danger.outer}>
        {asyncErrors.map(e => (
          <li key={e.message} className={css.alerts.danger.item}>
            {upperFirst(e.message)}
          </li>
        ))}
      </ul>
    );

  return null;
};
