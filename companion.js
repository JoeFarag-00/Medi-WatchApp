import React, { useState, useRef,useEffect  } from 'react';
import { View, Text, ScrollView, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';



const getStatusTextStyle = (status) => {
  let textStyle = styles.text;

  if (status === 'Awake') {
    textStyle = [styles.text, styles.greenText];
  } else if (status === 'Help') {
    textStyle = [styles.text, styles.orangeText];
  } else if (status === 'Emergency') {
    textStyle = [styles.text, styles.redText];
  }

  return textStyle;
};

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('./Assets/doctor1.png')} style={styles.nurseImage} />
      <Text style={styles.text}>Name: Nurse Farah</Text>
      <Text style={styles.text}>Age: 30</Text>
      <Text style={styles.text}>Work Years: 5</Text>
      <Text style={styles.text}>Shift Time Range: 8 AM - 4 PM</Text>
      <Text style={styles.text}>Building Responsibility: Ward A</Text>
    </View>
  );
};

{/* add AR  */}
const ScanARScreen = () => {
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedPatientInfo, setScannedPatientInfo] = useState(null);
  const [previousScans, setPreviousScans] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanButtonClick = () => {
    setScannedPatientInfo(null);
    setCameraOpen(true);
  };

  const handleCameraClose = () => {
    setCameraOpen(false);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScannedPatientInfo(data);
    setPreviousScans((prevScans) => [data, ...prevScans]);
    setCameraOpen(false);
  };

  const handlePreviousScanPress = (scanInfo) => {
    console.log('Pressed on scan:', scanInfo);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {isCameraOpen ? (
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={handleBarCodeScanned}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
              margin: 20,
            }}
            onPress={handleCameraClose}
          >
            <Ionicons name="close" size={40} color="white" />
          </TouchableOpacity>
        </Camera>
      ) : (
        <View style={{ flex: 1 }}>
          {scannedPatientInfo ? (
            <View style={styles.patientInfoBox}>
              <Text style={{ fontSize: 18, color: 'black' }}>
                {scannedPatientInfo}
              </Text>
              <TouchableOpacity onPress={handleScanButtonClick}>
                <Text style={{ fontSize: 20, color: 'blue', marginTop: 10 }}>
                  Rescan Patients
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }}>
                {previousScans.map((scan, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.previousScanItem}
                    onPress={() => handlePreviousScanPress(scan)}
                  >
                    <Text style={styles.previousScanText}>{scan}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanButtonClick}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>Scan Patient</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};


const NotificationsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.notification}>
        <Text style={[styles.notificationText, styles.redText]}>Emergency: Patient Mina - Room 103A may have tripped</Text>
      </View>
      <View style={styles.notification}>
        <Text style={[styles.notificationText, styles.greenText]}>Patient Request: Youssef initiated a request gesture</Text>
      </View>
    </ScrollView>
  );
};

const Tab = createBottomTabNavigator();

const DashboardScreen = () => {
  const navigateToProfile = useNavigation();
  const navigateToNotifications = useNavigation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Patient Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
        }}
      />
     
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Nurse Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan Patient"
        component={ScanARScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const Dashboard = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3000/patients');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatients();
  }, []);

  const renderPatient = (patient, index) => {
    const imagePath = `./Patients/${patient.image_path}`;
  
    return (
      <View key={index} style={styles.card}>
        <Image source={ imagePath } style={styles.profileImage} />
        <Text style={styles.text}>Name: {patient.name}</Text>
        <Text style={styles.text}>Age: {patient.age}</Text>
        <Text style={styles.text}>Room Number: {patient.room_no}</Text>
        <Text style={styles.text}>Disease/Disability: {patient.disease}</Text>
        <Text style={getStatusTextStyle(patient.Priority_Care)}>
          Status: {patient.Priority_Care}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {patients.map((patient, index) => renderPatient(patient, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: 'lightblue',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 80,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },
  greenText: {
    color: 'green',
    fontWeight: 'bold',
  },
  orangeText: {
    color: 'orange',
    fontWeight: 'bold',
  },
  redText: {
    color: 'red',
    fontWeight: 'bold',
  },
  nurseImage: {
    width: 220,
    height: 220,
    borderRadius: 60,
    alignSelf: 'center',
  },
  notification: {
    backgroundColor: 'lightyellow',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    color: 'black',
  },
  patientInfoBox: {
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
  },
  previousScanItem: {
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  previousScanText: {
    fontSize: 16,
    color: 'black',
  },
  scanButton: {
    backgroundColor: 'blue',
    padding: 20,
    alignItems: 'center',
  },
});

export default DashboardScreen;