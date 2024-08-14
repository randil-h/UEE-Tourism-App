
import ColorList from "../components/ColorList";


import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import attractions from './attractions.json';

const Map = () => {

    const [location, setLocation] = useState(null);
    const [radius, setRadius] = useState(5); // default to 5 km
    const [filteredAttractions, setFilteredAttractions] = useState([]);

    const getCurrentLocation = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const currentLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
            };
            setLocation(currentLocation);
            console.log('Current location:', currentLocation);
        } catch (error) {
            console.warn(error);
            Alert.alert('Error', 'Failed to get current location');
        }
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Location permission denied');
                return;
            }

            getCurrentLocation();
        };

        requestLocationPermission();
    }, []);

    useEffect(() => {
        if (location) {
            const nearbyAttractions = attractions.attractions.filter(attraction => {
                const distance = getDistanceFromLatLonInKm(
                    location.latitude,
                    location.longitude,
                    attraction.latitude,
                    attraction.longitude
                );
                return distance <= radius;
            });
            setFilteredAttractions(nearbyAttractions);
        }
    }, [location, radius]);

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    return (
        <View>
            <ColorList color={"#d8b357"} />
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 7.8731,
                    longitude: 80.7718,
                    latitudeDelta: 2.5,
                    longitudeDelta: 2.5,
                }}
                showsUserLocation={true}  // Shows the blue dot for the user's location
                followsUserLocation={true}  // Keeps the map centered on the user's location
            >
                {filteredAttractions.map((attraction, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
                        title={attraction.name}
                        description={attraction.description}
                    />
                ))}
            </MapView>
            <View style={styles.sliderContainer}>
                <Text>Radius: {radius} km</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={500}
                    step={1}
                    value={radius}
                    onValueChange={(value) => setRadius(value)}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#1EB1FC"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});


export default Map



