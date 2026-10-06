import graphene


class DateRange(graphene.ObjectType):
    start = graphene.String(required=True)
    end = graphene.String(required=True)
