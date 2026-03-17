import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler'; 
import DrawerNavigation from './src/navigation/DrawerNavigation'; // Correct path
import LoginScreen from './src/screens/LoginScreen';
import StudentOrFacultyScreen from './src/screens/StudentOrFacultyScreen';
import ParentOrVisitorScreen from './src/screens/ParentOrVisitorScreen';
import CampusMapScreen from './src/screens/CampusMapScreen';
import LocationDetailsScreen from './src/screens/LocationDetailsScreen';
import DepartmentDetails from './src/screens/DepartmentDetails';
import TurnByTurnNotification from './src/screens/TurnByTurnNotification'; // Import TurnByTurnNotification screen
import WashroomScreen from './src/screens/WashroomScreen';
import FemaleWashroomScreen from './src/screens/FemaleWashroomScreen';
import MaleWashroomScreen from './src/screens/MaleWashroomScreen';
import WashroomDetailsScreen from './src/screens/WashroomDetailsScreen';
import Favorites from './src/screens/Favorites';
import Classroom from './src/screens/Classroom';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    let isMounted = true;

    const initAsync = async () => {
      // Delay native module access until the runtime is fully ready.
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const FileSystem = await import('expo-file-system');
        const baseDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
        if (baseDir) {
          const tileDirectory = `${baseDir}tiles/`;
          await FileSystem.makeDirectoryAsync(tileDirectory, { intermediates: true });
        }
      } catch (_e) {
        // Best-effort: tile caching shouldn't block app boot.
      }

      try {
        const Notifications = await import('expo-notifications');

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions not granted!');
        }
      } catch (_e) {
        // Expo Go / platform limitations: don't crash app.
      }
    };

    initAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentOrFacultyScreen" component={StudentOrFacultyScreen} />
        <Stack.Screen name="ParentOrVisitorScreen" component={ParentOrVisitorScreen} />

        {/* Home Drawer Navigation */}
        <Stack.Screen 
          name="HomeDrawer" 
          component={DrawerNavigation} 
          options={{ headerShown: false }} // Hide header for drawer
        />

        {/* Washroom Screen */}
        <Stack.Screen 
          name="WashroomScreen" 
          component={WashroomScreen} 
          options={{ title: 'Washroom Selection' }} 
        />

        {/* Washroom screens for female and male washrooms */}
        <Stack.Screen name="FemaleWashroom" component={FemaleWashroomScreen} options={{ title: 'Female Washrooms' }} />
        <Stack.Screen name="MaleWashroom" component={MaleWashroomScreen} options={{ title: 'Male Washrooms' }} />

        {/* Washroom Details Screen */}
        <Stack.Screen name="WashroomDetails" component={WashroomDetailsScreen} options={{ title: 'Washroom Details' }} />

        {/* Campus Map Screen */}
        <Stack.Screen 
          name="CampusMap" 
          component={CampusMapScreen} 
          options={{ title: 'Campus Map' }} 
        />

        {/* Location Details Screen */}
        <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} options={{ title: 'Location Details' }} />
        <Stack.Screen name="Classroom" component={Classroom} />
        {/* Turn-by-Turn Notification Screen */}
        <Stack.Screen 
          name="TurnByTurnNotification" 
          component={TurnByTurnNotification} 
          options={{ title: 'Turn-by-Turn Notifications' }} 
        />

        {/* Favorites Screen */}
        <Stack.Screen name="Favorites" component={Favorites} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
