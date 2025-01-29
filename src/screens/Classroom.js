import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';

const Classroom = () => {
  const { departmentName, latitude, longitude, locationId } = useRoute().params; // Get data from route params
  const [selectedRegion, setSelectedRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });

  const navigation = useNavigation();

  // Navigate to LocationDetails with locationId and other data
  const handleMarkerPress = () => {
    console.log('Navigating to location details', departmentName);
    navigation.navigate('LocationDetails', { 
      locationId: locationId || 'default-id',  // Add locationId here
      departmentName: departmentName || 'Unknown Department', 
      latitude: latitude || 0, 
      longitude: longitude || 0 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{departmentName}</Text>
      <MapView
        style={styles.map}
        mapType="satellite"
        region={selectedRegion}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={departmentName}
          description="Click to view details"
          onPress={handleMarkerPress} // Navigate when marker is pressed
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  map: { flex: 1 },
});

export default Classroom;
