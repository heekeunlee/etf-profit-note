import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Old stats
prev_equity = data['records'][0]['equity']
prev_total_profit = data['total_profit']

# Profit addition
daily_profit = 98128 + 10435 + 295143 + 57643 # 461349
new_equity = prev_equity + daily_profit
new_total_profit = prev_total_profit + daily_profit
daily_roi = round((daily_profit / prev_equity) * 100, 2)

# Create new record
new_record = {
    "date": "2026-04-02",
    "equity": new_equity,
    "daily_profit": daily_profit,
    "daily_roi": daily_roi,
    "trades": [
        {
            "name": "TIGER 2차전지 TOP10",
            "buy_amount": 0,
            "sell_amount": 0,
            "avg_price": 0,
            "profit": daily_profit,
            "roi": daily_roi # Using daily_roi as trade roi for consolidation
        }
    ]
}

# Update top level info
data['last_updated'] = "2026-04-02T14:10:00" # setting manually to match today
data['total_equity'] = new_equity
data['total_profit'] = new_total_profit

# Insert as the first record (newest first)
data['records'].insert(0, new_record)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Update Finished!")
print(f"Date: 2026-04-02")
print(f"Profit Sum: {daily_profit}")
print(f"New Equity: {new_equity}")
print(f"New Total Profit: {new_total_profit}")
print(f"Daily ROI: {daily_roi}%")
