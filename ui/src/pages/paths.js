import { useParams } from 'react-router-dom';

export const paths = {
  DASHBOARD: '/:tenantShortId',
  HOME: '/',
  PASSWORD_RESET: '/:tenantShortId/auth/reset',
  PASSWORD_RESET_REQUEST: '/auth/reset',
  SIGN_UP: '/signup',
  TOPICS: '/:tenantShortId/topics',
  VERIFY_EMAIL: '/:tenantShortId/auth/verify',
};

const convertPath = str => {
  const { tenantShortId } = useParams();
  return str.replace(':tenantShortId', tenantShortId);
};

export const toDashboard = () => convertPath(paths.DASHBOARD);
export const toHome = () => convertPath(paths.HOME);
export const toPasswordReset = () => convertPath(paths.PASSWORD_RESET);
export const toPasswordResetRequest = () => convertPath(paths.PASSWORD_RESET_REQUEST);
export const toSignUp = () => convertPath(paths.SIGN_UP);
export const toTopics = () => convertPath(paths.TOPICS);
export const toVerifyEmail = () => convertPath(paths.VERIFY_EMAIL);
