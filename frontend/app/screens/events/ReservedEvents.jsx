import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import colorScheme from '../../../assets/colors/colorScheme';
import { Feather } from "@expo/vector-icons";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Ensure this path is correct

const ReservedEvents = () => {
    const [reservedEvents, setReservedEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for reserved events

    // Fetch reserved events from Firebase
    const fetchReservedEvents = async () => {
        try {
            const reservedEventsCollectionRef = collection(db, "reserved_events");
            const querySnapshot = await getDocs(reservedEventsCollectionRef);

            const reservedEventsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    date: data.date instanceof Timestamp ? data.date.toDate().toLocaleDateString() : data.date,
                    location: data.location.name, // Accessing location name
                    coordinates: data.location.coordinates, // Accessing coordinates
                    ticketPrice: data.ticketPrice,
                    maxTickets: data.maxTickets,
                    imageUrl: data.imageUrl,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString() : data.createdAt,
                };
            });

            setReservedEvents(reservedEventsList);
        } catch (error) {
            console.error("Error fetching reserved events: ", error);
            Alert.alert("Error", "Failed to load reserved events");
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    useEffect(() => {
        fetchReservedEvents();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={colorScheme.accent} />
            ) : reservedEvents.length === 0 ? (
                <Text style={styles.noEventsText}>No reserved events found.</Text>
            ) : (
                reservedEvents.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.touchable}
                    >
                        <View style={styles.eventCard}>
                            <View style={styles.textContainer}>
                                <Text style={styles.eventDate}>{item.date}</Text>
                                <Text
                                    style={styles.eventTitle}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.name}
                                </Text>
                            </View>
                            <View>
                                <View style={styles.indicator}>
                                    <Feather name="arrow-up-right" size={24} color="black" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 50,
        paddingHorizontal: 10,
        marginTop: 0,
        marginHorizontal: 20,
        marginBottom: 110,
        backgroundColor: colorScheme.gray_bg,
    },
    eventCard: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderTopWidth: 1.5,
        borderColor: colorScheme.accent,
    },
    indicator: {
        backgroundColor: colorScheme.accent,
        borderRadius: 50,
        padding: 4,
    },
    textContainer: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colorScheme.black,
        marginBottom: 1,
    },
    eventDate: {
        fontSize: 12,
        color: colorScheme.black,
    },
    noEventsText: {
        fontSize: 18,
        color: colorScheme.black,
        textAlign: 'center',
        marginTop: 100,
    },
});

export default ReservedEvents;
