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
import ColorScheme from "../../../assets/colors/colorScheme";

const ItineraryDisplay = () => {
    const router = useRouter();
    const route = useRoute();
    const { itinerary, touristType, hideSaveButton } = route.params || {};
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
                <Text style={styles.subtitle}>Your personalized travel plan</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={handleViewRoute}>
                        <Text style={styles.buttonText}>View Route</Text>
                    </TouchableOpacity>

                    {/* Conditionally render the save button */}
                    {!hideSaveButton && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={saveItineraryToFirestore}
                            disabled={saving} // Disable button while saving
                        >
                            <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Itinerary'}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.iconButton} onPress={generatePDF}>
                        <Icon name="download-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>

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
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
        marginTop:20,
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 30,
    },
    dayContainer: {
        marginBottom: 20,
        padding: 10,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        marginBottom: 10,
        position: 'relative',
    },
    placeImage: {
        height: 200,
        width: '100%',
        borderRadius: 25,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        padding: 20,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
    },
    placeName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align buttons to the left
        paddingHorizontal: 20,
        marginBottom: 20,
        marginRight: 4,
    },
    button: {
        backgroundColor: ColorScheme.black,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5, // Add spacing between buttons
    },

    iconButton: {
        backgroundColor:  ColorScheme.black,
        borderRadius: 30,
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
});
export default ItineraryDisplay;
