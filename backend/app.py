from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
import requests
import time
import os
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Configuration
CSPR_CLOUD_API_KEY = ""
CSPR_CLOUD_BASE_URL = "https://api.cspr.cloud"
CACHE_DURATION = 60  # 1 minute in seconds

# In-memory cache
cache = {
    'data': None,
    'timestamp': None
}

def is_cache_valid():
    """Check if the cached data is still valid (within 1 minute)"""
    if cache['timestamp'] is None:
        return False
    
    current_time = time.time()
    cache_age = current_time - cache['timestamp']
    return cache_age < CACHE_DURATION

def fetch_current_network_state():
    """Fetch current network state from cspr.live API"""
    try:
        url = "https://api.mainnet.cspr.live/network-state"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        return data['data']['last_added_block']
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from cspr.live: {e}")
        return None

def fetch_from_cspr_cloud():
    """Fetch latest switch block data from CSPR.cloud API"""
    try:
        url = f"{CSPR_CLOUD_BASE_URL}/blocks"
        params = {
            'is_switch_block': 'true',
            'order_by': 'block_height',
            'order_direction': 'desc',
            'limit': 1
        }
        headers = {
            'accept': 'application/json',
            'Authorization': CSPR_CLOUD_API_KEY
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        switch_block_data = response.json()
        
        # Also fetch current network state
        current_state = fetch_current_network_state()
        
        # Combine the data
        combined_data = {
            'switch_block': switch_block_data,
            'current_state': current_state
        }
        
        # Update cache
        cache['data'] = combined_data
        cache['timestamp'] = time.time()
        
        return combined_data
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from CSPR.cloud: {e}")
        return None

def get_era_data():
    """Get era data from cache or fetch from API if cache is expired"""
    if is_cache_valid():
        print("Returning cached data")
        return cache['data']
    
    print("Cache expired or empty, fetching from API")
    return fetch_from_cspr_cloud()

@app.route('/api/era-info', methods=['GET'])
def get_era_info():
    """Get current era information"""
    try:
        data = get_era_data()
        
        if not data or not data.get('switch_block') or not data.get('switch_block', {}).get('data'):
            return jsonify({
                'error': 'Failed to fetch era data',
                'cached': False
            }), 500
        
        # Get switch block data (last completed era)
        switch_block = data['switch_block']['data'][0]
        
        # Get current network state (current era and block height)
        current_state = data.get('current_state')
        
        # Calculate next era time (add 2 hours)
        last_era_end = datetime.fromisoformat(switch_block['timestamp'].replace('Z', '+00:00'))
        next_era_start = last_era_end + timedelta(hours=2)
        
        # Prepare response with corrected era information
        response_data = {
            'current_era': current_state['era_id'] if current_state else switch_block['era_id'] + 1,
            'current_block_height': current_state['height'] if current_state else switch_block['block_height'],
            'last_switch_block': {
                'era_id': switch_block['era_id'],
                'timestamp': switch_block['timestamp'],
                'block_hash': switch_block['block_hash'],
                'block_height': switch_block['block_height']
            },
            'next_switch_block': {
                'timestamp': next_era_start.isoformat().replace('+00:00', 'Z')
            },
            'cached': is_cache_valid(),
            'cache_age': time.time() - cache['timestamp'] if cache['timestamp'] else 0
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error processing era info: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'cache_valid': is_cache_valid(),
        'cache_age': time.time() - cache['timestamp'] if cache['timestamp'] else None
    })

@app.route('/api/cache/clear', methods=['POST'])
def clear_cache():
    """Clear the cache (useful for testing)"""
    cache['data'] = None
    cache['timestamp'] = None
    return jsonify({
        'message': 'Cache cleared successfully'
    })

@app.route('/api/cache/status', methods=['GET'])
def cache_status():
    """Get cache status information"""
    return jsonify({
        'cache_valid': is_cache_valid(),
        'cache_age': time.time() - cache['timestamp'] if cache['timestamp'] else None,
        'cache_duration': CACHE_DURATION,
        'has_data': cache['data'] is not None
    })

# Serve React app
@app.route('/')
def serve_react_app():
    """Serve the main React app"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_react_static(path):
    """Serve React static files or fallback to index.html for client-side routing"""
    try:
        # Try to serve the requested file
        return send_from_directory(app.static_folder, path)
    except:
        # If file doesn't exist, serve index.html for client-side routing
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(error):
    # For API routes, return JSON error
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Endpoint not found'}), 404
    # For all other routes, serve the React app
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Use environment variable for debug mode (defaults to False for security)
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
