import * as yup from 'yup';

export default {
  insert: yup.object().shape({
    name: yup.string().min(3).required(),
  }),
};
