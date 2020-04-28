import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import buttons from '../../css/buttons';
import forms from '../../css/forms';
import { toHome } from '../../pages/paths';
import queries from '../../queries';
import AsyncError from '../Forms/AsyncError';
import ButtonSubmit from '../Forms/ButtonSubmit';
import Input from '../Forms/Input';
import defaultValues from './defaultValues';

const css = {
  buttons,
  success: { outer: `py-12 text-center` },
  forms: {
    ...forms,
    actionsRow: classnames(forms.row, `flex justify-between`),
  },
};

export default () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const onSuccess = ({ email: successEmail }) => {
    setIsSuccess(true);
    setEmail(successEmail);
  };

  if (isSuccess)
    return (
      <div className={css.success.outer}>
        <p>Password reset instructions have been sent to your email:</p>
        <p className="my-4">{email}</p>

        <br />

        <Link className={css.buttons.primary} to={toHome()}>
          Back
        </Link>
      </div>
    );

  return <FormResetPasswordRequest onSuccess={onSuccess} />;
};

const FormResetPasswordRequest = ({ onSuccess }) => {
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
            defaultValue: defaultValues.email,
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

        <Link className={css.buttons.transparent} to={toHome()}>
          Cancel
        </Link>
      </div>
    </form>
  );
};
