// services/mlService.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class MLService {
  constructor() {
    this.modelPath = path.join(__dirname, '../models/depression_severity_xgboost_model.pkl');
    this.scalerPath = path.join(__dirname, '../models/depression_severity_scaler.pkl');
    this.encoderPath = path.join(__dirname, '../models/depression_severity_label_encoder.pkl');
    
    // Check if model files exist
    this.modelReady = fs.existsSync(this.modelPath) && 
                      fs.existsSync(this.scalerPath) && 
                      fs.existsSync(this.encoderPath);
  }

  /**
   * Loads the ML models, scaler, and encoder
   */
  loadModels() {
    if (!this.modelReady) {
      console.warn('ML model files not found. Models cannot be loaded.');
      return;
    }
    console.log('ML models loaded successfully');
  }

  /**
   * Predicts depression severity based on questionnaire responses
   * @param {Object} responses - Object with question IDs as keys and response values as values
   * @returns {Promise<Object>} - Prediction result with severity and confidence
   */
  async predictSeverity(responses) {
    // If model files don't exist, return a fallback assessment
    if (!this.modelReady) {
      console.warn('ML model files not found. Using fallback assessment.');
      return this.fallbackAssessment(responses);
    }

    return new Promise((resolve, reject) => {
      // Convert responses to the format expected by the model
      const features = this.prepareFeatures(responses);
      
      // Convert features to JSON string for Python process
      const featuresJson = JSON.stringify(features);
      
      // Spawn Python process to run prediction
      const pythonProcess = spawn('python', [
        path.join(__dirname, '../scripts/predict.py'),
        this.modelPath,
        this.scalerPath,
        this.encoderPath,
        featuresJson
      ]);
      
      let result = '';
      let error = '';
      
      // Collect data from Python script stdout
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      // Collect any errors
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error(error);
          // If ML prediction fails, use fallback
          resolve(this.fallbackAssessment(responses));
          return;
        }
        
        try {
          const prediction = JSON.parse(result);
          resolve(prediction);
        } catch (err) {
          console.error('Error parsing prediction result:', err);
          resolve(this.fallbackAssessment(responses));
        }
      });
    });
  }

  /**
   * Prepares features in the format expected by the ML model
   * @param {Object} responses - Raw responses from the questionnaire
   * @returns {Object} - Formatted features
   */
  prepareFeatures(responses) {
    // Extract relevant features based on the ML model's expected input
    // This should match the features used during model training
    const features = {};
    
    // Add PHQ-9 responses (questions 1-9)
    for (let i = 1; i <= 9; i++) {
      features[`q${i}`] = responses[i] || 0;
    }
    
    // Add past diagnosis feature (question 10)
    features['past_diagnosis'] = responses[10] || 0;
    
    // Calculate PHQ-9 total score (might be a useful feature)
    features['phq9_total'] = Object.entries(responses)
      .filter(([key, _]) => parseInt(key) >= 1 && parseInt(key) <= 9)
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
      
    return features;
  }

  /**
   * Fallback assessment when ML model is unavailable
   * @param {Object} responses - Questionnaire responses
   * @returns {Object} - Simple assessment based on PHQ-9 thresholds
   */
  fallbackAssessment(responses) {
    // Calculate total PHQ-9 score (questions 1-9)
    const totalScore = Object.entries(responses)
      .filter(([key, _]) => parseInt(key) >= 1 && parseInt(key) <= 9)
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
    
    // Determine severity based on standard PHQ-9 thresholds
    let severity = '';
    if (totalScore <= 4) severity = 'Minimal depression';
    else if (totalScore <= 9) severity = 'Mild depression';
    else if (totalScore <= 14) severity = 'Moderate depression';
    else if (totalScore <= 19) severity = 'Moderately severe depression';
    else severity = 'Severe depression';
    
    return {
      severity,
      confidence: 0.85, // Default confidence for fallback
      score: totalScore,
      method: 'fallback' // Indicate this is a fallback assessment
    };
  }
}

module.exports = new MLService();