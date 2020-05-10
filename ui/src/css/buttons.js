import classnames from 'classnames';

const inlineBlock = `inline-block`;
const whitespace = `py-2 px-4`;
const hoverText = `text-gray-700 rounded hover:underline`;
const base = `text-white font-bold rounded outline-none`;

export default {
  // dev: classnames(link, 'font-bold text-red-700 outline-none'),
  gray: classnames(inlineBlock, whitespace, base, 'bg-gray-500', 'hover:bg-gray-700'),
  primary: classnames(inlineBlock, whitespace, base, 'bg-blue-500', 'hover:bg-blue-700'),
  transparent: classnames(inlineBlock, whitespace, hoverText),
  text: hoverText,
  inverted: {
    text: `text-gray-200 rounded hover:underline`,
  },
};
