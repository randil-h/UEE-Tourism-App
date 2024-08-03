import React, { useEffect, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import attractions from './attractions.json';

const MapPage = () => {
    const [location, setLocation] = useState(null);

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setLocation(currentLocation);
                console.log('Current location:', currentLocation);
                
                // Toast the current location
                Toast.show({
                    type: 'info',
                    text1: 'Current Location',
                    text2: `Lat: ${currentLocation.latitude.toFixed(4)}, Lon: ${currentLocation.longitude.toFixed(4)}`,
                    position: 'bottom',
                    visibilityTime: 4000,
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40,
                });
            },
            (error) => {
                console.warn(error.code, error.message);
                Alert.alert('Error', 'Failed to get current location');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                Geolocation.requestAuthorization('whenInUse');
                getCurrentLocation();
            } else if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'This app needs access to your location to show your current position on the map.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getCurrentLocation();
                    } else {
                        Alert.alert('Location permission denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };

        requestLocationPermission();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 7.8731,
                    longitude: 80.7718,
                    latitudeDelta: 2.5,
                    longitudeDelta: 2.5,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {attractions.attractions.map((attraction, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
                        title={attraction.name}
                        description={attraction.description}
                    />
                ))}
            </MapView>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapPage;