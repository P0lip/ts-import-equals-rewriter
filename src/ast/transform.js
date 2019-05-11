import * as recast from 'recast';
import {
  appendSpecifiers,
  convertImportEqualsDeclToCJS,
  convertImportEqualsToType,
  convertLodashImport,
  isLodashImported,
  isNamespaceSpecifier,
} from './utils';
import * as parser from './parser';

export default source => {
  const ast = recast.parse(source, { parser });
  const {
    program: { body },
  } = ast;

  let existingLodashImportDecl = null;

  for (const [i, node] of body.entries()) {
    switch (node.type) {
      case 'TSImportEqualsDeclaration':
        switch (node.moduleReference.type) {
          case 'TSExternalModuleReference':
            if (isLodashImported(node.moduleReference)) {
              body[i] = convertLodashImport(node, existingLodashImportDecl);
              if (!existingLodashImportDecl) {
                existingLodashImportDecl = body[i];
              }
            } else {
              body[i] = convertImportEqualsDeclToCJS(node);
            }
            break;
          case 'TSQualifiedName':
            body[i] = convertImportEqualsToType(node);
            break;
          default:
        }
        break;
      case 'ImportDeclaration':
        if (
          node.source.value === 'lodash' &&
          !node.specifiers.some(isNamespaceSpecifier)
        ) {
          if (existingLodashImportDecl) {
            body[i] = null;
            appendSpecifiers(existingLodashImportDecl, node.specifiers);
          } else {
            existingLodashImportDecl = node;
          }
        }
        break;
      default:
    }
  }

  return recast.print(ast, { quote: 'single' }).code;
};
