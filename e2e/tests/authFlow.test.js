import config from '../config';
import getElementAttr from './helpers/getElementAttr';
import samples from './helpers/samples';

const URL_FORM_SIGN_UP = config.ui.url;
const URL_LAST_EMAIL = `${config.mailcatcher.ui.url}/last`;

const APP_HEADER = `[data-testid="AppHeader"]`;
const BUTTON_SIGN_OUT = `[data-testid="buttons.signOut"]`;
const FORM_SIGN_IN = `[data-testid="FormSignIn"]`;
const FORM_SIGN_IN_BUTTON_SUBMIT = `${FORM_SIGN_IN} button[type="submit"]`;
const FORM_SIGN_UP = `[data-testid="FormSignUp"]`;
const FORM_SIGN_UP_BUTTON_SUBMIT = `${FORM_SIGN_UP} button[type="submit"]`;
const VERIFY_EMAIL_BUTTON_SIGN_IN = `[data-testid="VerifyEmail"] [data-testid="buttons.signIn"]`;

const { jake } = samples.signupInput;

describe('successful auth flow', () => {
  beforeAll(() => page.goto(URL_FORM_SIGN_UP));

  describe('signing up', () => {
    it('shows as confirmation message', async () => {
      await expect(page).toFillForm(FORM_SIGN_UP, { email: jake.email, password: jake.password, name: jake.name });
      await expect(page).toClick(FORM_SIGN_UP_BUTTON_SUBMIT);
      await expect(page).toMatch('thank you for registering');
    });

    describe('using the verification email', () => {
      let HREF_EMAIL_VERIFICATION;

      it('leads to the email verification page', async () => {
        await page.goto(URL_LAST_EMAIL);
        HREF_EMAIL_VERIFICATION = await getElementAttr('a.button', 'href');
      });

      describe('email verification page', () => {
        it('leads to sign in page', async () => {
          await page.goto(HREF_EMAIL_VERIFICATION);
          await expect(page).toClick(VERIFY_EMAIL_BUTTON_SIGN_IN);
        });

        describe('signin in', () => {
          it('reveals the app', async () => {
            await expect(page).toFillForm(FORM_SIGN_IN, { email: jake.email, password: jake.password });
            await expect(page).toClick(FORM_SIGN_IN_BUTTON_SUBMIT);
            await expect(page).toMatchElement(APP_HEADER);
          });

          describe('signing out', () => {
            it('presents the sign in form', async () => {
              await expect(page).toClick(BUTTON_SIGN_OUT);
              await expect(page).toMatchElement(FORM_SIGN_IN);
            });
          });
        });
      });
    });
  });
});
