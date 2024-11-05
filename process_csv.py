import pandas as pd
import json
import re

# Load the CSV file
file_path = './products_asos.csv'
dataset = pd.read_csv(file_path)

# Select relevant columns and rename them for clarity
formatted_data = dataset[['sku', 'name', 'price', 'category', 'color']].copy()
formatted_data.columns = ['itemId', 'name', 'price', 'category', 'color']

# Drop rows with missing SKU values to ensure unique item IDs
formatted_data.dropna(subset=['itemId'], inplace=True)

# Function to clean the price column, keeping only numeric values with optional decimals
def clean_price(price):
    match = re.search(r'\d+(\.\d+)?', str(price))
    return float(match.group()) if match else None

# Apply the cleaning function to the price column
formatted_data['price'] = formatted_data['price'].apply(clean_price)

# Remove rows where price could not be cleaned properly
cleaned_data = formatted_data.dropna(subset=['price'])

# Ensure the dataset has at most 101 unique entries
limited_cleaned_data = cleaned_data.drop_duplicates(subset=['itemId']).head(101)

# Convert the final dataset to a dictionary format compatible with JSON
limited_fashion_data = limited_cleaned_data.to_dict(orient='records')

# Save the formatted, deduplicated, and limited dataset to a JSON file
json_path = './fashion_data.json'
with open(json_path, 'w') as f:
    json.dump(limited_fashion_data, f, indent=4)

print(f"JSON file saved at: {json_path}")
