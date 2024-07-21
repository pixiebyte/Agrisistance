import pickle
import numpy as np
import tensorflow as tf
import streamlit as st

# Load the model
try:
    loaded_model = tf.keras.models.load_model('saved_model/my_model.h5')
    print("Model loaded successfully.")
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

# Verify that the loaded model is correct
loaded_model.summary()

# Load the saved `X` data and `encoder`
try:
    with open('X_data.pkl', 'rb') as f:
        X = pickle.load(f)
    print("X data loaded successfully.")

    with open('encoder.pkl', 'rb') as f:
        encoder = pickle.load(f)
    print("Encoder loaded successfully.")

except FileNotFoundError as e:
    st.error(f"File not found: {e.filename}. Make sure that 'X_data.pkl' and 'encoder.pkl' are in the correct directory.")
    st.stop()

except Exception as e:
    st.error(f"An error occurred while loading files: {e}")
    st.stop()

# Function to predict crops
def predict_crops(model, encoder, input_data, top_percentage=0.2):
    input_data_reshaped = np.array(input_data).reshape(1, -1)
    predictions = model.predict(input_data_reshaped)
    top_n = int(predictions.shape[1] * top_percentage)
    top_indices = np.argsort(predictions[0])[-top_n:][::-1]
    predicted_crops = encoder.inverse_transform(np.eye(predictions.shape[1])[top_indices])
    return predicted_crops

# Streamlit UI
st.title("Crop Prediction Model")
st.write("Enter the parameters of your land to get crop recommendations:")

# User inputs
ph = st.number_input("pH level", min_value=0.0, max_value=14.0, value=6.5)
temperature = st.number_input("Temperature (°C)", min_value=-50.0, max_value=60.0, value=22.5)
rainfall = st.number_input("Rainfall (mm)", min_value=0.0, max_value=2000.0, value=548.4)
humidity = st.number_input("Humidity (%)", min_value=0.0, max_value=100.0, value=67.3)
nitrogen = st.number_input("Nitrogen (mg/kg)", min_value=0.0, max_value=1000.0, value=89.3)
phosphorus = st.number_input("Phosphorus (mg/kg)", min_value=0.0, max_value=1000.0, value=39.9)
potassium = st.number_input("Potassium (mg/kg)", min_value=0.0, max_value=1000.0, value=49.1)

input_params = [ph, temperature, rainfall, humidity, nitrogen, phosphorus, potassium]

if st.button("Predict Crops"):
    predicted_crops = predict_crops(loaded_model, encoder, input_params)
    st.write(f"Predicted crops: {predicted_crops}")

# Run the Streamlit app
if __name__ == "__main__":
    st.write("App is running...")
