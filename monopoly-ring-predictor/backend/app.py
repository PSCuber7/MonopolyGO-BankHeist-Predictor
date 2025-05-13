from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_labels():
    data = request.get_json()
    labels = data.get('labels')

    with open('labels.json', 'w') as f:
        json.dump(labels, f)

    return jsonify({"message": "Labels saved successfully!"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
