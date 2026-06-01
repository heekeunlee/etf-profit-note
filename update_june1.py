import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

current_equity = data.get('total_equity', 32880114)

trades = [
    {
        "name": "RISE 현대차고정피지컬AI",
        "buy_amount": 26019000,
        "sell_amount": 26987500,
        "avg_price": 15301,
        "profit": 972959,
        "roi": 3.74
    },
    {
        "name": "KODEX 미국우주항공",
        "buy_amount": 7285000,
        "sell_amount": 29165000,
        "avg_price": 14337,
        "profit": 1388058,
        "roi": 5.00
    },
    {
        "name": "삼성전자",
        "buy_amount": 579700,
        "sell_amount": 695500,
        "avg_price": 289137,
        "profit": 115800,
        "roi": 19.98
    }
]

daily_profit = sum(t['profit'] for t in trades)
daily_roi = round((daily_profit / current_equity) * 100, 2)

record = {
    "date": "2026-06-01",
    "equity": current_equity,
    "daily_profit": daily_profit,
    "daily_roi": daily_roi,
    "trades": trades
}

# Check if date already exists
dates = [r['date'] for r in data['records']]
if "2026-06-01" in dates:
    idx = dates.index("2026-06-01")
    data['records'][idx] = record
else:
    data['records'].append(record)
    data['records'].sort(key=lambda x: x['date'], reverse=True)

# Update totals
data['total_profit'] = sum(r.get('daily_profit', 0) for r in data['records'])
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully for 2026-06-01.")
print(f"Daily Profit: {daily_profit}")
print(f"Daily ROI: {daily_roi}%")
print(f"Total Profit: {data['total_profit']}")
