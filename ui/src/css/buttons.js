const base = `inline-block `;
const link = `text-gray-600 rounded hover:underline `;
const spacing = `py-2 px-4 `;

const colored = color =>
  base +
  spacing +
  `bg-${color}-500 hover:bg-${color}-700 text-white font-bold rounded outline-none`;

export default {
  dev: link + "font-bold text-red-700 outline-none",
  gray: colored("gray"),
  primary: colored("blue"),
  transparent: base + spacing + link,
  text: link
};
