import { defaultFieldResolver } from 'graphql';
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

/**
 * Applique @auth : enveloppe le résolveur de chaque champ annoté (ou de chaque champ
 * d'un type annoté) pour vérifier l'utilisateur du contexte avant d'appeler le résolveur réel.
 */
export function authDirectiveTransformer(schema, directiveName = 'auth') {
  const typeLevelArgs = new Map();

  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (type) => {
      const directive = getDirective(schema, type, directiveName)?.[0];
      if (directive) typeLevelArgs.set(type.name, directive);
      return undefined; // type inchangé
    },

    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeLevelArgs.get(typeName);
      if (!directive) return fieldConfig;

      const { resolve = defaultFieldResolver } = fieldConfig;
      const requiredRole = directive.requires ?? null;

      fieldConfig.resolve = (source, args, context, info) => {
        if (!context.user) throw new AuthenticationError('Authentification requise');
        if (requiredRole && context.user.role !== requiredRole && context.user.role !== 'ADMIN') {
          throw new ForbiddenError(`Rôle ${requiredRole} requis`);
        }
        return resolve(source, args, context, info);
      };
      return fieldConfig;
    }
  });
}
