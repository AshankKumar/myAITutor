from flask import Flask, request, jsonify, g
from http import HTTPStatus
from dotenv import load_dotenv
import fitz
import boto3
import os
import openai
from .embeddings.main_view import embeddings_bp
from .summary import get_summary, get_summary_string
from .utils import require_api_key, get_mongo_client
from logging.config import dictConfig
import nltk
nltk.download('punkt')

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

BUCKET_NAME = 'chimppdfstore'

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.register_blueprint(embeddings_bp)
    return app

app = create_app()


def get_s3_client():
    s3 = getattr(g, 's3', None)
    if s3 is None:
        s3 = g.s3 = boto3.client('s3', 
        aws_access_key_id=os.getenv('CB_AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('CB_AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('CB_AWS_REGION'))
    return s3
   

def get_open_ai_client():
    openai_g = getattr(g, 'open_ai', None)
    if openai_g is None:
        OPEN_AI_KEY = "''"
        openai.api_key = OPEN_AI_KEY
        openai_g = g.open_ai = openai
    return openai_g


@app.teardown_appcontext
def teardown_mongo_client(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()



@app.route("/")
@require_api_key
def index():
    return "<p>Hello, World!</p>"


@app.route('/summaries/', methods=["POST"])
@require_api_key
def generate_summary():
    print('here')
    data = request.json# .data is empty
    pdfKey = data['pdfKey']
    startPage = int(data['startPage'])
    endPage = int(data['endPage'])

    s3 = get_s3_client()
    response = s3.get_object(Bucket=BUCKET_NAME, Key=pdfKey)
    pdf_bytes = response['Body'].read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    s = get_summary(doc,startPage, endPage)
    print(s)
    db_client = get_mongo_client()
    data_db = db_client["data"]
    summariesCollection = data_db["SummaryDocuments"]
    summaryDict = {}
    summaryDict['startPage'] = startPage
    summaryDict['endPage'] = endPage
    summaryDict['formattedSummary'] = s
    summariesCollection.update_one({"_id": pdfKey}, {"$push": {"summary": summaryDict}})
    result = jsonify(s)
    return result

@app.route('/summaries/websites/', methods=["POST"])
@require_api_key
def generate_summary_websites():
    data = request.json #.data is empty
    key = data['key']
    db_client = get_mongo_client()
    data_db = db_client["data"]
    websites_collection = data_db["SummaryWebsites"]
    website_doc = websites_collection.find_one({'_id': key})
    website_text = website_doc['documents']
    s = get_summary_string(website_text)
    summaryDict = {}
    summaryDict['startPage'] = -1
    summaryDict['endPage'] = -1
    summaryDict['formattedSummary'] = s
    websites_collection.update_one({"_id": key}, {"$push": {"summary": summaryDict}})
    result = jsonify(s)
    return result



if __name__ =="__main__":
    app.run(host='0.0.0.0', debug=True)