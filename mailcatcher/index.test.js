const { Mailcatcher } = require('.');
const sendTestEmail = require('./test/support/sendTestEmail');

const recipient1 = 'john@example.com';
const recipient2 = 'anne@example.com';

const html1 = '<p>Hi!</p>';
const html2 = '<p>Hoy</p>';

const mailcatcher = Mailcatcher();

describe('mailcatcher', () => {
  describe('.read()', () => {
    it('returns caught emails', async () => {
      await mailcatcher.listen();
      await sendTestEmail({ message: { to: recipient1, html: html1 } });
      await sendTestEmail({ message: { to: recipient2, html: html2 } });

      expect(mailcatcher.read().map(e => e.html)).toEqual([html1, html2]);

      await mailcatcher.close();
    });
  });

  describe('.empty()', () => {
    it('deletes caught emails, returns deteted emails', async () => {
      await mailcatcher.listen();
      await sendTestEmail({ message: { to: recipient1, html: html1 } });
      await sendTestEmail({ message: { to: recipient2, html: html2 } });

      expect(mailcatcher.empty().map(e => e.html)).toEqual([html1, html2]);
      expect(mailcatcher.read()).toEqual([]);
      await mailcatcher.close();
    });
  });

  describe('.close()', () => {
    it('deletes caught emails, returns deteted emails, terminates mailcatcher ', async () => {
      await mailcatcher.listen();

      await sendTestEmail({ message: { to: recipient1, html: html1 } });
      await sendTestEmail({ message: { to: recipient2, html: html2 } });

      const caught = await mailcatcher.close();

      expect(caught.length).toEqual(2);

      expect(caught[0].to.value[0].address).toEqual(recipient1);
      expect(caught[0].html).toEqual(html1);

      expect(caught[1].to.value[0].address).toEqual(recipient2);
      expect(caught[1].html).toEqual(html2);

      expect(mailcatcher.read()).toEqual([]);
    });
  });
});
