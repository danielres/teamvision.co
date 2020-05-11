import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory, useParams } from 'react-router-dom';
import buttons from '../../../css/buttons';
import forms from '../../../css/forms';
import { paths, toHome, toPasswordResetRequest } from '../../../pages/paths';
import queries from '../../../queries';
import AsyncError from '../../Forms/AsyncError';
import ButtonSubmit from '../../Forms/ButtonSubmit';
import Input from '../../Forms/Input';
import defaultValues from '../defaultValues';

const css = {
  buttons,
  forms: {
    ...forms,
    actionsRow: classnames(forms.row, `flex justify-between`),
  },
  heading1: `text-lg mb-8 text-gray-800`,
  heading2: `text-xl mb-4 text-gray-700`,
};

export default () => {
  const { register, handleSubmit, errors } = useForm();
  const [mutate, { loading, error }] = useMutation(queries.SIGN_IN);
  const params = useParams();
  const history = useHistory();
  const toDashboard = () => paths.DASHBOARD.replace(':tenantShortId', params.tenantShortId);

  const onSubmit = args =>
    mutate({
      variables: { args: { ...args, tenantShortId: params.tenantShortId || args.tenantShortId } },
      refetchQueries: [{ query: queries.ME }],
    }).then(() => {
      if (!params.tenantShortId) history.push(toDashboard());
    });

  return (
    <form data-testid="FormSignIn" onSubmit={handleSubmit(onSubmit)}>
      <AsyncError error={error} />

      {params.tenantShortId && (
        <h2 className={css.heading1}>
          <span className="text-gray-600">
            <Link to={toHome()}>Teamvision</Link> /
          </span>{' '}
          {upperFirst(params.tenantShortId)}
        </h2>
      )}
      <h3 className={css.heading2}>Sign in</h3>

      {!params.tenantShortId && (
        <div className={css.forms.row}>
          <Input
            form={{ errors, register }}
            input={{
              name: 'tenantShortId',
              placeholder: 'Tenant shortid',
            }}
            label={{ text: 'Tenant shortid' }}
            validations={{ required: true }}
          />
        </div>
      )}

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

        <Link className={css.buttons.transparent} to={toPasswordResetRequest()}>
          Forgot password?
        </Link>
      </div>
    </form>
  );
};
