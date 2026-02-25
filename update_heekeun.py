import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_record = {
    "date": "2026-02-25",
    "equity": 11364768,
    "daily_profit": 1020484,
    "daily_roi": 4.47,
    "trades": [
        {
            "name": "KODEX 로봇액티브",
            "buy_amount": 0,
            "sell_amount": 23866470,
            "avg_price": 35362,
            "profit": 1020484,
            "roi": 4.47
        }
    ]
}

data['last_updated'] = "2026-02-25T19:57:46"
data['total_equity'] = 11364768

# Recalculate total_profit just to be completely safe
total_profit = 0
for r in data['records']:
    total_profit += r.get('daily_profit', 0)
total_profit += new_record['daily_profit']

data['total_profit'] = total_profit
data['records'].insert(0, new_record)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
