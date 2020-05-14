import classnames from 'classnames';
import React from 'react';
import config from '../../config';

const { NODE_ENV } = process.env;

const API_URL = config.api.url;
const MAILCATCHER_UI_URL = config.mailcatcher.ui.url;

const css = {
  outer: classnames(`py-1 px-8 text-sm flex justify-between`, {
    'text-gray-200 bg-gray-600': NODE_ENV === 'dev',
    'text-purple-200 bg-purple-600': NODE_ENV === 'e2e',
    'text-orange-200 bg-orange-600': NODE_ENV === 'staging',
    'text-green-200 bg-green-600': NODE_ENV === 'test',
  }),
  right: {
    outer: `flex`,
  },
  separator: `px-2`,
};

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
          <a href={`${MAILCATCHER_UI_URL}/last`} rel="noopener noreferrer" target="_blank">
            mailcatcher
          </a>
        </div>
      </div>
    </div>
  );
};

export default () => <EnvHeader className={css.outer} />;
