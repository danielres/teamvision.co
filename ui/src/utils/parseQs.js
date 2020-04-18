import qs from 'qs';

export default () => qs.parse(window.location.search.split('?')[1]);
