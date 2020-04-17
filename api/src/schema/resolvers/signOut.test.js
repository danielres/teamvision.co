import { signOut } from '../../../test/queries';
import parseCookie from '../../../test/parseCookie';

describe('mutation SignOut', () => {
  describe('on success', () => {
    let response;
    let deleteSessionCookie;
    let deleteSessionSigCookie;

    beforeAll(async () => {
      response = await signOut();
      const responseCookies = response.headers['set-cookie'].map(parseCookie);
      deleteSessionCookie = responseCookies.find(c => Object.keys(c).includes('session'));
      deleteSessionSigCookie = responseCookies.find(c => Object.keys(c).includes('session.sig'));
    });

    it('returns true', async () => {
      expect(response.data.signOut).toEqual(true);
    });

    it('deletes the session cookie', async () => {
      expect(deleteSessionCookie.expires).toContain('Jan 1970');
    });

    it('deletes the session.sig cookie', async () => {
      expect(deleteSessionSigCookie.expires).toContain('Jan 1970');
    });
  });
});
