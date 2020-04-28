import classnames from 'classnames';

const base = `inline-block`;
const link = `text-gray-700 rounded hover:underline`;
const spacing = `py-2 px-4`;

const colored = color =>
  classnames(
    base,
    spacing,
    `bg-${color}-500 hover:bg-${color}-700 text-white font-bold rounded outline-none`,
    //
  );

export default {
  dev: classnames(link, 'font-bold text-red-700 outline-none'),
  gray: colored('gray'),
  primary: colored('blue'),
  transparent: classnames(base, spacing, link),
  text: link,
  inverted: {
    text: `text-gray-200 rounded hover:underline`,
  },
};
