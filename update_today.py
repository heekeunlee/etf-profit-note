import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

record = {
    "date": "2026-05-11",
    "equity": data.get('total_equity', 18432448),
    "daily_profit": 1535164,
    "daily_roi": 8.33,
    "trades": [
        {
            "name": "1Q 미국우주항공테크",
            "buy_amount": 0,
            "sell_amount": 2789240,
            "avg_price": 12720,
            "profit": 168575,
            "roi": 6.43
        },
        {
            "name": "삼성전자",
            "buy_amount": 5715000,
            "sell_amount": 39559250,
            "avg_price": 284241,
            "profit": 1366589,
            "roi": 3.58
        }
    ]
}

dates = [r['date'] for r in data['records']]
if "2026-05-11" not in dates:
    data['records'].insert(0, record)
else:
    print("Record for 2026-05-11 already exists. Updating it.")
    idx = dates.index("2026-05-11")
    data['records'][idx] = record

total_profit = sum(r.get('daily_profit', 0) for r in data['records'])
data['total_profit'] = total_profit
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully. Total profit: {total_profit}")
