const defaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'bob@example.com',
        name: 'Bob',
        password: '123456A!',
      }
    : {};

export default defaultValues;
