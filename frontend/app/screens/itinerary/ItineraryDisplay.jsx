import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet, SafeAreaView, Button, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';

const ItineraryDisplay = () => {
    const route = useRoute();
    const { itinerary, touristType } = route.params || {};

    console.log('Received Itinerary:', JSON.stringify(itinerary, null, 2));
    console.log('Received Tourist Type:', touristType);

    if (!itinerary) {
        console.log('No itinerary available');
        return <Text style={styles.errorText}>No itinerary available. Please try again.</Text>;
    }

    let parsedItinerary = itinerary;
    if (typeof itinerary === 'string') {
        try {
            parsedItinerary = JSON.parse(itinerary);
        } catch (error) {
            console.error('Error parsing itinerary:', error);
            return <Text style={styles.errorText}>Error parsing itinerary. Please try again.</Text>;
        }
    }

    console.log('Parsed Itinerary:', JSON.stringify(parsedItinerary, null, 2));

    if (!Array.isArray(parsedItinerary) || parsedItinerary.length === 0) {
        console.log('Invalid itinerary format');
        return <Text style={styles.errorText}>Invalid itinerary format. Please try again.</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>My Itinerary</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('RouteMap', { itinerary });
                    }}
                >
                    <Text style={styles.buttonText}>View Route</Text>
                </TouchableOpacity>
                {parsedItinerary.map((day, index) => (
                    <View key={index} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>Day {day.day}</Text>
                        {day.places && day.places.length > 0 ? (
                            day.places.map((place, i) => (
                                <View key={i} style={styles.card}>
                                    <Image
                                        source={place.image} // Use the image source directly
                                        style={styles.placeImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.placeName}>{place.name || 'Name not available'}</Text>
                                        <Text style={styles.location}>{place.location || 'Location not available'}</Text>
                                        <Text style={styles.ticketPrice}>
                                            Ticket price: {touristType} - {place.ticketPrice || 'N/A'} LKR
                                        </Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noPlacesText}>No places scheduled for this day.</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        textAlign: 'center',
    },
    dayContainer: {
        marginBottom: 20,
        padding: 10,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    placeImage: {
        height: 150,
        width: '100%',
    },
    imagePlaceholder: {
        height: 150,
        backgroundColor: '#ddd',
    },
    cardContent: {
        padding: 10,
    },
    placeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    ticketPrice: {
        fontSize: 14,
        marginTop: 5,
    },
    noPlacesText: {
        fontStyle: 'italic',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
    button: {
        backgroundColor: 'black',
        borderRadius: 20, // Round button
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 20,
        width: '40%',
        marginLeft:20,

    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ItineraryDisplay;