import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector

# Initialize app with static folder settings
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Database Configuration
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', '664262'),
    'database': os.environ.get('DB_NAME', 'agrilink'),
    'port': int(os.environ.get('DB_PORT', 3306))
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# Serve Frontend HTML
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Health Check Route
@app.route('/health')
def health():
    return jsonify({"message": "AgriLink AI Backend is running!"})

# API: Fetch Market Prices
@app.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    crop = request.args.get('crop', 'Tomato')
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT market, price_per_kg, arrival_quantity FROM market_prices WHERE crop = %s ORDER BY price_per_kg DESC"
        cursor.execute(query, (crop,))
        prices = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return jsonify(prices)
    except Exception as e:
        # Fallback dummy data if MySQL database is unreachable in cloud hosting
        return jsonify([
            {"market": "Kothapet Market", "price_per_kg": 42, "arrival_quantity": 12000},
            {"market": "Bowenpally Market", "price_per_kg": 38, "arrival_quantity": 18000},
            {"market": "Gudur Market", "price_per_kg": 35, "arrival_quantity": 8500}
        ])

# API: Fetch Verified Buyers
@app.route('/api/buyers', methods=['GET'])
def get_buyers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT buyer_name, location, reliability_score, payment_rating, cancellation_rate FROM buyers WHERE verified = TRUE ORDER BY reliability_score DESC"
        cursor.execute(query)
        buyers = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return jsonify(buyers)
    except Exception as e:
        # Fallback dummy data if MySQL database is unreachable in cloud hosting
        return jsonify([
            {"buyer_name": "ABC Foods Ltd", "location": "Hyderabad", "reliability_score": 96, "payment_rating": 4.8},
            {"buyer_name": "FreshMart Processing", "location": "Vijayawada", "reliability_score": 91, "payment_rating": 4.5},
            {"buyer_name": "XYZ Agro Procurement", "location": "Ongole", "reliability_score": 87, "payment_rating": 4.2}
        ])

if __name__ == "__main__":
    app.run()