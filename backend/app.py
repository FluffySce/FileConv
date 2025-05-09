from flask import Flask, request, send_file
from flask_cors import CORS
import os
from docx2pdf import convert

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/convert", methods=["POST"])
def convert_file():
    file = request.files["file"]
    if not file.filename.endswith(".docx"):
        return {"error": "Only .docx files allowed"}, 400
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    output_path = filepath.replace(".docx",".pdf")
    convert(filepath,output_path)
    return send_file(output_path, as_attachment=True)
if __name__ == "__main__":
    app.run(debug=True)
    