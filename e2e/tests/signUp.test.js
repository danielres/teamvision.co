/* eslint-disable import/no-extraneous-dependencies */
/* global page */
import { config } from 'api/exports';
import 'expect-puppeteer';
import fill from './helpers/fill';
import samples from './helpers/samples';
import testId from './helpers/testId';

const { host } = config.ui;
const { jake } = samples.signupInput;

const buttons = name => testId(`formSignUp.buttons.${name}`);
const inputs = name => testId(`formSignUp.inputs.${name}`);

describe('signup form', () => {
  beforeAll(async () => {
    await page.goto(host);
  });

  describe('on success', () => {
    beforeAll(async () => {
      await fill(inputs('email'), jake.email);
      await fill(inputs('password'), jake.password);
      await fill(inputs('name'), jake.name);
      await page.click(buttons('submit'));
    });

    it('displays a confirmation message', async () => {
      await expect(page).toMatch('thank you for registering');
    });
  });
});
