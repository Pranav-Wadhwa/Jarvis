import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})  # Allow all origins for development

def get_db_connection():
    """Create and return a database connection"""
    print(os.getenv('DB_HOST'), os.getenv('DB_PORT'), os.getenv('DB_NAME'), os.getenv('DB_USER'), os.getenv('DB_PASSWORD'))
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )
    return conn

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    return jsonify({'received': data, 'status': 'success'})

@app.route('/api/assistants', methods=['GET'])
def get_assistants():
    """Fetch all assistants from the database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT uuid, name, system_prompt, voice_id, enabled_tools FROM assistants ORDER BY name;')
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        assistants = []
        for row in rows:
            assistants.append({
                'uuid': str(row[0]),
                'name': row[1],
                'system_prompt': row[2],
                'voice_id': row[3],
                'enabled_tools': row[4] if row[4] else []
            })
        
        return jsonify({'assistants': assistants})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/assistants', methods=['POST'])
def create_assistant():
    """Create a new assistant"""
    try:
        data = request.get_json()
        name = data.get('name')
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        
        # Generate system prompt with the name
        system_prompt = f"You are a helpful voice assistant named {name}"
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO assistants (name, system_prompt, enabled_tools) VALUES (%s, %s, %s) RETURNING uuid, name, system_prompt, voice_id, enabled_tools;',
            (name, system_prompt, [])
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not row:
            return jsonify({'error': 'Failed to create assistant'}), 500
        
        assistant = {
            'uuid': str(row[0]),
            'name': row[1],
            'system_prompt': row[2],
            'voice_id': row[3],
            'enabled_tools': row[4] if row[4] else []
        }
        
        return jsonify({'assistant': assistant}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
