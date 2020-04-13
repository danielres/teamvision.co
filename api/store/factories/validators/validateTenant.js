import shortid from 'shortid';
import * as yup from 'yup';

const schemas = {
  insert: yup.object().shape({
    name: yup.string().min(3).required(),
    shortId: yup.string().min(3).required().default(shortid.generate),
  }),
};

export default {
  insert: args => schemas.insert.validate(args, { abortEarly: false }),
};
