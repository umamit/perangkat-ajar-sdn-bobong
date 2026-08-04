import os
import requests as req
from flask import Flask, jsonify, request, render_template, make_response
from dotenv import load_dotenv

# Load env variables from root folder
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, '.env'))

app = Flask(
    __name__,
    template_folder=os.path.join(parent_dir, 'templates'),
    static_folder=os.path.join(parent_dir, 'static'),
    static_url_path='/static'
)

ALLOWED_ORIGINS = [
    'https://ajar.sdnegeribobong.sch.id',
    'http://127.0.0.1:5000',
    'http://localhost:5000'
]

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin', '')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return make_response('', 204)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "https://evslcvjucmnyxkqwfdye.supabase.co")
HARDCODED_SERVICE_ROLE_KEY = "[REDACTED_KEY]"
SUPABASE_KEY = os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY") or HARDCODED_SERVICE_ROLE_KEY

def db_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def db_url(table, query=""):
    return f"{SUPABASE_URL}/rest/v1/{table}{query}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/sync', methods=['GET'])
def sync_data():
    try:
        def fetch(table, select):
            r = req.get(db_url(table, f"?select={select}"), headers=db_headers())
            return r.json() if r.ok else []

        classes    = fetch('classes',   'id,name,room,phase')
        students   = fetch('students',  'id,nis,name,class_id,gender')
        journals   = fetch('journals',  'id,date,time_slot,class_id,topic,notes,attendance_summary')
        attendance = fetch('attendance','*')
        grades     = fetch('grades',    '*')
        modules    = fetch('modules',   '*')
        teachers   = fetch('teachers',  'id,nip,name,role,subject,password,avatar_url,is_active')

        return jsonify({'success': True, 'classes': classes, 'students': students,
                        'journals': journals, 'attendance': attendance, 'grades': grades,
                        'modules': modules, 'teachers': teachers})
    except Exception as e:
        print('[Sync Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/students', methods=['POST'])
def save_student():
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        import uuid
        db_id = data.get('uuid') or data.get('id') or str(uuid.uuid4())
        payload = {'id': db_id, 'nis': db_id, 'name': data.get('name'),
                   'class_id': data.get('classId'), 'gender': data.get('gender', 'L')}
        r = req.post(db_url('students', '?on_conflict=id'),
                     headers={**db_headers(), 'Prefer': 'resolution=merge-duplicates,return=representation'},
                     json=payload)
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True, 'data': r.json()})
    except Exception as e:
        print('[Save Student Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/students/batch', methods=['POST'])
def save_students_batch():
    try:
        students = request.json
        if not students:
            return jsonify({'success': False, 'error': 'No data'}), 400
        import uuid
        payload = []
        for s in students:
            db_id = s.get('uuid') or s.get('id') or str(uuid.uuid4())
            payload.append({'id': db_id, 'nis': db_id, 'name': s.get('name'),
                            'class_id': s.get('classId'), 'gender': s.get('gender', 'L')})
        r = req.post(db_url('students', '?on_conflict=id'),
                     headers={**db_headers(), 'Prefer': 'resolution=merge-duplicates,return=representation'},
                     json=payload)
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True, 'data': r.json()})
    except Exception as e:
        print('[Batch Save Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/students', methods=['DELETE'])
def delete_student():
    try:
        student_id = request.args.get('id')
        if not student_id:
            return jsonify({'success': False, 'error': 'Student ID required'}), 400
        r = req.delete(db_url('students', f'?id=eq.{student_id}'), headers=db_headers())
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True})
    except Exception as e:
        print('[Delete Student Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/grades', methods=['POST'])
def update_grade():
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        student_id = data.get('studentId')
        grade_type = data.get('type')
        payload = {'student_id': student_id, 'class_id': data.get('classId'),
                   'type': grade_type, 'score': data.get('score'), 'topic': data.get('topic', '')}
        # Try upsert on student_id + type (if unique constraint exists), else insert
        r = req.post(db_url('grades', '?on_conflict=student_id,type'),
                     headers={**db_headers(), 'Prefer': 'resolution=merge-duplicates,return=representation'},
                     json=payload)
        if not r.ok:
            # Fallback: try plain insert
            r = req.post(db_url('grades'), headers=db_headers(), json=payload)
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True, 'data': r.json()})
    except Exception as e:
        print('[Update Grade Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    try:
        r = req.get(db_url('attendance', '?select=date,class_id,status&order=date.desc'), headers=db_headers())
        return jsonify({'success': True, 'data': r.json() if r.ok else []})
    except Exception as e:
        print('[Get Attendance Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/attendance', methods=['POST'])
def save_attendance():
    try:
        data = request.json
        if not data or not isinstance(data, list):
            return jsonify({'success': False, 'error': 'Invalid attendance data'}), 400
        r = req.post(db_url('attendance', '?on_conflict=student_id,date'),
                     headers={**db_headers(), 'Prefer': 'resolution=merge-duplicates,return=representation'},
                     json=data)
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True, 'data': r.json()})
    except Exception as e:
        print('[Save Attendance Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/attendance', methods=['DELETE'])
def delete_attendance():
    try:
        date = request.args.get('date')
        class_id = request.args.get('class_id')
        if not date or not class_id:
            return jsonify({'success': False, 'error': 'date and class_id required'}), 400
        r = req.delete(db_url('attendance', f'?date=eq.{date}&class_id=eq.{class_id}'), headers=db_headers())
        return jsonify({'success': True})
    except Exception as e:
        print('[Delete Attendance Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/journals', methods=['POST'])
def save_journal():
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        payload = {'date': data.get('date'), 'time_slot': data.get('time', ''),
                   'class_id': data.get('classId'), 'topic': data.get('topic'),
                   'notes': data.get('notes', ''), 'attendance_summary': data.get('attendance', '')}
        r = req.post(db_url('journals'), headers=db_headers(), json=payload)
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True, 'data': r.json()})
    except Exception as e:
        print('[Save Journal Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/journals', methods=['DELETE'])
def delete_journal():
    try:
        journal_id = request.args.get('id')
        if not journal_id:
            return jsonify({'success': False, 'error': 'Journal ID required'}), 400
        r = req.delete(db_url('journals', f'?id=eq.{journal_id}'), headers=db_headers())
        return jsonify({'success': True})
    except Exception as e:
        print('[Delete Journal Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/teachers', methods=['POST'])
def save_teacher():
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        payload = {'nip': data.get('nip'), 'name': data.get('name'),
                   'role': data.get('role', 'Guru Mata Pelajaran'),
                   'subject': data.get('subject', 'Bahasa Inggris'),
                   'password': data.get('password', 'sdnbobong'),
                   'avatar_url': data.get('avatar', 'assets/logo-sdn-bobong.png')}
        r = req.post(db_url('teachers', '?on_conflict=nip'),
                     headers={**db_headers(), 'Prefer': 'resolution=merge-duplicates,return=representation'},
                     json=payload)
        if not r.ok:
            return jsonify({'success': False, 'error': r.text}), 500
        return jsonify({'success': True, 'data': r.json()})
    except Exception as e:
        print('[Save Teacher Error]', str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
