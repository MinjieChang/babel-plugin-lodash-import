'use strict';

module.exports = function (_ref) {
  var t = _ref.types,
      template = _ref.template;

  return {
    pre(state) {
      this.propertyNames = [];
      this.fpPropertyNames = [];
      this.namespaceSpecifier = [];
      this.moduleVals = ['lodash', '_'];
    },
    visitor: {
      ImportDeclaration(path, state, scope) {
        var _this = this;

        var specifiers = path.get("specifiers");
        var source = path.get("source");
        // import lodash from 'lodash'
        if (specifiers && specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0]) && (t.isIdentifier(specifiers[0].node.local, { name: "lodash" }) || t.isIdentifier(specifiers[0].node.local, { name: "_" })) && t.isStringLiteral(source.node, { value: "lodash" })) {
          path.remove();
        }
        // import {isEqual, uniq, map} from 'lodash'
        if (specifiers && specifiers.length >= 1 && t.isImportSpecifier(specifiers[0]) && t.isStringLiteral(source.node, { value: "lodash" })) {
          specifiers.forEach(function (specifier) {
            var name = specifier.node.imported.name;

            if (!_this.propertyNames.includes(name)) {
              _this.propertyNames.push(name);
            }
          });
          path.remove();
        }
        // import { add } from 'lodash/fp'
        if (specifiers && specifiers.length >= 1 && t.isImportSpecifier(specifiers[0]) && t.isStringLiteral(source.node, { value: "lodash/fp" })) {
          specifiers.forEach(function (specifier) {
            var name = specifier.node.imported.name;

            if (!_this.fpPropertyNames.includes(name)) {
              _this.fpPropertyNames.push(name);
            }
          });
          path.remove();
        }
        // import * as lodash from 'lodash'
        if (specifiers && specifiers.length === 1 && t.isImportNamespaceSpecifier(specifiers[0]) && t.isStringLiteral(source.node, { value: "lodash" })) {
          this.namespaceSpecifier.push(specifiers[0].node.local.name);
          path.remove();
        }
      },
      CallExpression(path, state, scope) {
        /**
         * lodash.isEqual(1,2) -> isEqual(1,2)
         */
        if (path.node.callee && path.node.callee.object && (this.moduleVals.includes(path.node.callee.object.name) || this.namespaceSpecifier.includes(path.node.callee.object.name))) {
          var propertyName = path.get("callee.property").node.name;
          if (!this.propertyNames.includes(propertyName)) {
            this.propertyNames.push(propertyName);
          }
          path.get("callee").replaceWith(t.identifier(`_${propertyName}`));
        }
        /**
         * import { forEach } from 'lodash'
         * forEach()
         * ------->
         * import _forEach from 'lodash/forEach'
         * _forEach()
         */
        if (path.node.callee && path.node.callee.name && (this.propertyNames.includes(path.node.callee.name) || this.fpPropertyNames.includes(path.node.callee.name))) {
          var calleeName = path.node.callee.name;
          path.get("callee").replaceWith(t.identifier(`_${calleeName}`));
        }
      }
    },
    post(state) {
      this.propertyNames.forEach(function (name) {
        insertImportDeclaration(state.path, buildImportDeclaration(t, `_${name}`, `lodash/${name}`));
      });
      this.fpPropertyNames.forEach(function (name) {
        insertImportDeclaration(state.path, buildImportDeclaration(t, `_${name}`, `lodash/fp/${name}`));
      });
    }
  };
};

function buildImportDeclaration(t, name, source) {
  return t.importDeclaration([t.importDefaultSpecifier(t.identifier(name))], t.stringLiteral(`${source}`));
}

function insertImportDeclaration(path, importDeclaration) {
  var program = path.find(function (parent) {
    return parent.parentKey === 'program';
  });
  program.node.body.unshift(importDeclaration);
}