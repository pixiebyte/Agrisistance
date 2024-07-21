import pickle
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

def load_and_preprocess_data():
    print("Loading and preprocessing data...")
    # Load data from CSV
    data = pd.read_csv('datatired.csv')
    
    # Define feature columns and target columns
    feature_cols = ['pH', 'Temperature', 'Rainfall', 'Humidity', 'Nitrogen', 'Phosphorus', 'Potassium']
    target_cols = ['Crop']
    
    # Split data into features and targets
    X = data[feature_cols]
    y_crop = data['Crop']
    
    # One-hot encode the target variable
    encoder = OneHotEncoder(sparse_output=False)
    y_crop_encoded = encoder.fit_transform(y_crop.values.reshape(-1, 1))
    
    print(f"Data loaded with {len(X)} samples.")
    return X, y_crop_encoded, encoder

# Load and preprocess data
X, y_crop_encoded, encoder = load_and_preprocess_data()

# Save X and encoder
with open('X_data.pkl', 'wb') as f:
    pickle.dump(X, f)
    
with open('encoder.pkl', 'wb') as f:
    pickle.dump(encoder, f)

print("X and encoder saved successfully.")
