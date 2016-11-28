import HTMLtoJSX from 'htmltojsx';

export default function htmlToJsx(html, indent = '') {
  const jsxConverter = new HTMLtoJSX({ createClass: false });

  let jsx = jsxConverter.convert(html);

  if (jsxConverter.level === 1) {
    // Remove the wrapping tags HTMLtoJSX adds, as we use our own!
    jsx = jsx.replace(/(?:^<div>\n\s+|\n\s+<\/div>\n+$)/g, '');
  }

  return jsx
    .replace(/\n\s{8}/g, `\n${indent}`) // Indent for pretty inspector output 🎉
    .replace(/\n\s*$/g, '');            // Remove the trailing blank line
}
