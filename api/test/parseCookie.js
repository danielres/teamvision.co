export default str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      const key = decodeURIComponent(k.trim());
      const val = v ? decodeURIComponent(v) : undefined;
      return { ...acc, [key]: val };
    }, {});
