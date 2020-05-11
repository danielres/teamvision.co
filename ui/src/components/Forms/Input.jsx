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
  validations,
}) => {
  const id = `${name}-${Math.random()}`;

  return (
    <>
      <label htmlFor={id}>
        {label && <span className={labelClassName}>{label}</span>}
        <input
          className={classnames(css.forms.inputs[type], { [css.forms.inputs.error]: errors[name] })}
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
