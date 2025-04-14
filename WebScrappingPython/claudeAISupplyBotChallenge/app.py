from flask import Flask, render_template, request, jsonify
from config import OPENAI_API_KEY
import openai

app = Flask(__name__)

# Configure OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/categorize', methods=['POST'])
def categorize_material():
    raw_material = request.form.get('raw_material')
    
    if not raw_material:
        return jsonify({'error': 'No raw material provided'}), 400
    
    # For now, we'll just return the raw material to confirm the form is working
    return jsonify({'raw_material': raw_material, 'message': 'Form submission successful'})

if __name__ == '__main__':
    app.run(debug=True)