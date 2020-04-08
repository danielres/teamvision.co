import * as yup from 'yup';

export default {
  insert: yup.object().shape({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
};
