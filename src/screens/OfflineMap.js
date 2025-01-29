import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Alert, Platform, Text } from "react-native";
import MapView, { UrlTile } from "react-native-maps";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Asset } from "expo-asset"; // Expo Asset management

const OfflineMap = () => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    // Preload the asset so we can get its URI
    const loadImage = async () => {
      const imageAsset = Asset.fromModule(require('../../assets/campus_map.png'));
      await imageAsset.downloadAsync();
      setImageUri(imageAsset.localUri);
    };

    loadImage();
  }, []);

  const handleDownload = async () => {
    try {
      if (!imageUri) {
        Alert.alert("Error", "Image not loaded yet.");
        return;
      }

      const fileUri = FileSystem.documentDirectory + "campus_map.png"; // Local file path

      // Copy the image to the document directory
      await FileSystem.copyAsync({
        from: imageUri,
        to: fileUri,
      });
      console.log("Image copied to:", fileUri);

      // Request permission to access the media library (for Android)
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "You need to grant storage permission to save the image."
        );
        return;
      }

      // Save the image to the gallery
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Success", "Offline map saved to your gallery!");
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "Failed to copy the offline map.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 9.882206704068924, // Your college's latitude
          longitude: 78.08155008938367, // Your college's longitude
          latitudeDelta: 0.005, // Controls the zoom level vertically
          longitudeDelta: 0.005, // Controls the zoom level horizontally
        }}
        mapType="none" // Disables default tiles
      >
        <UrlTile
          urlTemplate="file:///android_asset/tiles/{z}/{x}/{y}.png" // For Android
          maximumZ={19}
          tileSize={256}
        />
        <UrlTile
          urlTemplate="file:///tiles/{z}/{x}/{y}.png" // For iOS
          maximumZ={19}
          tileSize={256}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Download Offline Map" onPress={handleDownload} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
  },
});

export default OfflineMap;
