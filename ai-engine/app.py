from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib
import json
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Models dictionary
models = {}

# Load or create models
def load_models():
    """Load pre-trained models or create new ones"""
    try:
        models['mental_health'] = joblib.load('models/mental_health_model.pkl')
        models['performance'] = joblib.load('models/performance_model.pkl')
        models['dropout_risk'] = joblib.load('models/dropout_risk_model.pkl')
    except FileNotFoundError:
        print("Models not found. They will be trained on first prediction.")
        models['mental_health'] = None
        models['performance'] = None
        models['dropout_risk'] = None

load_models()

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'AI Engine'})

@app.route('/api/predict/mental-health', methods=['POST'])
def predict_mental_health():
    """
    Predict mental health status based on assessment answers
    Expected: { 'answers': [...], 'student_id': '...' }
    """
    try:
        data = request.json
        answers = np.array(data.get('answers', [])).reshape(1, -1)
        
        if models['mental_health'] is None:
            return jsonify({
                'score': np.mean(answers) * 10,
                'risk_level': 'unknown',
                'message': 'Model not trained yet'
            })
        
        score = models['mental_health'].predict(answers)[0]
        risk_level = get_risk_level(score)
        
        return jsonify({
            'score': float(score),
            'risk_level': risk_level,
            'timestamp': datetime.now().isoformat(),
            'recommendations': get_mental_health_recommendations(risk_level)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/predict/performance', methods=['POST'])
def predict_performance():
    """
    Predict student performance based on marks and attendance
    """
    try:
        data = request.json
        features = np.array([
            data.get('marks', 0),
            data.get('attendance', 0),
            data.get('assignments_completed', 0),
            data.get('study_hours', 0)
        ]).reshape(1, -1)
        
        if models['performance'] is None:
            return jsonify({'message': 'Performance model not trained yet'})
        
        prediction = models['performance'].predict(features)[0]
        
        return jsonify({
            'predicted_performance': float(prediction),
            'status': 'excellent' if prediction > 80 else 'good' if prediction > 60 else 'fair' if prediction > 40 else 'poor',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/predict/dropout-risk', methods=['POST'])
def predict_dropout_risk():
    """
    Predict dropout risk based on student metrics
    """
    try:
        data = request.json
        features = np.array([
            data.get('attendance', 0),
            data.get('marks', 0),
            data.get('mental_health_score', 50),
            data.get('engagement_score', 0),
            data.get('missed_deadlines', 0)
        ]).reshape(1, -1)
        
        if models['dropout_risk'] is None:
            risk_score = np.mean(features) * 2
        else:
            risk_score = models['dropout_risk'].predict_proba(features)[0][1]
        
        risk_level = 'high' if risk_score > 0.7 else 'medium' if risk_score > 0.4 else 'low'
        
        return jsonify({
            'risk_score': float(risk_score),
            'risk_level': risk_level,
            'early_warning': risk_level != 'low',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/recommend/career-path', methods=['POST'])
def recommend_career_path():
    """
    Recommend career paths based on skills and interests
    """
    try:
        data = request.json
        skills = data.get('skills', [])
        interests = data.get('interests', [])
        
        # Career path mapping (can be extended with ML)
        career_paths = {
            'Software Development': {
                'match_score': calculate_match(skills, ['programming', 'problem-solving']),
                'resources': [
                    {'title': 'Python for Everyone', 'type': 'course', 'platform': 'Coursera'},
                    {'title': 'The Complete JavaScript Course', 'type': 'course', 'platform': 'Udemy'}
                ]
            },
            'Data Science': {
                'match_score': calculate_match(skills, ['mathematics', 'statistics', 'programming']),
                'resources': [
                    {'title': 'Statistics for Data Analysis', 'type': 'course', 'platform': 'Coursera'},
                    {'title': 'Machine Learning A-Z', 'type': 'course', 'platform': 'Udemy'}
                ]
            },
            'Web Development': {
                'match_score': calculate_match(skills, ['HTML', 'CSS', 'JavaScript', 'design']),
                'resources': [
                    {'title': 'Complete Web Development Bootcamp', 'type': 'course', 'platform': 'Udemy'},
                    {'title': 'React - The Complete Guide', 'type': 'course', 'platform': 'Udemy'}
                ]
            }
        }
        
        # Sort by match score
        recommendations = sorted(
            career_paths.items(),
            key=lambda x: x[1]['match_score'],
            reverse=True
        )
        
        return jsonify({
            'recommendations': [
                {'path': name, **details} for name, details in recommendations
            ],
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/recommend/skills', methods=['POST'])
def recommend_skills():
    """
    Recommend skills based on current level and career path
    """
    try:
        data = request.json
        current_skills = data.get('current_skills', [])
        career_goal = data.get('career_goal', '')
        
        # Skill recommendations mapping
        skill_library = {
            'Software Development': ['Python', 'Java', 'Git', 'SQL', 'API Development', 'Testing'],
            'Data Science': ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics'],
            'Web Development': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB']
        }
        
        recommended_skills = [
            skill for skill in skill_library.get(career_goal, [])
            if skill not in current_skills
        ]
        
        return jsonify({
            'recommended_skills': recommended_skills[:5],
            'current_skills': current_skills,
            'gap_analysis': len(recommended_skills),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Helper functions
def get_risk_level(score):
    """Determine risk level from score"""
    if score < 20:
        return 'critical'
    elif score < 40:
        return 'high'
    elif score < 60:
        return 'medium'
    else:
        return 'low'

def get_mental_health_recommendations(risk_level):
    """Get recommendations based on risk level"""
    recommendations = {
        'critical': ['Schedule immediate appointment with counselor', 'Contact emergency support'],
        'high': ['Request counselor appointment', 'Engage in stress-relief activities'],
        'medium': ['Consider speaking with counselor', 'Practice mindfulness and self-care'],
        'low': ['Maintain current wellness practices', 'Regular check-ups recommended']
    }
    return recommendations.get(risk_level, [])

def calculate_match(user_skills, required_skills):
    """Calculate skill match score"""
    if not required_skills:
        return 0
    matched = sum(1 for skill in required_skills if skill in user_skills)
    return (matched / len(required_skills)) * 100

if __name__ == '__main__':
    app.run(debug=True, port=5001)
