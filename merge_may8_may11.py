import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

records = data.get('records', [])

may8_idx = -1
may11_idx = -1

for i, r in enumerate(records):
    if r['date'] == "2026-05-08":
        may8_idx = i
    elif r['date'] == "2026-05-11":
        may11_idx = i

if may8_idx != -1 and may11_idx != -1:
    may8_record = records.pop(may8_idx)
    
    # Find may11 again in case indices shifted
    for i, r in enumerate(records):
         if r['date'] == "2026-05-11":
             may11_idx = i
             break
    
    # Only move the KB증권 trade or all trades if May 8 only has KB증권
    records[may11_idx]['trades'].extend(may8_record['trades'])
    records[may11_idx]['daily_profit'] += may8_record['daily_profit']
    print(f"Merged May 8th trades into May 11th. New daily_profit: {records[may11_idx]['daily_profit']}")
else:
    print("Could not find both May 8th and May 11th records.")

total_profit = sum(r.get('daily_profit', 0) for r in data['records'])
data['total_profit'] = total_profit
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated successfully. Total profit: {total_profit}")
