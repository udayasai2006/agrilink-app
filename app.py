import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

def get_db_connection():
    # Retrieve port with safety fallback
    port_env = os.environ.get('DB_PORT', '23619')
    port = int(port_env) if port_env and port_env.isdigit() else 23619

    return mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD', ''),
        database=os.environ.get('DB_NAME', 'defaultdb'),
        port=port,
        ssl_disabled=False  # Required for Aiven MySQL SSL enforcement
    )

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "message": "AgriLink AI Backend is running!"})

# Feature 0: Shared Transport
@app.route('/api/shared-transport', methods=['POST'])
def shared_transport():
    data = request.json or {}
    crop = data.get('crop', 'Crop')
    qty = float(data.get('quantity', 1000) or 1000)
    village = data.get('pickup_village', 'Nearby Village')
    
    total_cost = round((qty / 1000) * 1200 + 1500)
    shared_cost = round(total_cost * 0.45)
    savings = total_cost - shared_cost

    return jsonify({
        "data": [
            {"label": "Nearby farmers", "value": f"3 farmers near {village}"},
            {"label": "Shared transport cost", "value": f"₹{shared_cost:,}"},
            {"label": "You save", "value": f"₹{savings:,}"}
        ]
    })

# Feature 1: Buyer Reliability
@app.route('/api/buyers', methods=['GET'])
def get_buyers():
    buyer_name = request.args.get('buyer', '')
    district = request.args.get('district', '')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT buyer_name, location, reliability_score, payment_rating, cancellation_rate FROM buyers WHERE verified = TRUE"
        params = []
        if buyer_name:
            query += " AND buyer_name LIKE %s"
            params.append(f"%{buyer_name}%")
        query += " ORDER BY reliability_score DESC"
        cursor.execute(query, tuple(params))
        buyers = cursor.fetchall()
        cursor.close()
        conn.close()
        if buyers:
            return jsonify(buyers)
    except Exception as e:
        print(f"Database error in /api/buyers: {e}")

    return jsonify([
        {"buyer_name": "ABC Foods Ltd", "location": district or "Hyderabad", "reliability_score": 96, "payment_rating": 4.8},
        {"buyer_name": "FreshMart Processing", "location": district or "Vijayawada", "reliability_score": 91, "payment_rating": 4.5},
        {"buyer_name": "XYZ Agro Procurement", "location": district or "Ongole", "reliability_score": 87, "payment_rating": 4.2}
    ])

# Feature 2: True Profit Calculator
@app.route('/api/profit-calculator', methods=['POST'])
def profit_calculator():
    data = request.json or {}
    acres = float(data.get('acres', 1) or 1)
    yield_qty = float(data.get('expected_yield', 20) or 20)
    price = float(data.get('selling_price', 30) or 30)
    cost = float(data.get('total_cost', 25000) or 25000)

    revenue = round(yield_qty * price * 100)
    net_profit = revenue - cost

    return jsonify({
        "data": [
            {"label": "Expected Revenue", "value": f"₹{revenue:,}"},
            {"label": "Total Investment", "value": f"₹{cost:,.0f}"},
            {"label": "Net Profit", "value": f"₹{net_profit:,}"}
        ]
    })

# Feature 3: Rescue My Harvest
@app.route('/api/rescue-harvest', methods=['POST'])
def rescue_harvest():
    data = request.json or {}
    crop = data.get('crop', 'Crop')
    qty = data.get('quantity', '500')
    min_price = data.get('min_price', '20')

    return jsonify({
        "data": [
            {"label": "Buyers Alerted", "value": "14 verified buyers nearby"},
            {"label": "Best Active Offer", "value": f"₹{float(min_price or 20) * 1.1:.1f} / kg"},
            {"label": "Auction Timer", "value": "18 mins remaining"}
        ]
    })

# Feature 4: Oversupply Map
@app.route('/api/oversupply-map', methods=['POST'])
def oversupply_map():
    data = request.json or {}
    crop = data.get('crop', 'Chilli')
    district = data.get('district', 'Guntur')

    return jsonify({
        "data": [
            {"label": "Market Supply Risk", "value": f"Moderate Risk in {district}"},
            {"label": "Planned Cultivation Area", "value": "1,250 acres registered"},
            {"label": "Recommended Alternative", "value": "Green Gram / Black Gram"}
        ]
    })

# Feature 5: Harvest-Time Advisor
@app.route('/api/harvest-advisor', methods=['POST'])
def harvest_advisor():
    data = request.json or {}
    sowing_date = data.get('sowing_date', '2026-01-01')
    stage = data.get('stage', 'Fruiting')

    return jsonify({
        "data": [
            {"label": "Optimal Harvest Window", "value": "5 to 8 days from today"},
            {"label": "Crop Maturity Level", "value": "88% Mature"},
            {"label": "Market Demand Trend", "value": "High Demand (Prices expected +5%)"}
        ]
    })

# Feature 6: Market Prices
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
        if prices:
            return jsonify(prices)
    except Exception as e:
        print(f"Database error in /api/market-prices: {e}")

    return jsonify([
        {"market": f"{crop} Primary Market", "price_per_kg": 42, "arrival_quantity": 12000},
        {"market": "Regional Mandi", "price_per_kg": 38, "arrival_quantity": 18000},
        {"market": "District Hub", "price_per_kg": 35, "arrival_quantity": 8500}
    ])

if __name__ == "__main__":
    app.run()
