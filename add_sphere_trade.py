import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_trade = {
    "name": "스피어",
    "buy_amount": 1148100,
    "sell_amount": 1163750,
    "avg_price": 44157,
    "profit": 57420,
    "roi": 5.19
}

updated = False
for r in data.get('records', []):
    if r['date'] == "2026-05-11":
        r['trades'].append(new_trade)
        r['daily_profit'] += new_trade['profit']
        updated = True
        break

if updated:
    total_profit = sum(r.get('daily_profit', 0) for r in data['records'])
    data['total_profit'] = total_profit
    data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"Added 스피어 to May 11th. New Total Profit: {total_profit}")
else:
    print("Could not find record for May 11th.")
