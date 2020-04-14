export default encoded => JSON.parse(atob(encoded.split('.')[0]));
