import { formatSummary } from './summary.js';

const now = () => Number(process.hrtime.bigint()) / 1e6;

/**
 * Plugin Apollo pédagogique : compte, pour chaque requête, les appels aux résolveurs que vous avez
 * écrits (la carte `resolvers`), et affiche une synthèse dans le terminal. Les champs servis par le
 * résolveur par défaut et l'introspection ne sont pas comptés. Désactivation : GRAPHQL_TRACE=0.
 */
export function tracePlugin({ resolvers, log = console.log }) {
  const handwritten = new Set(
    Object.entries(resolvers).flatMap(([typeName, fields]) =>
      Object.keys(fields).filter((name) => !name.startsWith('__')).map((name) => `${typeName}.${name}`)
    )
  );

  return {
    async requestDidStart() {
      const calls = new Map();
      const started = now();
      let operationName = 'requête anonyme';

      return {
        async didResolveOperation({ operationName: name }) {
          operationName = name ?? 'requête anonyme';
        },

        async executionDidStart() {
          return {
            willResolveField({ info }) {
              const key = `${info.parentType.name}.${info.fieldName}`;
              if (!handwritten.has(key)) return undefined;
              const fieldStarted = now();
              return () => {
                const entry = calls.get(key) ?? { count: 0, ms: 0 };
                entry.count += 1;
                entry.ms += now() - fieldStarted;
                calls.set(key, entry);
              };
            }
          };
        },

        async willSendResponse() {
          for (const line of formatSummary({ operationName, totalMs: now() - started, calls })) log(line);
        }
      };
    }
  };
}
