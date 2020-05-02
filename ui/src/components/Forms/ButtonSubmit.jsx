import React from 'react';
import buttons from '../../css/buttons';

const css = {
  buttons,
};

export default ({
  children = 'Submit',
  classnames: { regular = css.buttons.primary, disabled = css.buttons.gray } = {},
  isDisabled,
  test: { prefix } = {},
}) => {
  const testId = prefix ? `${prefix}.buttons.submit` : undefined;

  return (
    <button
      aria-label="Submit"
      className={isDisabled ? disabled : regular}
      data-testId={testId}
      disabled={isDisabled}
      type="submit"
    >
      {children}
    </button>
  );
};
