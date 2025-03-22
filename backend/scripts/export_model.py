# export_model.py
import os
import shutil
import joblib
import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split

# Define paths
OUTPUT_DIR = 'models'
SCRIPT_DIR = 'scripts'
DATA_PATH = 'depression_questionnaire_dataset.csv'  # Update this path if needed

def ensure_directory(directory):
    """Create directory if it doesn't exist"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def main():
    # Ensure output directories exist
    ensure_directory(OUTPUT_DIR)
    ensure_directory(SCRIPT_DIR)
    
    # Check if the export has already been done
    model_path = os.path.join(OUTPUT_DIR, 'depression_severity_xgboost_model.pkl')
    if os.path.exists(model_path):
        print(f"Model already exists at {model_path}. Skipping export.")
        return
    
    # Load and prepare the dataset
    try:
        data = pd.read_csv(DATA_PATH)
        print(f"Loaded dataset with {data.shape[0]} rows and {data.shape[1]} columns")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        print("Creating a simplified model using sample data...")
        
        # Create a simplified model with sample data
        # This is a fallback in case the real dataset isn't available
        create_simplified_model()
        return
    
    # Separate features and target
    X = data.drop(['depression_score', 'severity'], axis=1)
    y = data['severity']
    
    # Encode the target variable
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Preprocess the data
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Load the pre-trained model
    # Alternatively, you could train a new model here
    model = XGBClassifier(
        n_estimators=300,
        learning_rate=0.1,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective='multi:softprob',
        num_class=len(label_encoder.classes_)
    )
    
    print("Training model...")
    model.fit(X_train_scaled, y_train)
    
    # Save the model, scaler, and encoder
    joblib.dump(model, os.path.join(OUTPUT_DIR, 'depression_severity_xgboost_model.pkl'))
    joblib.dump(scaler, os.path.join(OUTPUT_DIR, 'depression_severity_scaler.pkl'))
    joblib.dump(label_encoder, os.path.join(OUTPUT_DIR, 'depression_severity_label_encoder.pkl'))
    
    # Copy the predict.py script to the scripts directory
    copy_predict_script()
    
    print("Model export completed successfully")

def create_simplified_model():
    """Create a simplified model when the original dataset isn't available"""
    # Create a simple dataset with the expected features
    sample_data = pd.DataFrame({
        'q1': [0, 1, 2, 3, 3],
        'q2': [0, 1, 2, 3, 3],
        'q3': [0, 0, 1, 2, 3],
        'q4': [0, 0, 1, 2, 3],
        'q5': [0, 0, 1, 2, 3],
        'q6': [0, 0, 1, 1, 3],
        'q7': [0, 0, 1, 1, 2],
        'q8': [0, 0, 0, 1, 2],
        'q9': [0, 0, 0, 1, 2],
        'past_diagnosis': [0, 0, 0, 1, 1],
        'phq9_total': [0, 2, 9, 16, 24]
    })
    
    # Create labels
    labels = ['Minimal depression', 'Mild depression', 'Moderate depression', 
              'Moderately severe depression', 'Severe depression']
    
    # Create encoder and encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(labels)
    
    # Create scaler and scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(sample_data)
    
    # Create a simple model
    model = XGBClassifier(
        n_estimators=50,
        learning_rate=0.1,
        max_depth=3,
        random_state=42,
        objective='multi:softprob',
        num_class=len(label_encoder.classes_)
    )
    
    # Train the model
    model.fit(X_scaled, y_encoded)
    
    # Save the model, scaler, and encoder
    joblib.dump(model, os.path.join(OUTPUT_DIR, 'depression_severity_xgboost_model.pkl'))
    joblib.dump(scaler, os.path.join(OUTPUT_DIR, 'depression_severity_scaler.pkl'))
    joblib.dump(label_encoder, os.path.join(OUTPUT_DIR, 'depression_severity_label_encoder.pkl'))
    
    # Copy the predict.py script
    copy_predict_script()
    
    print("Simplified model created and saved successfully")

def copy_predict_script():
    """Copy the predict.py script to the scripts directory"""
    # The path to your predict.py script
    predict_script_source = os.path.join(os.path.dirname(__file__), 'scripts', 'predict.py')
    predict_script_dest = os.path.join(SCRIPT_DIR, 'predict.py')
    
    if os.path.exists(predict_script_source):
        shutil.copy2(predict_script_source, predict_script_dest)
        print(f"Copied predict.py script to {predict_script_dest}")
    else:
        print("Warning: predict.py script not found")

if __name__ == "__main__":
    main()