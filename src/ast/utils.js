import { builders as b } from 'ast-types';

const LODASH_IMPORT = /^lodash\/([^/]+)$/;

export function isLodashImported(moduleRef) {
  return LODASH_IMPORT.test(moduleRef.expression.value);
}

export function resolveLodashImport(decl) {
  const [, fn] = LODASH_IMPORT.exec(decl.moduleReference.expression.value);
  return b.importSpecifier(b.identifier(fn), decl.id);
}

export function convertLodashImport(decl, existingImportDecl) {
  if (existingImportDecl) {
    existingImportDecl.specifiers.push(resolveLodashImport(decl));
    return null;
  }

  return b.importDeclaration([resolveLodashImport(decl)], b.literal('lodash'));
}

export function convertImportEqualsDeclToCJS(decl) {
  return b.variableDeclaration('const', [
    b.variableDeclarator(
      decl.id,
      b.callExpression(b.identifier('require'), [
        decl.moduleReference.expression,
      ]),
    ),
  ]);
}

export function appendSpecifiers(decl, specifiers) {
  decl.specifiers.push(
    ...[...specifiers].sort(specifier =>
      specifier.type === 'ImportDefaultSpecifier' ? -1 : 1,
    ),
  );
}

export function isNamespaceSpecifier(specifier) {
  return specifier.type === 'ImportNamespaceSpecifier';
}
