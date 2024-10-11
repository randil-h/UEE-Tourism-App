import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import colorScheme from '../../../assets/colors/colorScheme';
import {Feather, FontAwesome6, MaterialCommunityIcons} from "@expo/vector-icons";
import { collection, getDocs, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Ensure this path is correct
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ColorScheme from "../../../assets/colors/colorScheme";


const ReservedEvents = () => {
    const [reservedEvents, setReservedEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for reserved events
    const [isUnreserving, setIsUnreserving] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

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

    const generatePDF = async () => {
        try {
            const htmlContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                            th { background-color: ${colorScheme.accent}; color: white; }
                        </style>
                    </head>
                    <body>
                        <h1>Reserved Events Report</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Ticket Price</th>
                                    <th>Max Tickets</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reservedEvents.map(event => `
                                    <tr>
                                        <td>${event.name}</td>
                                        <td>${event.date}</td>
                                        <td>${event.location}</td>
                                        <td>$${event.ticketPrice}</td>
                                        <td>${event.maxTickets}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Sharing the PDF file
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Error generating PDF: ", error);
            Alert.alert("Error", "Failed to generate PDF report");
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
                <>
                    <TouchableOpacity onPress={generatePDF} style={styles.button} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={ColorScheme.gray_bg} />
                        ) : (
                            <FontAwesome6 name="save" size={20} color={ColorScheme.gray_bg} />
                        )}
                    </TouchableOpacity>
                    {reservedEvents.map((item) => (
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
                    ))}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: 10,
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 20,
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
    generateReportButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colorScheme.accent,
        borderRadius: 5,
        alignItems: 'center',
    },
    generateReportText: {
        color: 'white',
        fontSize: 18,
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
    button: {
        backgroundColor: colorScheme.black,
        padding: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 0,
        marginBottom: 20,
        marginRight: 10,
    },
});

export default ReservedEvents;
