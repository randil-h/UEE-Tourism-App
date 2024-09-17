import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import colorScheme from '../../assets/colors/colorScheme';
import {Feather} from "@expo/vector-icons";

const events = [
    {
        id: 1,
        title: 'Music Festival',
        date: 'Sep 18, 2024',
        description: 'A massive music festival featuring artists from around the world.',
        price: '$100',
        maxTickets: 500,
        bookBefore: 'Sep 15, 2024',
    },
    {
        id: 2,
        title: 'Art Exhibition',
        date: 'Sep 21, 2024',
        description: 'A stunning exhibition of modern art with works by leading contemporary artists.',
        price: '$50',
        maxTickets: 200,
        bookBefore: 'Sep 19, 2024',
    },
    {
        id: 3,
        title: 'Tech Conference',
        date: 'Sep 25, 2024',
        description: 'A deep dive into the latest trends in technology and innovation with expert speakers.',
        price: '$150',
        maxTickets: 300,
        bookBefore: 'Sep 23, 2024',
    },
    {
        id: 4,
        title: 'Food Expo',
        date: 'Sep 28, 2024',
        description: 'A culinary extravaganza showcasing gourmet food from top chefs and restaurants.',
        price: '$75',
        maxTickets: 400,
        bookBefore: 'Sep 26, 2024',
    },
    {
        id: 5,
        title: 'Film Screening',
        date: 'Sep 30, 2024',
        description: 'An exclusive screening of award-winning films followed by a Q&A with directors.',
        price: '$40',
        maxTickets: 150,
        bookBefore: 'Sep 28, 2024',
    },
    {
        id: 6,
        title: 'Yoga Retreat',
        date: 'Oct 02, 2024',
        description: 'A weekend retreat focused on yoga, mindfulness, and relaxation in nature.',
        price: '$200',
        maxTickets: 50,
        bookBefore: 'Sep 30, 2024',
    },
];

const EventsList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Create animated values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current; // Starts off-screen

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

    return (
        <ScrollView style={styles.container}>
            {events.map((item, index) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => openModal(item)}
                    style={[
                        styles.touchable,
                        index >= 4 && styles.lastRow // Only apply border to cards not in the last row
                    ]}
                >
                    <View style={styles.eventCard}>
                        <View style={styles.textContainer}>
                            <Text style={styles.eventDate}>{item.date}</Text>
                            <Text
                                style={styles.eventTitle}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item.title}
                            </Text>
                            {/*<Text
                                style={styles.eventDescription}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {item.description}
                            </Text>*/}
                        </View>
                        <View>
                            <View style={styles.indicator}>
                                <Feather name="arrow-up-right" size={24} color="black" />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

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
                            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                            <Text style={styles.modalDate}>{selectedEvent.date}</Text>
                            <Text style={styles.modalDescription}>{selectedEvent.description}</Text>
                            <Text style={styles.modalDetail}>Price: {selectedEvent.price}</Text>
                            <Text style={styles.modalDetail}>Max Tickets: {selectedEvent.maxTickets}</Text>
                            <Text style={styles.modalDetail}>Book Before: {selectedEvent.bookBefore}</Text>

                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 10,
        marginTop: 0,
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: colorScheme.gray_bg,
        borderBottomWidth: 1.5,
        borderColor: colorScheme.accent,
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
        borderStyle: 'solid',
        borderColor: colorScheme.accent,
    },
    indicator: {
        backgroundColor: colorScheme.accent,
        borderRadius: 50,
        padding: 4,
    },
    lastRow: {
        borderBottomWidth: 0, // Remove border for last row items
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
    eventDescription: {
        fontSize: 12,
        color: colorScheme.black,
        marginTop: 2,
    },
    touchable: {
        flex: 1,
    },
    // Modal styles
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
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colorScheme.black,
        marginBottom: 10,
    },
    modalDate: {
        fontSize: 16,
        color: colorScheme.black,
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: colorScheme.black,
        marginBottom: 10,
    },
    modalDetail: {
        fontSize: 14,
        color: colorScheme.accent,
        marginBottom: 8,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colorScheme.accent,
        borderRadius: 20,
    },
    closeButtonText: {
        color: colorScheme.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EventsList;
