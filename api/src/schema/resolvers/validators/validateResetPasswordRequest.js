import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  tenantShortId: yup.string().required(),
});

export default args => schema.validate(args, { abortEarly: false });
