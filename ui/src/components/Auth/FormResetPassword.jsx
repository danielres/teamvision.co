import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import buttons from '../../css/buttons';
import forms from '../../css/forms';
import { paths, toDashboard } from '../../pages/paths';
import queries from '../../queries';
import parseQs from '../../utils/parseQs';
import AsyncError from '../Forms/AsyncError';
import ButtonSubmit from '../Forms/ButtonSubmit';
import Input from '../Forms/Input';

const css = {
  buttons,
  forms: {
    ...forms,
    actionsRow: classnames(forms.row, `flex justify-between`),
  },
  success: { outer: `py-12 text-center` },
};

export default () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const onSuccess = () => setIsSuccess(true);

  if (isSuccess)
    return (
      <div className={css.success.outer}>
        <p>Password reset successfully!</p>
        <br />

        <Link className={css.buttons.primary} to={toDashboard()}>
          Sign in
        </Link>
      </div>
    );

  return <FormResetPassword onSuccess={onSuccess} />;
};

const FormResetPassword = ({ onSuccess }) => {
  const [resetPassword, { loading, error }] = useMutation(queries.RESET_PASSWORD);
  const { token } = parseQs();
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();
  const onSubmit = ({ password }) => {
    resetPassword({ variables: { password, token } }).then(onSuccess);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AsyncError error={error} />

      <div className={css.forms.row}>
        <Input
          form={{ errors, register }}
          input={{
            name: 'password',
            placeholder: 'Your new password',
            type: 'password',
          }}
          label={{ text: 'Password' }}
          validations={{ required: true }}
        />
      </div>

      <div className={css.forms.actionsRow}>
        <ButtonSubmit isDisabled={loading}>Update password</ButtonSubmit>

        <button
          className={css.buttons.transparent}
          onClick={e => {
            e.preventDefault();
            history.push(paths.HOME);
          }}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
