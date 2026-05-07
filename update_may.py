import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

record_06 = {
    "date": "2026-05-06",
    "equity": int(3008624 / 0.0579),
    "daily_profit": 3008624,
    "daily_roi": 5.79,
    "trades": [
        {
            "name": "삼성전자",
            "buy_amount": 7580000,
            "sell_amount": 39772500,
            "avg_price": 251864,
            "profit": 2773072,
            "roi": 7.49
        },
        {
            "name": "미래에셋증권",
            "buy_amount": 2978000,
            "sell_amount": 3960000,
            "avg_price": 72675,
            "profit": 318080,
            "roi": 8.73
        },
        {
            "name": "두산에너빌리티",
            "buy_amount": 0,
            "sell_amount": 10160000,
            "avg_price": 129099,
            "profit": -188867,
            "roi": -1.83
        },
        {
            "name": "TIGER 증권",
            "buy_amount": 0,
            "sell_amount": 156170,
            "avg_price": 19665,
            "profit": 18506,
            "roi": 13.44
        },
        {
            "name": "TIGER 반도체TOP10",
            "buy_amount": 0,
            "sell_amount": 892800,
            "avg_price": 40245,
            "profit": 87833,
            "roi": 10.91
        },
        {
            "name": "HANARO 원자력iSelect",
            "buy_amount": 917645,
            "sell_amount": 0,
            "avg_price": 89892,
            "profit": 0,
            "roi": 0.00
        }
    ]
}

record_07 = {
    "date": "2026-05-07",
    "equity": int(180638 / 0.0098),
    "daily_profit": 180638,
    "daily_roi": 0.98,
    "trades": [
        {
            "name": "삼성전자",
            "buy_amount": 35815000,
            "sell_amount": 0,
            "avg_price": 275141,
            "profit": 0,
            "roi": 0.00
        },
        {
            "name": "1Q 미국우주항공테크",
            "buy_amount": 631000,
            "sell_amount": 0,
            "avg_price": 12720,
            "profit": 0,
            "roi": 0.00
        },
        {
            "name": "TIME K신재생에너지액티브",
            "buy_amount": 4503500,
            "sell_amount": 10824615,
            "avg_price": 29061,
            "profit": 100223,
            "roi": 0.93
        },
        {
            "name": "HANARO 원자력iSelect",
            "buy_amount": 4809150,
            "sell_amount": 0,
            "avg_price": 94965,
            "profit": 0,
            "roi": 0.00
        },
        {
            "name": "PLUS 글로벌HBM반도체",
            "buy_amount": 0,
            "sell_amount": 4521750,
            "avg_price": 88753,
            "profit": 70906,
            "roi": 1.59
        },
        {
            "name": "KODEX 로봇액티브",
            "buy_amount": 0,
            "sell_amount": 3271750,
            "avg_price": 36244,
            "profit": 9509,
            "roi": 0.29
        }
    ]
}

current_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
data['last_updated'] = current_time

dates = [r['date'] for r in data['records']]

if "2026-05-06" not in dates:
    data['records'].insert(0, record_06)

if "2026-05-07" not in dates:
    data['records'].insert(0, record_07)

data['total_equity'] = record_07['equity']

total_profit = 0
for r in data['records']:
    total_profit += r.get('daily_profit', 0)

data['total_profit'] = total_profit

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Total profit recalculated: {total_profit}")
