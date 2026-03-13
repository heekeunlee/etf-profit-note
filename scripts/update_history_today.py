import json
from datetime import datetime

file_path = '/Users/dasepa/etf_profit_note/public/data/history_heekeun.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find the 2026-03-12 record, it should be the first one
record = data['records'][0]
if record['date'] == '2026-03-12':
    record['date'] = '2026-03-13'
    
    # Existing trade (유진투자증권)
    # We will add the two new trades for 3/13
    
    new_trades = [
        {
            "name": "두산에너빌리티",
            "buy_amount": 0,
            "sell_amount": 9648000,
            "avg_price": 103260,
            "profit": 334599,
            "roi": 3.59
        },
        {
            "name": "UNICORN SK하이닉스밸류체인액티브",
            "buy_amount": 155325,
            "sell_amount": 0,
            "avg_price": 32672,
            "profit": 0,
            "roi": 0.00
        }
    ]
    
    record['trades'].extend(new_trades)
    
    # Recalculate daily profit
    daily_profit = sum(t.get('profit', 0) for t in record['trades'])
    record['daily_profit'] = daily_profit
    
    # Previous day (3/11) equity is data['records'][1]['equity']
    prev_equity = data['records'][1]['equity']
    
    record['equity'] = prev_equity + daily_profit
    record['daily_roi'] = round((daily_profit / prev_equity) * 100, 2)
    
    # Update total profit and equity
    total_profit = 0
    for r in data['records']:
        total_profit += r.get('daily_profit', 0)
    
    data['total_profit'] = total_profit
    data['total_equity'] = prev_equity + total_profit # wait, total_equity is not from 3/11 plus total profit... 
    # Let's derive total_equity by adding 334599 to previous total_equity
else:
    print(f"First record is not 3/12! It is {record['date']}")

# We know the previous total_equity when 3/12 was added was 57344014. 
# We are adding 334599 to this overall state.
data['total_profit'] = data['total_profit']  # already recalculated
data['total_equity'] = data['records'][0]['equity']

# Update last_updated
data['last_updated'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Updated history_heekeun.json successfully!")
print(f"New daily profit: {record['daily_profit']}")
print(f"New daily roi: {record['daily_roi']}")
print(f"New equity: {record['equity']}")
print(f"New total_profit: {data['total_profit']}")
