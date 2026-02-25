import json

with open('public/data/history_heekeun.json', 'r') as f:
    data = json.load(f)

total_profit_field = data.get('total_profit', 0)
sum_daily_profit = sum(record['daily_profit'] for record in data['records'])

print(f"Total Profit in field: {total_profit_field}")
print(f"Sum of Daily Profits: {sum_daily_profit}")
print(f"Match: {total_profit_field == sum_daily_profit}")
