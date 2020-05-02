import React from 'react';
import config from '../../config';

const classes = (tint = 'teal') => `p-1 text-sm text-${tint}-200 bg-${tint}-600 flex justify-between`;

const css = {
  test: classes('teal'),
  staging: classes('green'),
};

export default () => {
  if (process.env.NODE_ENV === 'test')
    return (
      <div className={css.test}>
        <div>
          <b>TEST</b>
        </div>
        <div>
          api: <b>{config.api.uri}</b>
        </div>
      </div>
    );

  if (process.env.NODE_ENV === 'staging')
    return (
      <div className={css.staging}>
        <div>
          <b>STAGING</b>
        </div>
        <div>
          api: <b>{config.api.uri}</b>
        </div>
      </div>
    );

  return null;
};
