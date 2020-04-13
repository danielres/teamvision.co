import * as yup from 'yup';

const schemas = {
  insert: yup.object().shape({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
};

export default {
  insert: args => schemas.insert.validate(args, { abortEarly: false }),
};
