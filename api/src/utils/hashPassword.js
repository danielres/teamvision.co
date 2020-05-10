import bcrypt from 'bcrypt';
import config from '../../config';

const { saltRounds } = config.bcrypt;

export default password => bcrypt.hash(password, saltRounds);
