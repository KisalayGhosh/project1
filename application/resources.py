from flask_restful import Resource, Api, reqparse, marshal_with, fields
from .models import Ebook, db, Section, Request, Feedback, IssuedEbook
from datetime import datetime

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

###########################################################
###################################### for section  ##########################
###############################################

section_parser = reqparse.RequestParser()
section_parser.add_argument('section_name', type=str, help='Name of the section', required=True)
section_parser.add_argument('description', type=str, help='Description of the section')

section_fields = {
    'id': fields.Integer,
    'section_name': fields.String,
    'description': fields.String,
    'created_at': fields.DateTime(dt_format='iso8601'),
    'updated_at': fields.DateTime(dt_format='iso8601')
}

class SectionResource(Resource):
    @marshal_with(section_fields)
    def get(self, section_id):
        section = Section.query.get_or_404(section_id)
        return section

    @marshal_with(section_fields)
    def post(self):
        args = section_parser.parse_args()
        section = Section(**args)
        db.session.add(section)
        db.session.commit()
        return section, 201

    @marshal_with(section_fields)
    def put(self, section_id):
        section = Section.query.get_or_404(section_id)
        args = section_parser.parse_args()
        section.section_name = args['section_name']
        section.description = args.get('description', section.description)
        section.updated_at = datetime.utcnow()
        db.session.commit()
        return section

    def delete(self, section_id):
        section = Section.query.get_or_404(section_id)
        db.session.delete(section)
        db.session.commit()
        return '', 204


api.add_resource(SectionResource, '/api/sections/<int:section_id>', '/api/sections')

#########################################################################################
###############################################for request#########################################
########################################################################################

request_parser = reqparse.RequestParser()
request_parser.add_argument('user_id', type=int, help='ID of the user', required=True)
request_parser.add_argument('ebook_id', type=int, help='ID of the ebook', required=True)
request_parser.add_argument('status', type=str, help='Status of the request')

request_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'ebook_id': fields.Integer,
    'request_date': fields.DateTime(dt_format='iso8601'),
    'status': fields.String,
    'created_at': fields.DateTime(dt_format='iso8601'),
    'updated_at': fields.DateTime(dt_format='iso8601')
}

class RequestResource(Resource):
    @marshal_with(request_fields)
    def get(self, request_id):
        request_obj = Request.query.get_or_404(request_id)
        return request_obj

    @marshal_with(request_fields)
    def post(self):
        args = request_parser.parse_args()
        request_obj = Request(**args)
        db.session.add(request_obj)
        db.session.commit()
        return request_obj, 201

    @marshal_with(request_fields)
    def put(self, request_id):
        request_obj = Request.query.get_or_404(request_id)
        args = request_parser.parse_args()
        request_obj.user_id = args['user_id']
        request_obj.ebook_id = args['ebook_id']
        request_obj.status = args.get('status', request_obj.status)
        request_obj.updated_at = datetime.utcnow()
        db.session.commit()
        return request_obj

    def delete(self, request_id):
        request_obj = Request.query.get_or_404(request_id)
        db.session.delete(request_obj)
        db.session.commit()
        return '', 204


api.add_resource(RequestResource, '/api/requests/<int:request_id>', '/api/requests')


###########################################################################################
###################################################for feedback########################################
##########################################################################################


feedback_parser = reqparse.RequestParser()
feedback_parser.add_argument('user_id', type=int, help='ID of the user', required=True)
feedback_parser.add_argument('ebook_id', type=int, help='ID of the ebook', required=True)
feedback_parser.add_argument('rating', type=int, help='Rating of the ebook', required=True)
feedback_parser.add_argument('comment', type=str, help='Comment for the feedback')

feedback_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'ebook_id': fields.Integer,
    'rating': fields.Integer,
    'comment': fields.String,
    'created_at': fields.DateTime(dt_format='iso8601')
}

class FeedbackResource(Resource):
    @marshal_with(feedback_fields)
    def get(self, feedback_id):
        feedback = Feedback.query.get_or_404(feedback_id)
        return feedback

    @marshal_with(feedback_fields)
    def post(self):
        args = feedback_parser.parse_args()
        feedback = Feedback(**args)
        db.session.add(feedback)
        db.session.commit()
        return feedback, 201

    @marshal_with(feedback_fields)
    def put(self, feedback_id):
        feedback = Feedback.query.get_or_404(feedback_id)
        args = feedback_parser.parse_args()
        feedback.user_id = args['user_id']
        feedback.ebook_id = args['ebook_id']
        feedback.rating = args['rating']
        feedback.comment = args.get('comment', feedback.comment)
        db.session.commit()
        return feedback

    def delete(self, feedback_id):
        feedback = Feedback.query.get_or_404(feedback_id)
        db.session.delete(feedback)
        db.session.commit()
        return '', 204


api.add_resource(FeedbackResource, '/api/feedback/<int:feedback_id>', '/api/feedback')


##########################################################################
#########################################################################
##################################### for issued e book####################################
######################################################################

issued_ebook_parser = reqparse.RequestParser()
issued_ebook_parser.add_argument('user_id', type=int, help='ID of the user', required=True)
issued_ebook_parser.add_argument('ebook_id', type=int, help='ID of the ebook', required=True)
issued_ebook_parser.add_argument('return_date', type=str, help='Return date of the ebook')

issued_ebook_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'ebook_id': fields.Integer,
    'issue_date': fields.DateTime(dt_format='iso8601'),
    'return_date': fields.DateTime(dt_format='iso8601'),
    'status': fields.String,
    'created_at': fields.DateTime(dt_format='iso8601'),
    'updated_at': fields.DateTime(dt_format='iso8601')
}

class IssuedEbookResource(Resource):
    @marshal_with(issued_ebook_fields)
    def get(self, issued_ebook_id):
        issued_ebook = IssuedEbook.query.get_or_404(issued_ebook_id)
        return issued_ebook

    @marshal_with(issued_ebook_fields)
    def post(self):
        args = issued_ebook_parser.parse_args()
        issued_ebook = IssuedEbook(**args)
        db.session.add(issued_ebook)
        db.session.commit()
        return issued_ebook, 201

    @marshal_with(issued_ebook_fields)
    def put(self, issued_ebook_id):
        issued_ebook = IssuedEbook.query.get_or_404(issued_ebook_id)
        args = issued_ebook_parser.parse_args()
        issued_ebook.user_id = args['user_id']
        issued_ebook.ebook_id = args['ebook_id']
        issued_ebook.return_date = args.get('return_date', issued_ebook.return_date)
        issued_ebook.updated_at = datetime.utcnow()
        db.session.commit()
        return issued_ebook

    def delete(self, issued_ebook_id):
        issued_ebook = IssuedEbook.query.get_or_404(issued_ebook_id)
        db.session.delete(issued_ebook)
        db.session.commit()
        return '', 204

api.add_resource(IssuedEbookResource, '/api/issued_ebooks/<int:issued_ebook_id>', '/api/issued_ebooks')