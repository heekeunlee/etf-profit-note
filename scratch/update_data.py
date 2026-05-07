
import json
from datetime import datetime

files = [
    '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json',
    '/Users/dasepa/etf_profit_note/public/data/history.json'
]

# Shared data from images
daily_profit = 1267142
trades = [
    {
        "name": "HANARO 원자력iSelect",
        "buy_amount": 0,
        "sell_amount": 21692000,
        "avg_price": 70836,
        "profit": 1147738,
        "roi": 5.59
    },
    {
        "name": "TIME K신재생에너지액티브",
        "buy_amount": 2637500,
        "sell_amount": 2446000,
        "avg_price": 24357,
        "profit": 52380,
        "roi": 2.19
    },
    {
        "name": "대우건설",
        "buy_amount": 0,
        "sell_amount": 55000,
        "avg_price": 24850,
        "profit": 5188,
        "roi": 10.42
    },
    {
        "name": "TIGER 반도체TOP10",
        "buy_amount": 3467500,
        "sell_amount": 3499970,
        "avg_price": 34651,
        "profit": 34518,
        "roi": 1.0
    },
    {
        "name": "KODEX 로봇액티브",
        "buy_amount": 1555250,
        "sell_amount": 2766600,
        "avg_price": 31483,
        "profit": 27318,
        "roi": 1.0
    },
    {
        "name": "TIGER K방산&우주",
        "buy_amount": 7665250,
        "sell_amount": 0,
        "avg_price": 51095,
        "profit": 0,
        "roi": 0.0
    },
    {
        "name": "KODEX 친환경조선해운액티브",
        "buy_amount": 3446000,
        "sell_amount": 0,
        "avg_price": 34782,
        "profit": 0,
        "roi": 0.0
    }
]

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        old_equity = data['total_equity']
        old_total_profit = data['total_profit']

        new_total_profit = old_total_profit + daily_profit
        new_equity = old_equity + daily_profit
        daily_roi = round((daily_profit / old_equity) * 100, 2)

        new_record = {
            "date": "2026-04-15",
            "equity": new_equity,
            "daily_profit": daily_profit,
            "daily_roi": daily_roi,
            "trades": trades
        }

        data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        data['total_equity'] = new_equity
        data['total_profit'] = new_total_profit
        data['records'].insert(0, new_record)

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Successfully updated {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
