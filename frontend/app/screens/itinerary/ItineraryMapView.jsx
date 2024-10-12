import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Config from "../../../apiConfig";
import { useLocalSearchParams } from 'expo-router';

const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_API_KEY;

export default function ItineraryMapView() {
    const { itinerary } = useLocalSearchParams();
    const parsedItinerary = JSON.parse(itinerary);

    // Extract all places from the itinerary
    const allPlaces = parsedItinerary.flatMap(day => day.places);

    // Calculate the center of the map
    const center = {
        latitude: allPlaces.reduce((sum, place) => sum + place.lat, 0) / allPlaces.length,
        longitude: allPlaces.reduce((sum, place) => sum + place.lon, 0) / allPlaces.length,
    };

    // Extract the origin (first place) and destination (last place)
    const origin = allPlaces[0];
    const destination = allPlaces[allPlaces.length - 1];

    // Waypoints exclude the first and last places
    const waypoints = allPlaces.slice(1, -1);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    ...center,
                    latitudeDelta: 2,
                    longitudeDelta: 2,
                }}
                provider="google"
            >
                {/* Markers for each place */}
                {allPlaces.map((place, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: place.lat, longitude: place.lon }}
                        title={place.name}
                        description={place.location}
                    />
                ))}

                {/* Direct
                ions between places */}
                <MapViewDirections
                    origin={{ latitude: origin.lat, longitude: origin.lon }}
                    destination={{ latitude: destination.lat, longitude: destination.lon }}
                    waypoints={waypoints.map(waypoint => ({
                        latitude: waypoint.lat,
                        longitude: waypoint.lon
                    }))}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={4}
                    strokeColor="#1e90ff"
                    optimizeWaypoints={true}  // Optimizes the route
                    onError={(errorMessage) => console.error("Directions Error: ", errorMessage)}
                />

            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
