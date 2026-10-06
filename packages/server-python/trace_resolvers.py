import functools
import os
import time

from graphene.types.resolver import get_default_resolver

TRACE_ENABLED = os.environ.get("GRAPHQL_TRACE", "1") != "0"


def format_summary(operation_name, total_ms, calls):
    """Une ligne par résolveur écrit à la main, les plus appelés d'abord ; vide si aucun n'a tourné."""
    if not calls:
        return []
    rows = sorted(calls.items(), key=lambda item: (-item[1]["count"], -item[1]["ms"]))
    total = sum(call["count"] for _, call in rows)
    width = max(len(name) for name, _ in rows)
    lines = [f"[trace] {operation_name} · {total_ms:.1f} ms · {total} résolveur{'s' if total > 1 else ''}"]
    for name, call in rows:
        lines.append(f"  {name.ljust(width)}   ×{str(call['count']).ljust(4)} {call['ms']:.1f} ms")
    return lines


def _is_handwritten(resolver):
    """graphene branche le résolveur par défaut (lecture d'attribut) sur les champs sans resolve_* : on l'ignore."""
    if resolver is None:
        return False
    if isinstance(resolver, functools.partial) and resolver.func is get_default_resolver():
        return False
    return True


class ResolverTracer:
    """Middleware graphene pédagogique : compte les résolveurs écrits à la main appelés pendant une requête.

    graphql-core attend soit une fonction, soit un objet doté d'une méthode `resolve` : on passe l'objet.
    Désactivation : GRAPHQL_TRACE=0.
    """

    def __init__(self):
        self.calls = {}
        self.started = time.perf_counter()

    def resolve(self, next_, root, info, **args):
        field = info.parent_type.fields.get(info.field_name)
        if field is None or info.field_name.startswith("__") or not _is_handwritten(field.resolve):
            return next_(root, info, **args)
        key = f"{info.parent_type.name}.{info.field_name}"
        started = time.perf_counter()
        try:
            return next_(root, info, **args)
        finally:
            entry = self.calls.setdefault(key, {"count": 0, "ms": 0.0})
            entry["count"] += 1
            entry["ms"] += (time.perf_counter() - started) * 1000

    def summary(self, operation_name):
        return format_summary(operation_name or "requête anonyme", (time.perf_counter() - self.started) * 1000, self.calls)
