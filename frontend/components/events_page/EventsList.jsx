import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';

const events = [
    {
        id: 1,
        title: 'Music Festival',
        date: 'Sep 18, 2024',
        description: 'A massive music festival featuring artists from around the world.',
    },
    {
        id: 2,
        title: 'Art Exhibition',
        date: 'Sep 21, 2024',
        description: 'A stunning exhibition of modern art with works by leading contemporary artists.',
    },
    {
        id: 3,
        title: 'Tech Conference',
        date: 'Sep 25, 2024',
        description: 'A deep dive into the latest trends in technology and innovation with expert speakers.',
    },
    {
        id: 4,
        title: 'Food Expo',
        date: 'Sep 28, 2024',
        description: 'A culinary extravaganza showcasing gourmet food from top chefs and restaurants.',
    },
    {
        id: 5,
        title: 'Film Screening',
        date: 'Sep 30, 2024',
        description: 'An exclusive screening of award-winning films followed by a Q&A with directors.',
    },
];

const EventsList = ({ color }) => {
    return (
        <ScrollView style={styles.container}>
            {events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                    <View style={styles.textContainer}>
                        <Text style={styles.eventDate}>{event.date}</Text>
                        <Text style={[styles.eventTitle]}>{event.title}</Text>
                        <Text
                            style={styles.eventDescription}
                            numberOfLines={1} // Limit to one line
                            ellipsizeMode="tail" // Show ellipsis at the end
                        >
                            {event.description}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        marginTop: 0,
        borderBottomWidth: 1.5,
        borderStyle: 'solid',
        borderColor: '#718e57',
        backgroundColor: '#d5f1ba',
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1.5,
        borderStyle: 'solid',
        borderColor: '#718e57',
    },
    textContainer: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#365712', // Static color (Tomato color)
        marginBottom: 1,
    },
    eventDate: {
        fontSize: 12,
        color: '#5e8139',
    },
    eventDescription: {
        fontSize: 12,
        color: '#5e8139',
        marginTop: 2,
    },
});

export default EventsList;
