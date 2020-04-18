import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import forms from '../../css/forms';
import queries from '../../queries';
import AsyncError from '../Forms/AsyncError';
import ButtonSubmit from '../Forms/ButtonSubmit';
import Input from '../Forms/Input';

const css = {
  forms,
};

export default ({ defaultValues, onSuccess }) => {
  const { register, handleSubmit, errors } = useForm();
  const [mutate, { loading, error }] = useMutation(queries.SIGN_UP);
  const onSubmit = args => mutate({ variables: { args } }).then(onSuccess);

  return (
    <>
      <AsyncError error={error} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={css.forms.row}>
          <Input
            form={{ errors, register }}
            input={{
              defaultValue: defaultValues.email,
              name: 'email',
              placeholder: 'Your email',
              type: 'email',
            }}
            label={{ text: 'Email' }}
            validations={{ required: true }}
          />
        </div>

        <div className={css.forms.row}>
          <Input
            form={{ errors, register }}
            input={{
              defaultValue: defaultValues.password,
              name: 'password',
              placeholder: 'Your password',
              type: 'password',
            }}
            label={{ text: 'Password' }}
            validations={{ required: true }}
          />
        </div>

        <div className={css.forms.row}>
          <Input
            form={{ errors, register }}
            input={{
              defaultValue: defaultValues.name,
              name: 'name',
              placeholder: 'Your username',
            }}
            label={{ text: 'Username' }}
            validations={{ required: true }}
          />
        </div>

        <div className={classnames(css.forms.row)}>
          <ButtonSubmit isDisabled={loading}>Sign up</ButtonSubmit>
        </div>
      </form>
    </>
  );
};
