import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

current_equity = data.get('total_equity', 32880114)

trades = [
    {
        "name": "RISE 현대차고정피지컬AI",
        "buy_amount": 23673233,
        "sell_amount": 24439200,
        "avg_price": 13172,
        "profit": 765967,
        "roi": 3.24
    },
    {
        "name": "KODEX 미국나스닥100",
        "buy_amount": 5843447,
        "sell_amount": 6010000,
        "avg_price": 29078,
        "profit": 166553,
        "roi": 2.85
    },
    {
        "name": "KODEX 로봇액티브",
        "buy_amount": 5831862,
        "sell_amount": 6010200,
        "avg_price": 41653,
        "profit": 178338,
        "roi": 3.06
    },
    {
        "name": "KODEX 친환경조선해운액티브",
        "buy_amount": 3649958,
        "sell_amount": 3551000,
        "avg_price": 36496,
        "profit": -98958,
        "roi": -2.71
    },
    {
        "name": "SOL 화장품TOP3플러스",
        "buy_amount": 14260,
        "sell_amount": 13970,
        "avg_price": 14260,
        "profit": -290,
        "roi": -2.03
    }
]

daily_profit = sum(t['profit'] for t in trades)
daily_roi = round((daily_profit / current_equity) * 100, 2)

record = {
    "date": "2026-05-30",
    "equity": current_equity,
    "daily_profit": daily_profit,
    "daily_roi": daily_roi,
    "trades": trades
}

# Check if date already exists
dates = [r['date'] for r in data['records']]
if "2026-05-30" in dates:
    idx = dates.index("2026-05-30")
    data['records'][idx] = record
else:
    data['records'].append(record)
    data['records'].sort(key=lambda x: x['date'], reverse=True)

# Update totals
data['total_profit'] = sum(r.get('daily_profit', 0) for r in data['records'])
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully for 2026-05-30.")
print(f"Daily Profit: {daily_profit}")
print(f"Daily ROI: {daily_roi}%")
print(f"Total Profit: {data['total_profit']}")
