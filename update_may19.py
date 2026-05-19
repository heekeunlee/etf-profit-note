import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

current_equity = data.get('total_equity', 32880114)

trades = [
    {
        "name": "스피어",
        "buy_amount": 9350000,
        "sell_amount": 4995500,
        "avg_price": 48500,
        "profit": 151155,
        "roi": 3.12
    }
]

daily_profit = sum(t['profit'] for t in trades)
daily_roi = round((daily_profit / current_equity) * 100, 2)

record = {
    "date": "2026-05-19",
    "equity": current_equity,
    "daily_profit": daily_profit,
    "daily_roi": daily_roi,
    "trades": trades
}

# Check if date already exists
dates = [r['date'] for r in data['records']]
if "2026-05-19" in dates:
    idx = dates.index("2026-05-19")
    data['records'][idx] = record
else:
    data['records'].insert(0, record)

# Update totals
data['total_profit'] = sum(r.get('daily_profit', 0) for r in data['records'])
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully for 2026-05-19.")
print(f"Daily Profit: {daily_profit}")
print(f"Daily ROI: {daily_roi}%")
print(f"Total Profit: {data['total_profit']}")
