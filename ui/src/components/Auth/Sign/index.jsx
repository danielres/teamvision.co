import React from 'react';
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';

const css = {
  columns: { outer: `flex -mx-8` },
  column: {
    left: `w-1/2 px-12 border-r`,
    right: `w-1/2 px-12`,
  },
};

export default () => {
  return (
    <div className={css.columns.outer}>
      <section className={css.column.left}>
        <FormSignIn />
      </section>
      <section className={css.column.right}>
        <FormSignUp />
      </section>
    </div>
  );
};
