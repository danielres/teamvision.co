import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import buttons from '../../../../css/buttons';
import forms from '../../../../css/forms';
import queries from '../../../../queries';
import AsyncError from '../../../Forms/AsyncError';
import ButtonSubmit from '../../../Forms/ButtonSubmit';
import Input from '../../../Forms/Input';

const css = {
  buttons,
  forms: {
    ...forms,
    actionsRow: classnames(forms.row, `flex justify-between`),
  },
  success: { outer: `py-12 text-center` },
};

export default ({ onSuccess }) => {
  const [resetPasswordRequest, { loading, error }] = useMutation(queries.RESET_PASSWORD_REQUEST);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = args => {
    resetPasswordRequest({ variables: args }).then(() => onSuccess(args));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AsyncError error={error} />

      <div className={css.forms.row}>
        <Input
          form={{ errors, register }}
          input={{
            // defaultValue: 'a', // FIXME: delete
            defaultValue: '-heuUf8GD', // FIXME: delete
            name: 'tenantShortId',
            placeholder: 'Tenant',
          }}
          label={{ text: 'Tenant' }}
          validations={{ required: true }}
        />
      </div>

      <div className={css.forms.row}>
        <Input
          form={{ errors, register }}
          input={{
            // defaultValue: 'bob@nope.com', // FIXME: delete
            defaultValue: 'bob@example.com', // FIXME: delete
            name: 'email',
            placeholder: 'Your email',
            type: 'email',
          }}
          label={{ text: 'Email' }}
          validations={{ required: true }}
        />
      </div>

      <div className={css.forms.actionsRow}>
        <ButtonSubmit isDisabled={loading}>Request password reset</ButtonSubmit>

        <Link className={css.buttons.transparent} to="/">
          Cancel
        </Link>
      </div>
    </form>
  );
};
