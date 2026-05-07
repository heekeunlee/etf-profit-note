import json
import os

files = [
    '/Users/dasepa/etf_profit_note/public/data/history.json',
    '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    changed = False
    for record in data.get('records', []):
        for trade in record.get('trades', []):
            if trade.get('buy_amount') == 0 and trade.get('sell_amount', 0) > 0:
                trade['buy_amount'] = trade['sell_amount'] - trade['profit']
                changed = True
                
    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Updated {file_path}")
    else:
        print(f"No changes needed for {file_path}")
