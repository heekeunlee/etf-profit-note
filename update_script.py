import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

record_28 = {
    "date": "2026-04-28",
    "equity": 6719049,
    "daily_profit": 328187,
    "daily_roi": 3.54,
    "trades": [
        {
            "name": "풍산홀딩스",
            "buy_amount": 0,
            "sell_amount": 4747000,
            "avg_price": 44744,
            "profit": 217967,
            "roi": 4.81
        },
        {
            "name": "KODEX 로봇액티브",
            "buy_amount": 2879800,
            "sell_amount": 4862025,
            "avg_price": 35195,
            "profit": 110220,
            "roi": 2.32
        }
    ]
}

record_29 = {
    "date": "2026-04-29",
    "equity": 6826637,
    "daily_profit": 680443,
    "daily_roi": 9.10,
    "trades": [
        {
            "name": "삼성전자",
            "buy_amount": 0,
            "sell_amount": 6820000,
            "avg_price": 198690,
            "profit": 646522,
            "roi": 10.47
        },
        {
            "name": "미래에셋증권",
            "buy_amount": 67700,
            "sell_amount": 0,
            "avg_price": 67875,
            "profit": 0,
            "roi": 0.00
        },
        {
            "name": "KODEX 우량주",
            "buy_amount": 0,
            "sell_amount": 1338500,
            "avg_price": 26089,
            "profit": 33921,
            "roi": 2.60
        },
        {
            "name": "HPSP",
            "buy_amount": 532000,
            "sell_amount": 0,
            "avg_price": 52528,
            "profit": 0,
            "roi": 0.00
        },
        {
            "name": "KODEX 로봇액티브",
            "buy_amount": 718000,
            "sell_amount": 0,
            "avg_price": 35866,
            "profit": 0,
            "roi": 0.00
        }
    ]
}

current_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
data['last_updated'] = current_time

# If 28th already exists, don't insert, otherwise insert
dates = [r['date'] for r in data['records']]
if "2026-04-28" not in dates:
    data['records'].insert(0, record_28)

if "2026-04-29" not in dates:
    data['records'].insert(0, record_29)

# Update total equity to the latest
data['total_equity'] = 6826637

# Recalculate total_profit
total_profit = 0
for r in data['records']:
    total_profit += r.get('daily_profit', 0)

data['total_profit'] = total_profit

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Total profit recalculated: {total_profit}")
