const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;
const mongoURI = 'mongodb+srv://steven:stevenmongo123@cluster0.pfzxzcu.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const patientSchema = new mongoose.Schema({
  name: String,
  DOB: String,
  age: Number,
  gender: String,
  nationality: String,
  room_no: String,
  disease: String,
  medicines: [String],
  Priority_Care: String,
  Medical_Desc: String,
  image_path: String,
  image_binary: String,
});

const Patient = mongoose.model('patient', patientSchema);

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find({});
    console.log('Fetched patients:', patients);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
