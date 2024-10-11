import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, ImageBackground, TouchableOpacity, Modal, Button, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, onSnapshot, query, orderBy, limit, doc, deleteDoc } from "@firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import ColorScheme from "../../assets/colors/colorScheme";

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);  // State to store selected event
    const [modalVisible, setModalVisible] = useState(false);  // State to control modal visibility
    const currentUser = auth.currentUser;

    React.useEffect(() => {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(5));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const eventsArray = querySnapshot.docs.map(doc => {
                const data = doc.data();

                return {
                    id: doc.id,
                    name: data.name || "Unnamed Event",
                    date: data.date || "Unknown Date",
                    imageUrl: data.imageUrl || "",
                    location: data.location?.name || "Unknown Location",
                    ticketPrice: data.ticketPrice || "0",
                    maxTickets: data.maxTickets || "N/A",
                    coordinates: data.coordinates || { latitude: 0, longitude: 0 },
                };
            });
            setEvents(eventsArray);
        });

        return () => unsubscribe();
    }, []);

    const openModal = (event) => {
        setSelectedEvent(event);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setModalVisible(false);
    };

    const deleteEvent = async (eventId) => {
        try {
            await deleteDoc(doc(db, "events", eventId));
            Alert.alert("Event deleted successfully.");
            closeModal();
        } catch (error) {
            console.error("Error deleting event: ", error);
            Alert.alert("Error deleting event.");
        }
    };

    return (
        <>
            <ScrollView horizontal contentContainerStyle={styles.container}>
                {events.map((event) => (
                    <TouchableOpacity
                        key={event.id}
                        style={styles.eventCard}
                        onPress={() => openModal(event)}  // Open modal on press
                    >
                        <View style={styles.imageContainer}>
                            <ImageBackground source={{ uri: event.imageUrl }} style={styles.image}>
                                {/* Dark overlay */}
                                <View style={styles.overlay} />

                                {/* Event content */}
                                <View style={styles.contentContainer}>
                                    <Text style={styles.title}>{event.name}</Text>

                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.location}>{event.location}</Text>
                                        <Text style={styles.date}>{event.date}</Text>
                                        <Text style={styles.ticketInfo}>Tickets: {event.maxTickets} | Price: Rs.{event.ticketPrice}</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Modal for showing event details */}
            {selectedEvent && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}  // Close modal on back press
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <ImageBackground source={{ uri: selectedEvent.imageUrl }} style={styles.modalImage}>
                                <View style={styles.modalOverlay} />

                                {/* Delete and Close Icons */}
                                <View style={styles.modalIconContainer}>
                                    <TouchableOpacity onPress={() => deleteEvent(selectedEvent.id)}>
                                        <Ionicons name="trash-outline" size={30} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={closeModal}>
                                        <Ionicons name="close-outline" size={30} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalContentContainer}>
                                    <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
                                    <Text style={styles.modalDate}>{selectedEvent.date}</Text>
                                    <Text style={styles.modalLocation}>Location: {selectedEvent.location}</Text>
                                    <Text style={styles.modalTicketInfo}>Price: Rs.{selectedEvent.ticketPrice}</Text>
                                    <Text style={styles.modalMaxTickets}>Max Tickets: {selectedEvent.maxTickets}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        height: 450,
        marginLeft: 10,
    },
    eventCard: {
        marginBottom: 20,
        marginRight: 12,
        width: 300,
        height: 350,
        backgroundColor: 'rgba(231, 245, 255, 0.8)',
        overflow: 'hidden',
        borderRadius: 25,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    contentContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    detailsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'flex-start',
    },
    location: {
        fontSize: 14,
        color: ColorScheme.gray_text,
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: ColorScheme.gray_text,
        fontStyle: 'italic',
    },
    ticketInfo: {
        fontSize: 12,
        color: ColorScheme.gray_text,
    },

    // Modal styles
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalImage: {
        width: '100%',
        height: 450,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentContainer: {
        padding: 20,
        marginHorizontal: 30,
        marginVertical: 30,
    },
    modalIconContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        zIndex: 3,
        paddingBottom: 50,
    },
    modalTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        marginTop: 50,
    },
    modalDate: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5,
    },
    modalLocation: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5,
    },
    modalTicketInfo: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5,
    },
    modalMaxTickets: {
        fontSize: 14,
        color: 'white',
        marginBottom: 10,
    },
});

export default EventsList;
