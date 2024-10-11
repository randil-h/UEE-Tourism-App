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
            pathname: '/screens/itinerary/ItineraryDisplay', // You can change the path if you want a different detail view
            params: { itinerary: JSON.stringify(itinerary.itinerary), touristType: itinerary.touristType }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Saved Itineraries</Text>
            {itineraries.map((itinerary) => (
                <TouchableOpacity
                    key={itinerary.id}
                    style={styles.itineraryCard}
                    onPress={() => handleViewItinerary(itinerary)}
                >
                    <View style={styles.itineraryInfo}>
                        <Text style={styles.itineraryTitle}>Itinerary for {itinerary.touristType} Tourist</Text>
                        <Text style={styles.itineraryDate}>Saved on: {new Date(itinerary.timestamp).toLocaleDateString()}</Text>
                    </View>
                    <Icon name="chevron-forward-outline" size={24} color="black" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    itineraryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    itineraryInfo: {
        flexDirection: 'column',
    },
    itineraryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itineraryDate: {
        fontSize: 14,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SavedItinerary;
