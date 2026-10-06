from flask import Flask
from flask_graphql import GraphQLView
from gql import schema


def create_app():
    app = Flask(__name__)
    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True),
    )
    return app
