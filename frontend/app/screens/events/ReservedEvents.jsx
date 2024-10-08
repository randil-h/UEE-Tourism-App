import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import colorScheme from '../../../assets/colors/colorScheme';
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, getDocs, Timestamp, deleteDoc, doc } from "firebase/firestore";
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

    const [isUnreserving, setIsUnreserving] = useState(false);

    const unreserveEvent = (eventId) => {
        if (isUnreserving) return; // Prevent multiple triggers if already unreserving
        setIsUnreserving(true); // Set flag to indicate unreserving is in progress

        Alert.alert(
            "Unreserve Event",
            "Are you sure you want to unreserve this event?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => setIsUnreserving(false), // Reset flag if canceled
                },
                {
                    text: "Unreserve",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "reserved_events", eventId));
                            Alert.alert("Success", "Event unreserved successfully");
                            fetchReservedEvents(); // Fetch updated list
                        } catch (error) {
                            console.error("Error unreserving event: ", error);
                            Alert.alert("Error", "Failed to unreserve event");
                        } finally {
                            setIsUnreserving(false); // Reset flag after completion
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
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
                    <View key={item.id} style={styles.eventCard}>
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
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.unreserveButton}
                                onPress={() => {
                                    unreserveEvent(item.id);
                                }}
                            >
                                <MaterialCommunityIcons name="delete-outline" size={24} color="black" />

                            </TouchableOpacity>
                            <View style={styles.indicator}>
                                <Feather name="arrow-up-right" size={24} color="black" />
                            </View>
                        </View>
                    </View>
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
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderTopWidth: 1.5,
        borderColor: colorScheme.accent,
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
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    unreserveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorScheme.accent,
        padding: 5,
        borderRadius: 25,
    },
    unreserveText: {
        marginLeft: 5,
        fontSize: 16,
        color: colorScheme.black,
    },
    indicator: {
        backgroundColor: colorScheme.accent,
        borderRadius: 50,
        padding: 4,
    },
    noEventsText: {
        fontSize: 18,
        color: colorScheme.black,
        textAlign: 'center',
        marginTop: 100,
    },
});

export default ReservedEvents;
