import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import forms from '../../../css/forms';
import queries from '../../../queries';
import AsyncError from '../../Forms/AsyncError';
import ButtonSubmit from '../../Forms/ButtonSubmit';
import Input from '../../Forms/Input';
import defaultValues from '../defaultValues';

const css = {
  forms,
  heading: `text-xl mb-4 text-gray-800`,
  notice: { outer: `my-10 text-gray-600` },
};

const FormSignUp = ({ onSuccess }) => {
  const { register, handleSubmit, errors } = useForm();
  const [mutate, { loading, error }] = useMutation(queries.SIGN_UP);
  const onSubmit = args => mutate({ variables: { args } }).then(onSuccess);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AsyncError error={error} />
      <h2 className={css.heading}>Sign up</h2>

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
          test={{ prefix: 'formSignUp' }}
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
          test={{ prefix: 'formSignUp' }}
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
          test={{ prefix: 'formSignUp' }}
          validations={{ required: true }}
        />
      </div>

      <div className={classnames(css.forms.row)}>
        <ButtonSubmit isDisabled={loading} test={{ prefix: 'formSignUp' }}>
          Sign up
        </ButtonSubmit>
      </div>
    </form>
  );
};

export default () => {
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const onSignupSuccess = () => setIsSignupSuccess(true);

  return (
    <>
      {isSignupSuccess ? (
        <section className={css.notice.outer}>
          <p>Almost there, thank you for registering!</p>
          <br />
          <p>Please check your emails to confirm your account.</p>
        </section>
      ) : (
        <FormSignUp onSuccess={onSignupSuccess} />
      )}
    </>
  );
};
