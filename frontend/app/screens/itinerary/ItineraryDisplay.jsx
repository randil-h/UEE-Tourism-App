import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, SafeAreaView, Button, TouchableOpacity, Alert} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from 'firebase/firestore';

const ItineraryDisplay = () => {
    const router = useRouter();
    const route = useRoute();
    const { itinerary, touristType } = route.params || {};
    const [saving, setSaving] = useState(false);

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
    const saveItineraryToFirestore = async () => {
        setSaving(true);
        try {
            await addDoc(collection(db, 'itineraries'), {
                itinerary: parsedItinerary,
                touristType: touristType,
                timestamp: new Date().toISOString(),
            });
            Alert.alert('Success', 'Itinerary saved successfully!');
        } catch (error) {
            console.error('Error saving itinerary:', error);
            Alert.alert('Error', 'Failed to save itinerary.');
        } finally {
            setSaving(false);
        }
    };
    const handleViewRoute = () => {
        router.push({
            pathname: '/screens/itinerary/ItineraryMapView',
            params: { itinerary: JSON.stringify(parsedItinerary), touristType }
        });
    };

    const generatePDF = async () => {
        let htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; }
                    .day-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
                    .place-card { margin-bottom: 20px; }
                    .place-name { font-size: 16px; font-weight: bold; }
                    .place-info { font-size: 14px; }
                </style>
            </head>
            <body>
                <h1>My Itinerary</h1>
        `;

        parsedItinerary.forEach((day) => {
            htmlContent += `
                <div class="day-title">Day ${day.day}</div>
                ${day.places && day.places.length > 0
                ? day.places.map(place => `
                        <div class="place-card">
                            <div class="place-name">${place.name || 'Name not available'}</div>
                            <div class="place-info">${place.location || 'Location not available'}</div>
                            <div class="place-info">Ticket price: ${touristType} - ${place.ticketPrice || 'N/A'} LKR</div>
                        </div>
                    `).join('')
                : '<div>No places scheduled for this day.</div>'
            }
            `;
        });

        htmlContent += `</body></html>`;

        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            console.log('PDF generated at:', uri);

            // Save or share the file
            await FileSystem.moveAsync({
                from: uri,
                to: `${FileSystem.documentDirectory}itinerary.pdf`,
            });

            const pdfUri = `${FileSystem.documentDirectory}itinerary.pdf`;
            console.log('PDF saved at:', pdfUri);

            // Optional: Share the PDF file
            await Sharing.shareAsync(pdfUri);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>My Itinerary</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.buttonLeft} onPress={handleViewRoute}>
                        <Text style={styles.buttonText}>View Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRight} onPress={generatePDF}>
                        <Text style={styles.buttonText}>Download</Text>
                        <Icon name="save-outline" size={20} color="white" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                {/* Save Itinerary Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveItineraryToFirestore}
                    disabled={saving} // Disable button while saving
                >
                    <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Itinerary'}</Text>
                </TouchableOpacity>

                {parsedItinerary.map((day, index) => (
                    <View key={index} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>Day {day.day}</Text>
                        {day.places && day.places.length > 0 ? (
                            day.places.map((place, i) => (
                                <View key={i} style={styles.card}>
                                    <Image
                                        source={place.image}
                                        style={styles.placeImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.overlay}>
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
        paddingTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        marginBottom: 10,
        position: 'relative', // Ensure the overlay is positioned relative to the card
    },
    placeImage: {
        height: 200, // Increased height of the image
        width: '100%',
        borderRadius: 10,
    },
    overlay: {
        position: 'absolute',
        bottom: 0, // Position at the bottom of the image
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black overlay for text background
        borderBottomLeftRadius: 10, // Matching the image's border radius
        borderBottomRightRadius: 10,
    },
    placeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white', // White text color for visibility
        textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better readability
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    location: {
        fontSize: 14,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    ticketPrice: {
        fontSize: 14,
        color: 'white',
        marginTop: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    noPlacesText: {
        fontStyle: 'italic',
        textAlign: 'center',
    },
    icon: {
        marginLeft: 5, // Space between icon and text
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
    saveButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 10,
        marginVertical: 1,
        paddingHorizontal: 10,
        marginHorizontal: 20, // Add margin for spacing
        alignSelf: 'flex-start', // Align to the left
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLeft: {
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonRight: {
        backgroundColor: 'black',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
});
export default ItineraryDisplay;