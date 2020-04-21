import * as yup from 'yup';
import { REGEX_UUID } from '../../../src/isUuid';

const password = yup.string().min(6).required();

const schemas = {
  insert: yup.object().shape({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password,
  }),

  updatePassword: yup.object().shape({
    id: yup.string().matches(REGEX_UUID, 'User id is not in correct format').required(),
    password,
  }),

  verifyEmail: yup.object().shape({
    id: yup.string().matches(REGEX_UUID, 'User id is not in correct format').required(),
  }),
};

export default {
  insert: args => schemas.insert.validate(args, { abortEarly: false }),
  updatePassword: args => schemas.updatePassword.validate(args, { abortEarly: false }),
  verifyEmail: args => schemas.verifyEmail.validate(args, { abortEarly: false }),
};
