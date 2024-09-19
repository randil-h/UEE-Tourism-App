import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ItineraryDisplay = () => {
    const route = useRoute();
    const { itinerary, touristType } = route.params || {};

    console.log('Received Itinerary:', JSON.stringify(itinerary, null, 2));
    console.log('Received Tourist Type:', touristType);

    if (!itinerary) {
        return <Text style={styles.errorText}>No itinerary available. Please try again.</Text>;
    }

    let parsedItinerary;
    try {
        parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    } catch (error) {
        console.error('Error parsing itinerary:', error);
        return <Text style={styles.errorText}>Error displaying itinerary. Please try again.</Text>;
    }

    if (!Array.isArray(parsedItinerary) || parsedItinerary.length === 0) {
        return <Text style={styles.errorText}>Invalid itinerary format. Please try again.</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Your {touristType} Itinerary</Text>
            {parsedItinerary.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayTitle}>Day {day.day}</Text>
                    {day.places && day.places.length > 0 ? (
                        day.places.map((place, i) => (
                            <View key={i} style={styles.placeContainer}>
                                {place.image && (
                                    <Image
                                        source={{ uri: place.image }}
                                        style={styles.image}
                                        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                                    />
                                )}
                                <Text style={styles.placeName}>{place.name || 'Name not available'}</Text>
                                <Text>Location: {place.location || 'Location not available'}</Text>
                                <Text>Ticket Price: {place.ticketPrice || 'Price not available'}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noPlacesText}>No places scheduled for this day.</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dayContainer: {
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    placeContainer: {
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    placeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noPlacesText: {
        fontStyle: 'italic',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default ItineraryDisplay;