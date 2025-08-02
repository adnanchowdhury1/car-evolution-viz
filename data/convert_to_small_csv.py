import pandas as pd

# Load the original CSV
df = pd.read_csv("data/vehicles.csv", low_memory=False)

# Keep only necessary columns
df_small = df[["make", "model", "year", "comb08", "displ"]]

# Filter to relevant years and remove missing data
df_small = df_small[
    (df_small["year"] >= 1990) & 
    (df_small["year"] <= 2020) & 
    (df_small["comb08"].notna()) & 
    (df_small["displ"].notna())
]

# Save to a new smaller CSV
df_small.to_csv("data/vehicles_small.csv", index=False)
