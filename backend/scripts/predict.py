import sys
import json
import numpy as np
import pandas as pd
import joblib

def predict():
    """
    Loads ML model and makes a prediction based on input features.
    Expected arguments:
    1. Model path
    2. Scaler path
    3. Label encoder path
    4. JSON string of features
    """
    if len(sys.argv) != 5:
        print(json.dumps({
            "error": "Invalid arguments",
            "severity": "Unknown",
            "confidence": 0,
            "method": "error"
        }))
        sys.exit(1)
    
    try:
        # Load paths from arguments
        model_path = sys.argv[1]
        scaler_path = sys.argv[2]
        encoder_path = sys.argv[3]
        features_json = sys.argv[4]
        
        # Parse features
        features = json.loads(features_json)
        
        # Load the model, scaler, and encoder
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        label_encoder = joblib.load(encoder_path)
        
        # Convert features to DataFrame
        df = pd.DataFrame([features])
        
        # Scale features
        df_scaled = scaler.transform(df)
        
        # Make prediction
        prediction_proba = model.predict_proba(df_scaled)
        predicted_class_idx = np.argmax(prediction_proba, axis=1)[0]
        confidence = float(prediction_proba[0][predicted_class_idx])
        
        # Map the predicted class index back to the label
        severity = label_encoder.inverse_transform([predicted_class_idx])[0]
        
        # Create and return the result
        result = {
            "severity": severity,
            "confidence": confidence,
            "score": features.get("phq9_total", 0),
            "method": "ml"
        }
        
        print(json.dumps(result))
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "severity": "Unknown",
            "confidence": 0,
            "method": "error"
        }))
        sys.exit(1)

if __name__ == "__main__":
    predict()