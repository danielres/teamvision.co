export default (selector, attr) =>
  page
    .$(selector)
    .then(e => e.getProperty(attr))
    .then(p => p.jsonValue());
