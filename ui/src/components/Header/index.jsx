import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import { Link } from 'react-router-dom';
import buttons from '../../css/buttons';
import queries from '../../queries';
import UserMenu from './UserMenu';
import Spacer from './Spacer';

const css = {
  buttons,
  header: `bg-white py-4 px-16 shadow`,
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
  const { data, loading } = useQuery(queries.ME);

  return (
    <header className={css.header}>
      <div className={css.cols.outer}>
        <div className={css.cols.left.outer}>
          <Link className={css.buttons.text} to="/">
            Home
          </Link>

          <Spacer />

          <Link className={css.buttons.text} to="/topics">
            Topics
          </Link>
        </div>

        <div className={css.cols.right.outer}>
          <UserMenu data={data} loading={loading} />
        </div>
      </div>
    </header>
  );
};
