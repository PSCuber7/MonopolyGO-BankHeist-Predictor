from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_labels():
    data = request.get_json()
    labels = data.get('labels')
    
    with open('labels.json', 'w') as f:
        json.dump(labels, f)
    
    return jsonify({"message": "Labels saved successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
