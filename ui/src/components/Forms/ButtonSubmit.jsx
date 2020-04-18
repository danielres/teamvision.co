import React from 'react';
import buttons from '../../css/buttons';

const css = {
  buttons,
};

export default ({
  children = 'Submit',
  classnames: { regular = css.buttons.primary, disabled = css.buttons.gray } = {},
  isDisabled,
}) => (
  <button
    aria-label="Submit"
    className={isDisabled ? disabled : regular}
    disabled={isDisabled}
    type="submit"
    //
  >
    {children}
  </button>
);
