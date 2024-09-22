import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { addDoc, collection } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebaseConfig";
import Config from "../../../apiConfig";
import colorScheme from "../../../assets/colors/colorScheme";
import { Divider } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddEvents = () => {
    const router = useRouter();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [locationCoordinates, setLocationCoordinates] = useState(null); // Store coordinates separately
    const [ticketPrice, setTicketPrice] = useState('');
    const [maxTickets, setMaxTickets] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
    const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;
    const googlePlacesRef = useRef(); // Reference to GooglePlacesAutocomplete

    // Handle Image Pick with aspect ratio constraint
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Ensures square image
            quality: 1,
        });

        if (!result.canceled) {
            const { width, height } = result.assets[0];
            if (width !== height) {
                Alert.alert("Invalid Image", "Please select a square image.");
                return;
            }
            setImage(result.assets[0].uri);
        }
    };

    // Save event to Firestore and upload image to Firebase Storage
    const saveEvent = async () => {
        if (!eventDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            Alert.alert("Invalid Date", "Please enter a valid date in MM/DD/YYYY format");
            return;
        }

        if (!image) {
            Alert.alert("Image Required", "Please upload an event image");
            return;
        }

        setIsLoading(true); // Show loading spinner

        try {
            const imageRef = ref(storage, `events/${new Date().getTime()}.jpg`);
            const response = await fetch(image);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            const imageUrl = await getDownloadURL(imageRef);

            const eventData = {
                name: eventName,
                date: eventDate,
                location: {
                    name: location,
                    coordinates: locationCoordinates, // Save coordinates as well
                },
                ticketPrice,
                maxTickets,
                imageUrl,
                createdAt: new Date(),
            };

            await addDoc(collection(db, "events"), eventData);
            Alert.alert("Success", "Event saved successfully!");
        } catch (error) {
            console.error("Error saving event: ", error);
            Alert.alert("Error", "Failed to save event");
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.scrollView}
            enableOnAndroid={true}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.headerTitle}>Add an Event</Text>
                        <Text style={styles.headerSubtitle}>Fill the below form</Text>
                        <Divider style={{ marginBottom: 30 }} />
                    </View>
                    {/* Save Button */}
                    <TouchableOpacity onPress={saveEvent} style={styles.button} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <FontAwesome6 name="save" size={20} color="black" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Event Name */}
                <Text style={styles.label}>Event Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter event name"
                    placeholderTextColor={colorScheme.gray_text} // Placeholder color
                    value={eventName}
                    onChangeText={setEventName}
                />

                {/* Location (Google Places) */}
                <Text style={styles.label}>Location</Text>
                <GooglePlacesAutocomplete
                    ref={googlePlacesRef}
                    placeholder="Search for a location"
                    onPress={(data, details = null) => {
                        setLocation(data.description);
                        googlePlacesRef.current.setAddressText(data.description); // Update the input text with the selected location
                        if (details) {
                            const { lat, lng } = details.geometry.location;
                            setLocationCoordinates({ lat, lng });
                        }
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                    }}
                    fetchDetails={true} // This ensures you get more than just the name
                    styles={{
                        textInput: {
                            backgroundColor: colorScheme.gray_bg,
                            borderRadius: 0,
                            borderColor: colorScheme.accent,
                            borderBottomWidth: 1.5
                        },
                        listView: { borderRadius: 0, marginTop: 0 },
                    }}
                />

                {/* Ticket Price */}
                <Text style={styles.label}>Ticket Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter ticket price"
                    placeholderTextColor={colorScheme.gray_text} // Placeholder color
                    keyboardType="numeric"
                    value={ticketPrice}
                    onChangeText={setTicketPrice}
                />

                {/* Max Tickets */}
                <Text style={styles.label}>Max Number of Tickets</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max number of tickets"
                    placeholderTextColor={colorScheme.gray_text} // Placeholder color
                    keyboardType="numeric"
                    value={maxTickets}
                    onChangeText={setMaxTickets}
                />

                {/* Event Date (Text Input with Validation) */}
                <Text style={styles.label}>Event Date (MM/DD/YYYY)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter event date"
                    placeholderTextColor={colorScheme.gray_text} // Placeholder color
                    value={eventDate}
                    onChangeText={setEventDate}
                />

                {/* Image Upload */}
                <Text style={styles.label}>Event Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : <Text>Pick an image (Square)</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: colorScheme.gray_bg,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
    },
    container: {
        flex: 1,
        marginBottom: 40,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0, // px-6
        paddingVertical: 0, // py-2
        marginTop: 0, // mt-4
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 40,
        paddingTop: 0,
    },
    headerSubtitle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 16,
        color: colorScheme.gray_text,
    },
    label: {
        fontSize: 20,
        marginVertical: 10,
        marginLeft: 10,
        fontWeight: 'bold',
        color: colorScheme.black,
    },
    input: {
        borderBottomWidth: 1.5,
        borderColor: colorScheme.accent,
        borderRadius: 0,
        padding: 12,
        fontSize: 16,
    },
    imagePicker: {
        borderBottomWidth: 1.5,
        borderColor: colorScheme.accent,
        borderRadius: 0,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginVertical: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 0,
    },
    button: {
        backgroundColor: colorScheme.accent,
        padding: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
    },
});

export default AddEvents;
