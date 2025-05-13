from flask import Flask, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_labels():
    data = request.get_json()
    labels = data.get('labels')

    if not os.path.exists('label_data'):
        os.makedirs('label_data')

    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    filename = f'label_data/labels_{timestamp}.json'

    with open(filename, 'w') as f:
        json.dump(labels, f)

    return jsonify({"message": f"Saved as {filename}"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
