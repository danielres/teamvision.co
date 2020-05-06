import React from 'react';
import config from '../../config';

const API_URL = config.api.uri;
const MAILCATCHER_UI_URL = config.mailcatcher.ui.url;

const css = {
  outer: tint => `py-1 px-8 text-sm text-${tint}-200 bg-${tint}-600 flex justify-between`,
  right: {
    outer: `flex`,
  },
  separator: `px-2`,
};

const { NODE_ENV } = process.env;

const EnvHeader = ({ className }) => {
  return (
    <div className={className}>
      <div>{NODE_ENV.toUpperCase()}</div>

      <div className={css.right.outer}>
        <div>
          <a href={API_URL} rel="noopener noreferrer" target="_blank">
            api
          </a>
        </div>

        <div className={css.separator} />

        <div>
          <a href={MAILCATCHER_UI_URL} rel="noopener noreferrer" target="_blank">
            mailcatcher
          </a>
        </div>
      </div>
    </div>
  );
};

export default () => {
  if (NODE_ENV === 'development') return <EnvHeader className={css.outer('gray')} />;
  if (NODE_ENV === 'staging') return <EnvHeader className={css.outer('green')} />;
  if (NODE_ENV === 'test') return <EnvHeader className={css.outer('test')} />;

  return null;
};
