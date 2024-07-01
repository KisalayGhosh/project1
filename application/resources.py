from flask_restful import Resource, Api, reqparse, marshal_with, fields
from .models import Ebook, db

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('title', type=str, help='decription cannot be converted to string ',required=True)
parser.add_argument('content', type=str, help='Description cannot be converted to string ', required=True)
parser.add_argument('author', type=str, help='resource_link cannot be converted to string ', required=True)

ebook_fields = {
    'ebook_id':fields.Integer,
    'title': fields.String,
    'content': fields.String,
    'author': fields.String
}


class EbookMaterial(Resource):
    @marshal_with(ebook_fields)
    def get(self):
        ebook_material=Ebook.query.all()
        return ebook_material
    
    def post(self):
        args = parser.parse_args()
        ebook_resource=Ebook(**args)
        db.session.add(ebook_resource)
        db.session.commit()
        return {"message":"data uploaded"}

api.add_resource(EbookMaterial, '/ebookinfo')