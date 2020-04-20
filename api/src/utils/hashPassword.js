import bcrypt from 'bcrypt';
import config from '../../config';

const {
  bcrypt: { saltRounds },
} = config;

export default password => bcrypt.hash(password, saltRounds);
