from flask import Flask, request, render_template, jsonify
import os
import json
import datetime

app = Flask(__name__)
UPLOAD_FOLDER = "label_data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/submit_labels", methods=["POST"])
def submit_labels():
    labels = request.form.get("labels")
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join("label_data", f"labels_{timestamp}.json")
    with open(filename, "w") as f:
        json.dump({"labels": json.loads(labels)}, f)
    return "Labels saved!"
  if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    
