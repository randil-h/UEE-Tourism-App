import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Picker } from '@react-native-picker/picker';
import colorScheme from '../../../assets/colors/colorScheme';
import Config from "../../../apiConfig";

const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_API_KEY;

const sampleRoutes = {
    "Route 1": {
        start: { latitude: 6.9271, longitude: 79.8612 }, // Colombo
        waypoints: [
            { latitude: 7.2906, longitude: 80.6337 }, // Kandy
        ],
        end: { latitude: 8.3114, longitude: 80.4037 } // Anuradhapura
    },
    "Route 2": {
        start: { latitude: 6.0535, longitude: 80.2210 }, // Galle
        waypoints: [
            { latitude: 6.9365, longitude: 79.8426 }, // Kalutara
        ],
        end: { latitude: 7.8731, longitude: 80.7718 } // Central
    },
    "Route 3": {
        start: { latitude: 9.6615, longitude: 80.0255 }, // Jaffna
        waypoints: [
            { latitude: 8.5683, longitude: 81.2335 } // Trincomalee
        ],
        end: { latitude: 7.8731, longitude: 80.7718 } // Central
    },
};

const EventsMap = () => {
    const [selectedRoute, setSelectedRoute] = useState("Route 1");
    const route = sampleRoutes[selectedRoute];

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
                followsUserLocation={false}
            >
                {/* Render route dynamically */}
                <MapViewDirections
                    origin={route.start}
                    waypoints={route.waypoints}
                    destination={route.end}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={6}
                    strokeColor={colorScheme.accent}
                    optimizeWaypoints={true}
                />
                <Marker coordinate={route.start} title="Start" />
                <Marker coordinate={route.end} title="End" />
                {route.waypoints.map((wp, index) => (
                    <Marker key={index} coordinate={wp} title={`Waypoint ${index + 1}`} />
                ))}
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
