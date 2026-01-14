import json
import os
import subprocess
from datetime import datetime
import random

# Configuration
DATA_FILE = os.path.join(os.path.dirname(__file__), '../public/data/history.json')
REPO_DIR = os.path.join(os.path.dirname(__file__), '..')

def load_data():
    if not os.path.exists(DATA_FILE):
        return {
            "last_updated": "",
            "total_equity": 1000000,
            "total_profit": 0,
            "history": []
        }
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def update_profit(data):
    # This is a simulation/placeholder logic.
    # In a real scenario, you would fetch real balance from `pyupbit` or exchange API.
    
    current_time = datetime.now().isoformat()
    today_date = datetime.now().strftime("%Y-%m-%d")
    
    # Simulate today's profit (Randomly between -10k and +20k)
    daily_roi_percent = random.uniform(-0.01, 0.02) # -1% to +2%
    previous_equity = data.get('total_equity', 1000000)
    
    # If simulated for the same day, we might just update the existing entry or create new if not exists
    # For simplicity, we assume one entry per day or update if exists
    
    daily_profit = int(previous_equity * daily_roi_percent)
    new_equity = previous_equity + daily_profit
    
    total_profit = data.get('total_profit', 0) + daily_profit
    
    new_entry = {
        "date": today_date,
        "equity": new_equity,
        "daily_profit": daily_profit,
        "cumulative_profit": total_profit,
        "trade_count": random.randint(0, 5)
    }
    
    # Update global stats
    data['last_updated'] = current_time
    data['total_equity'] = new_equity
    data['total_profit'] = total_profit
    
    # Check if entry for today exists
    history = data.get('history', [])
    if history and history[-1]['date'] == today_date:
        history[-1] = new_entry
    else:
        history.append(new_entry)
        
    data['history'] = history
    return data

def git_push():
    try:
        subprocess.run(['git', 'add', DATA_FILE], cwd=REPO_DIR, check=True)
        subprocess.run(['git', 'commit', '-m', f'Update profit data: {datetime.now().strftime("%Y-%m-%d")}'], cwd=REPO_DIR, check=True)
        subprocess.run(['git', 'push'], cwd=REPO_DIR, check=True)
        print("✅ Data updated and pushed to GitHub successfully.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git operation failed: {e}")

if __name__ == "__main__":
    print("🚀 Starting Profit Note Updater...")
    data = load_data()
    updated_data = update_profit(data)
    save_data(updated_data)
    print("📊 Data file updated.")
    
    # Uncomment the following line to enable auto-push
    # git_push()
