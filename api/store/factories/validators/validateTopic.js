import * as yup from 'yup';

const schemas = {
  insert: yup.object().shape({
    name: yup.string().min(2).required(),
  }),
};

export default {
  insert: args => schemas.insert.validate(args, { abortEarly: false }),
};
