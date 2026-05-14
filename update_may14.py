import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

current_equity = data.get('total_equity', 32880114)

trades = [
    {
        "name": "TIGER 코리아밸류업",
        "buy_amount": 0,
        "sell_amount": 3684500,
        "avg_price": 36513,
        "profit": 32899,
        "roi": 0.90
    },
    {
        "name": "제룡전기",
        "buy_amount": 0,
        "sell_amount": 906400,
        "avg_price": 77716,
        "profit": 49653,
        "roi": 5.80
    },
    {
        "name": "삼성전자",
        "buy_amount": 2980000,
        "sell_amount": 10867000,
        "avg_price": 293311,
        "profit": 523372,
        "roi": 5.06
    },
    {
        "name": "HPSP",
        "buy_amount": 0,
        "sell_amount": 4313400,
        "avg_price": 54263,
        "profit": 17666,
        "roi": 0.41
    },
    {
        "name": "KODEX 미국나스닥100",
        "buy_amount": 0,
        "sell_amount": 5248800,
        "avg_price": 27902,
        "profit": 191206,
        "roi": 3.78
    }
]

daily_profit = sum(t['profit'] for t in trades)
daily_roi = round((daily_profit / current_equity) * 100, 2)

record = {
    "date": "2026-05-14",
    "equity": current_equity,
    "daily_profit": daily_profit,
    "daily_roi": daily_roi,
    "trades": trades
}

# Check if date already exists
dates = [r['date'] for r in data['records']]
if "2026-05-14" in dates:
    idx = dates.index("2026-05-14")
    data['records'][idx] = record
else:
    data['records'].insert(0, record)

# Update totals
data['total_profit'] = sum(r.get('daily_profit', 0) for r in data['records'])
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully for 2026-05-14.")
print(f"Daily Profit: {daily_profit}")
print(f"Daily ROI: {daily_roi}%")
print(f"Total Profit: {data['total_profit']}")
