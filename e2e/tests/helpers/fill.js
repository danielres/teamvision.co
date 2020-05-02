/* global page */

export default async (selector, content) => {
  await page.focus(selector);
  await page.keyboard.type(content);
};
