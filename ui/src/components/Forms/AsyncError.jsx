import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import alerts from '../../css/alerts';

const css = {
  alerts,
};

export default ({ error }) => {
  const asyncErrors = get(error, 'graphQLErrors');

  if (asyncErrors)
    return (
      <ul className={css.alerts.danger.outer}>
        {asyncErrors.map(e => (
          <ErrorMessages key={e.message} error={e} />
        ))}
      </ul>
    );

  return null;
};

const ErrorMessages = ({ error }) => {
  const messages = get(error, 'messages', [error.message]);

  return messages.map(e => (
    <li className={css.alerts.danger.item} key={e}>
      {upperFirst(e)}
    </li>
  ));
};
