import classnames from 'classnames';
import React from 'react';
import forms from '../../css/forms';

const css = {
  forms,
};

export default ({
  form: { errors, register },
  input: { defaultValue, name, placeholder, type = 'text' },
  label: { className: labelClassName = css.forms.label, text: label },
  test: { prefix } = {},
  validations,
}) => {
  const id = `${name}-${Math.random()}`;
  const testId = prefix ? `${prefix}.inputs.${name}` : undefined;

  return (
    <>
      <label htmlFor={id}>
        {label && <span className={labelClassName}>{label}</span>}
        <input
          className={classnames(css.forms.inputs[type], { [css.forms.inputs.error]: errors[name] })}
          data-testId={testId}
          defaultValue={defaultValue}
          id={id}
          name={name}
          placeholder={placeholder}
          ref={register(validations)}
          type={type}
        />
      </label>

      {errors[name] && <div className={css.forms.error}>{errors[name].type}</div>}
    </>
  );
};
