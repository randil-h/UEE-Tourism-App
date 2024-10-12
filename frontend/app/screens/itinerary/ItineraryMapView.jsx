import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Config from "../../../apiConfig";
import { useLocalSearchParams } from 'expo-router';

const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_API_KEY;

export default function ItineraryMapView() {
    const { itinerary } = useLocalSearchParams();
    const [parsedItinerary, setParsedItinerary] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        try {
            const parsed = JSON.parse(itinerary);
            console.log("Parsed Itinerary:", parsed);
            setParsedItinerary(parsed);
        } catch (error) {
            console.error("Error parsing itinerary:", error);
            setErrorMessage("Failed to parse itinerary data");
        }
    }, [itinerary]);

    if (errorMessage) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        );
    }

    if (!parsedItinerary || parsedItinerary.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No itinerary data available</Text>
            </View>
        );
    }

    // Extract all places from the itinerary
    const allPlaces = parsedItinerary.flatMap(day => day.places);

    // Filter out invalid coordinates
    const validPlaces = allPlaces.filter(place =>
        typeof place.lat === 'number' &&
        typeof place.lon === 'number' &&
        !isNaN(place.lat) &&
        !isNaN(place.lon)
    );

    if (validPlaces.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No valid places found in the itinerary</Text>
            </View>
        );
    }

    // Calculate the center of the map
    const center = {
        latitude: validPlaces.reduce((sum, place) => sum + place.lat, 0) / validPlaces.length,
        longitude: validPlaces.reduce((sum, place) => sum + place.lon, 0) / validPlaces.length,
    };

    // Extract the origin (first place) and destination (last place)
    const origin = validPlaces[0];
    const destination = validPlaces[validPlaces.length - 1];

    // Waypoints exclude the first and last places
    const waypoints = validPlaces.slice(1, -1);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    ...center,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }}
            >
                {validPlaces.map((place, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: place.lat, longitude: place.lon }}
                        title={place.name}
                        description={place.location}
                    />
                ))}

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
                    optimizeWaypoints={true}
                    onStart={(params) => {
                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                        console.log(`Distance: ${result.distance} km`)
                        console.log(`Duration: ${result.duration} min.`)
                    }}
                    onError={(errorMessage) => {
                        console.error("Directions Error: ", errorMessage);
                        setErrorMessage("Failed to load directions");
                    }}
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});