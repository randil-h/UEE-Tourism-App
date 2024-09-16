import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Polyline } from 'react-native-maps';

const sampleRoutes = {
    "Route 1": [
        { latitude: 6.9271, longitude: 79.8612 }, // Colombo
        { latitude: 7.2906, longitude: 80.6337 }, // Kandy
        { latitude: 8.3114, longitude: 80.4037 }, // Anuradhapura
    ],
    "Route 2": [
        { latitude: 6.0535, longitude: 80.2210 }, // Galle
        { latitude: 6.9365, longitude: 79.8426 }, // Kalutara
        { latitude: 7.8731, longitude: 80.7718 }, // Central
    ],
    "Route 3": [
        { latitude: 9.6615, longitude: 80.0255 }, // Jaffna
        { latitude: 8.5683, longitude: 81.2335 }, // Trincomalee
        { latitude: 7.8731, longitude: 80.7718 }, // Central
    ],
};

const EventsMap = () => {
    const [selectedRoute, setSelectedRoute] = useState("Route 1");

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
                {/* Render the selected route as a polyline */}
                <Polyline
                    coordinates={sampleRoutes[selectedRoute]}
                    strokeColor="#000" // Polyline color
                    strokeWidth={6}     // Polyline thickness
                />
            </MapView>
            {/* Dropdown for selecting a route */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedRoute}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedRoute(itemValue)}
                >
                    {Object.keys(sampleRoutes).map((route) => (
                        <Picker.Item label={route} value={route} key={route} />
                    ))}
                </Picker>
            </View>
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
    pickerContainer: {
        position: 'absolute',
        top: 40,
        left: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        elevation: 2,
    },
    picker: {
        width: 150,
        height: 40,
    },
});

export default EventsMap;
