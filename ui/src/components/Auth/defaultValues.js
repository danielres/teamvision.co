const defaultValues = ['development'].includes(process.env.NODE_ENV)
  ? {
      email: `bob-${process.env.NODE_ENV}@example.com`,
      name: 'Bob',
      password: '123456A!',
    }
  : {};

export default defaultValues;
