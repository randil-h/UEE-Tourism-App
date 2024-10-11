import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

const SavedItinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch saved itineraries from Firestore
    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'itineraries'));
                const fetchedItineraries = [];
                querySnapshot.forEach((doc) => {
                    fetchedItineraries.push({ id: doc.id, ...doc.data() });
                });
                setItineraries(fetchedItineraries);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItineraries();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Loading itineraries...</Text>
            </View>
        );
    }

    if (itineraries.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No saved itineraries found.</Text>
            </View>
        );
    }

    const handleViewItinerary = (itinerary) => {
        router.push({
            pathname: '/screens/itinerary/ItineraryDisplay',
            params: {
                itinerary: JSON.stringify(itinerary.itinerary),
                touristType: itinerary.touristType,
                hideSaveButton: true // Pass hideSaveButton as true
            }
        });
    };

    const getStartAndEndLocation = (itinerary) => {
        const startLocation = itinerary[0]?.places?.[0]?.location || 'Unknown';
        const lastDay = itinerary[itinerary.length - 1];
        const endLocation = lastDay?.places?.[lastDay.places.length - 1]?.location || 'Unknown';
        return { startLocation, endLocation };
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Saved Itineraries</Text>
            {itineraries.map((itinerary) => {
                const { startLocation, endLocation } = getStartAndEndLocation(itinerary.itinerary);
                return (
                    <TouchableOpacity
                        key={itinerary.id}
                        style={styles.itineraryCard}
                        onPress={() => handleViewItinerary(itinerary)}
                    >
                        <View style={styles.itineraryInfo}>
                            <Text style={styles.itineraryTitle}>From {startLocation}</Text>
                            <Text style={styles.itineraryTitle}>To {endLocation}</Text>
                            <Text style={styles.itineraryDate}>Saved on: {new Date(itinerary.timestamp).toLocaleDateString()}</Text>
                        </View>
                        <Icon name="chevron-forward-outline" size={24} color="black" />
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7', // Light background color for a clean look
        padding: 20,
    },
    title: {
        fontSize: 28, // Increased font size for better visual impact
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 30,
        color: '#333', // Darker shade for better contrast
    },
    itineraryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff', // Pure white for card background
        padding: 20, // Slightly more padding for a spacious feel
        borderRadius: 15, // Softer, more rounded corners
        marginBottom: 15, // More spacing between cards
        shadowColor: '#000',

        shadowRadius: 10,
        elevation: 5, // Elevation for Android to create depth
        borderColor: '#e0e0e0', // Subtle border to separate cards from background
        borderWidth: 1,
    },
    itineraryInfo: {
        flexDirection: 'column',
        maxWidth: '85%', // Limit text width to prevent overflow
    },
    itineraryTitle: {
        fontSize: 18,
        fontWeight: '600', // Slightly lighter than bold for a cleaner look
        color: '#2c3e50', // Darker, neutral color for better readability
        marginBottom: 5, // Spacing between title and other text
    },
    itineraryDate: {
        fontSize: 14,
        color: '#7f8c8d', // Gray tone for less emphasis
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d', // Muted color for subtlety
    },
});


export default SavedItinerary;
