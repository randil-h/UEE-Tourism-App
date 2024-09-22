import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import colorScheme from '../../assets/colors/colorScheme';
import {AntDesign, Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { collection, getDocs, Timestamp, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ensure this path is correct

const EventsList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for events
    const [imageLoading, setImageLoading] = useState(false); // Loading state for image

    // Create animated values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current; // Starts off-screen

    // Real-time listener for events
    const fetchEvents = () => {
        const eventsCollectionRef = collection(db, "events");

        const unsubscribe = onSnapshot(eventsCollectionRef, (querySnapshot) => {
            const eventsList = querySnapshot.docs.map(doc => {
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
            setEvents(eventsList);
            setLoading(false); // Set loading to false when events are fetched
        }, (error) => {
            console.error("Error fetching events: ", error);
            Alert.alert("Error", "Failed to load events");
            setLoading(false); // Stop loading on error
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Function to handle opening the modal with the selected event
    const openModal = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);

        // Trigger the animation (fade in and elastic slide up)
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0, // Slides up to its position
                friction: 10, // Increase friction for bounciness (elastic effect)
                tension: 70, // Adjust tension for a slower or faster bounce
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Function to handle closing the modal
    const closeModal = () => {
        // Trigger the animation (fade out and slide down)
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 300, // Slides back down
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setModalVisible(false);
            setSelectedEvent(null); // Clear the event after animation completes
        });
    };

    // Function to delete an event
    const deleteEvent = async (eventId) => {
        try {
            await deleteDoc(doc(db, "events", eventId));
            Alert.alert("Success", "Event deleted successfully");
            closeModal(); // Close modal after deleting
        } catch (error) {
            console.error("Error deleting event: ", error);
            Alert.alert("Error", "Failed to delete event");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={colorScheme.accent} />
            ) : (
                events.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => openModal(item)}
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

            {/* Modal for Event Details */}
            {modalVisible && selectedEvent && (
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalBackground}>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                            ]}
                        >
                            {imageLoading && <ActivityIndicator size="small" color={colorScheme.accent} style={{alignSelf: 'center', marginTop: 100}} />}
                            <Image
                                source={{ uri: selectedEvent.imageUrl }}
                                style={styles.eventImage}
                                resizeMode="cover"
                                onLoadStart={() => setImageLoading(true)} // Show loading indicator
                                onLoadEnd={() => setImageLoading(false)} // Hide loading indicator
                            />
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            <View>
                                <Text style={styles.modalDate}>{selectedEvent.date}</Text>
                                <Text style={styles.modalLocation}>{selectedEvent.location}</Text>
                            </View>

                            <Text style={styles.modalDescription}>Tickets: {selectedEvent.maxTickets}</Text>
                            <Text style={styles.modalDescription}>Price: ${selectedEvent.ticketPrice}</Text>

                            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center', alignSelf: 'flex-end'}}>
                                {/* Delete Event Button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "Delete Event",
                                            "Are you sure you want to delete this event?",
                                            [
                                                { text: "Cancel", style: "cancel" },
                                                {
                                                    text: "Delete",
                                                    onPress: () => deleteEvent(selectedEvent.id),
                                                    style: "destructive"
                                                }
                                            ]
                                        );
                                    }}
                                    style={styles.deleteButton}
                                >
                                    <MaterialCommunityIcons name="delete-empty" size={32} color="black" />
                                </TouchableOpacity>

                                {/* Close Button */}
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <AntDesign name="close" size={32} color="black" />
                                </TouchableOpacity>
                            </View>

                        </Animated.View>
                    </View>
                </Modal>
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
    eventImage: {
        width: '100%',
        aspectRatio: 1, // This ensures height is equal to width
        marginBottom: 20,
    },

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colorScheme.white,
        padding: 20,
        borderRadius: 0,
        width: '80%',
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: colorScheme.black,
        marginBottom: 10,
    },
    modalDate: {
        fontSize: 12,
        color: colorScheme.black,
        marginBottom: 10,
    },
    modalLocation: {
        fontSize: 14,
        color: colorScheme.black,
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: colorScheme.black,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {

        borderRadius: 50,
        marginTop: 20,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 10,
        width: '100%',
        height: 1.5,
        backgroundColor: colorScheme.accent,
    },
});

export default EventsList;
