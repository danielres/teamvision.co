import * as React from 'react';

const css = {
  outer: `bg-orange-200`,
};

export default ({ children }) => {
  if (process.env.NODE_ENV === 'production') return null;

  return <div className={css.outer}>{children}</div>;
};
