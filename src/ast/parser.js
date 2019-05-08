import { parser } from 'recast/parsers/babel';
import getBabelOptions from 'recast/parsers/_babel_options';

export function parse(source, options) {
  const babelOptions = getBabelOptions(options);
  babelOptions.plugins.push('typescript', 'jsx');
  return parser.parse(source, babelOptions);
}
