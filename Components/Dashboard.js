import React, { useState, useRef,useEffect  } from 'react';
import { View, Text, ScrollView, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// import { RNCamera  } from 'react-native-camera';
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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanButtonClick = () => {
    setCameraOpen(true);
  };

  const handleCameraClose = () => {
    setCameraOpen(false);
  };

  const handleBarCodeScanned = ({ data }) => {
    console.log('Scanned data:', data);
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Your AR content or patient name display goes here */}
          <TouchableOpacity onPress={handleScanButtonClick}>
            <Text style={{ fontSize: 20, color: 'blue' }}>Scan Patient</Text>
          </TouchableOpacity>
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
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Image source={require('./Assets/people/manyoon.jpg')} style={styles.profileImage} />
        <Text style={styles.text}>Name: Manyoon</Text>
        <Text style={styles.text}>Age: 21</Text>
        <Text style={styles.text}>Room Number: G103A</Text>
        <Text style={styles.text}>Disease/Disability: Forgetful</Text>
        <Text style={getStatusTextStyle('Emergency')}>Status: fall</Text>
      </View>

      <View style={styles.card}>
        <Image source={require('./Assets/people/me.jpg')} style={styles.profileImage} />
        <Text style={styles.text}>Name: King Joe</Text>
        <Text style={styles.text}>Age: 20</Text>
        <Text style={styles.text}>Room Number: D101</Text>
        <Text style={styles.text}>Disease/Disability: Success</Text>
        <Text style={getStatusTextStyle('Awake')}>Status: Sleep</Text>
      </View>

      <View style={styles.card}>
        <Image source={require('./Assets/people/steven.jpg')} style={styles.profileImage} />
        <Text style={styles.text}>Name: Steven Hany</Text>
        <Text style={styles.text}>Age: 21</Text>
        <Text style={styles.text}>Room Number: D101</Text>
        <Text style={styles.text}>Disease/Disability: Anger</Text>
        <Text style={getStatusTextStyle('Awake')}>Status: Sleep</Text>
      </View>
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
});

export default DashboardScreen;
