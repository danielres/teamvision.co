import * as React from "react";
import { Link } from "react-router-dom";
import buttons from "../../css/buttons";

const css = {
  buttons,
  header: `bg-white py-4 px-16 shadow`,
  cols: {
    outer: `flex justify-between`,
    left: {
      outer: ``
    },
    right: {
      outer: `text-right`,
      item: `inline-block ml-4`
    }
  }
};

export default () => {
  return (
    <header className={css.header}>
      <div className={css.cols.outer}>
        <div className={css.cols.left.outer}>
          <Link className={css.buttons.text} to="/">
            Home
          </Link>
        </div>

        <div className={css.cols.right.outer}>[PLACEHOLDER]</div>
      </div>
    </header>
  );
};
