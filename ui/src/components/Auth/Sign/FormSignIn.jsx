import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import buttons from '../../../css/buttons';
import forms from '../../../css/forms';
import queries from '../../../queries';
import AsyncError from '../../Forms/AsyncError';
import ButtonSubmit from '../../Forms/ButtonSubmit';
import Input from '../../Forms/Input';

const css = {
  buttons,
  forms: {
    ...forms,
    actionsRow: classnames(forms.row, `flex justify-between`),
  },
};

export default ({ defaultValues, onSuccess }) => {
  const { register, handleSubmit, errors } = useForm();
  const [mutate, { loading, error }] = useMutation(queries.SIGN_IN);

  const onSubmit = args =>
    mutate({
      variables: { args },
      refetchQueries: [{ query: queries.ME }],
    }).then(onSuccess);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AsyncError error={error} />

      <div className={css.forms.row}>
        <Input
          form={{ errors, register }}
          input={{
            defaultValue: defaultValues.tenantShortId,
            name: 'tenantShortId',
            placeholder: 'Tenant short id',
          }}
          label={{ text: 'Tenant' }}
          validations={{ required: true }}
        />
      </div>

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

      <div className={css.forms.actionsRow}>
        <ButtonSubmit isDisabled={loading}>Sign in</ButtonSubmit>

        <Link className={css.buttons.transparent} to="/auth/reset">
          Forgot password?
        </Link>
      </div>
    </form>
  );
};
