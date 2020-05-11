import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import buttons from '../../css/buttons';
import { toDashboard, toTopics } from '../../pages/paths';
import queries from '../../queries';
import Spacer from './Spacer';
import UserMenu from './UserMenu';

const css = {
  buttons,
  header1: `py-2 px-16 bg-gray-900 text-gray-500`,
  header2: `py-4 px-16 bg-white  shadow `,
  cols: {
    outer: `flex justify-between`,
    left: {
      outer: ``,
    },
    right: {
      outer: `text-right`,
      item: `inline-block ml-4`,
    },
  },
};

export default () => {
  const { tenantShortId } = useParams();
  const { data, loading } = useQuery(queries.ME);

  return (
    <div data-testid="AppHeader">
      <header className={css.header1}>
        <div className={css.cols.outer}>
          <div className={css.cols.left.outer}>
            <Link className={css.buttons.inverted.text} to={toDashboard()}>
              {tenantShortId}
            </Link>

            <Spacer />
          </div>

          <div className={css.cols.right.outer}>
            <UserMenu data={data} loading={loading} />
          </div>
        </div>
      </header>

      <header className={css.header2}>
        <div className={css.cols.outer}>
          <div className={css.cols.left.outer}>
            <Link className={css.buttons.text} to={toTopics()}>
              Topics
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};
