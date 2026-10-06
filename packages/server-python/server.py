import logging

from flask import Flask, jsonify, request
from flask_cors import CORS
from graphql import GraphQLError

from gql import schema

log = logging.getLogger("graphql")

# Codes d'erreur métier renvoyés tels quels au client. Tout le reste est masqué.
KNOWN_CODES = {"UNAUTHENTICATED", "FORBIDDEN", "NOT_FOUND", "BAD_USER_INPUT"}


def build_context(req):
    """Contexte passé à chaque résolveur (enrichi de l'utilisateur au palier JWT)."""
    return {"request": req}


def format_error(error: GraphQLError) -> dict:
    """Erreurs attendues renvoyées telles quelles, erreurs inattendues masquées.

    Cf. slide « Menaces et protections » : ne jamais exposer une stack trace.
    """
    original = error.original_error
    code = (error.extensions or {}).get("code")
    graphql_level = original is None or isinstance(original, GraphQLError)
    if graphql_level or code in KNOWN_CODES:
        return error.formatted
    log.error("Erreur inattendue dans un résolveur", exc_info=original)
    return {
        "message": "Internal server error",
        "path": error.path,
        "extensions": {"code": "INTERNAL_SERVER_ERROR"},
    }


def create_app():
    app = Flask(__name__)
    # Autorise le client React (port 3000). En production, restreindre l'origine.
    CORS(app)

    @app.get("/graphql")
    def graphql_info():
        return jsonify({
            "message": "Endpoint GraphQL : envoyez un POST JSON {query, variables, operationName}.",
            "sandbox": "Ouvrez https://studio.apollographql.com/sandbox et pointez-le sur cette URL.",
        })

    @app.post("/graphql")
    def graphql_endpoint():
        payload = request.get_json(silent=True) or {}
        query = payload.get("query")
        if not query:
            return jsonify({"errors": [{"message": "Le champ 'query' est requis"}]}), 400
        result = schema.execute(
            query,
            variable_values=payload.get("variables"),
            operation_name=payload.get("operationName"),
            context_value=build_context(request),
        )
        body = {}
        if result.errors:
            body["errors"] = [format_error(e) for e in result.errors]
        if result.data is not None or not result.errors:
            body["data"] = result.data
        return jsonify(body)

    return app
