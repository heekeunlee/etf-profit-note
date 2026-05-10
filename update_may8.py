import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

record_08 = {
    "date": "2026-05-08",
    "equity": data['total_equity'],
    "daily_profit": 893352,
    "daily_roi": 0.0,
    "trades": [
        {
            "name": "KB증권",
            "buy_amount": 0,
            "sell_amount": 0,
            "avg_price": 0,
            "profit": 893352,
            "roi": 0.0
        }
    ]
}

current_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
data['last_updated'] = current_time

dates = [r['date'] for r in data['records']]

if "2026-05-08" not in dates:
    data['records'].insert(0, record_08)
else:
    print("May 8th record already exists.")

total_profit = 0
for r in data['records']:
    total_profit += r.get('daily_profit', 0)

data['total_profit'] = total_profit

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully. Total profit: {total_profit}")
