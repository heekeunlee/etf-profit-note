import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

record = {
    "date": "2026-05-12",
    "equity": int(861459 / (2.62 / 100)),
    "daily_profit": 861459,
    "daily_roi": 2.62,
    "trades": [
        {
            "name": "삼성전자",
            "buy_amount": 2900000,
            "sell_amount": 6111000,
            "avg_price": 285986,
            "profit": 92734,
            "roi": 1.54
        },
        {
            "name": "미래에셋증권",
            "buy_amount": 24265000,
            "sell_amount": 16460000,
            "avg_price": 80238,
            "profit": 111954,
            "roi": 0.68
        },
        {
            "name": "두산에너빌리티",
            "buy_amount": 0,
            "sell_amount": 1839600,
            "avg_price": 127646,
            "profit": 48742,
            "roi": 2.72
        },
        {
            "name": "스피어",
            "buy_amount": 6568200,
            "sell_amount": 2026500,
            "avg_price": 46007,
            "profit": 56768,
            "roi": 2.88
        },
        {
            "name": "HPSP",
            "buy_amount": 2244000,
            "sell_amount": 1156000,
            "avg_price": 56032,
            "profit": 87120,
            "roi": 8.15
        },
        {
            "name": "PLUS 우주항공&UAM",
            "buy_amount": 0,
            "sell_amount": 4075110,
            "avg_price": 47216,
            "profit": 250322,
            "roi": 6.54
        },
        {
            "name": "KODEX 로봇액티브",
            "buy_amount": 0,
            "sell_amount": 2055360,
            "avg_price": 38362,
            "profit": 213819,
            "roi": 11.61
        }
    ]
}

dates = [r['date'] for r in data['records']]
if "2026-05-12" not in dates:
    data['records'].insert(0, record)
else:
    print("Record for 2026-05-12 already exists. Updating it.")
    idx = dates.index("2026-05-12")
    data['records'][idx] = record

total_profit = sum(r.get('daily_profit', 0) for r in data['records'])
data['total_profit'] = total_profit
data['total_equity'] = record['equity']
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully. Total profit: {total_profit}")
