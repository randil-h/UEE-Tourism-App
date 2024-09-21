import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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
                {allPlaces.map((place, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: place.lat, longitude: place.lon }}
                        title={place.name}
                        description={place.location}
                    />
                ))}
                <Polyline
                    coordinates={allPlaces.map(place => ({
                        latitude: place.lat,
                        longitude: place.lon
                    }))}
                    strokeColor="#000"
                    strokeWidth={2}
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