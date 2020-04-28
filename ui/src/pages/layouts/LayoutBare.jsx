import React from 'react';

const css = { container: `bg-white p-8 mx-auto my-8 shadow rounded` };

export default ({ children }) => {
  return (
    <div className="mx-8">
      <div className={css.container}>{children}</div>
    </div>
  );
};
