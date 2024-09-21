import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { addDoc, collection } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../firebaseConfig";

const AddEvents = () => {
    const router = useRouter();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [maxTickets, setMaxTickets] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    // Handle Image Pick
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Ensure square image
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Save event to Firestore and upload image to Firebase Storage
    const saveEvent = async () => {
        if (!image) {
            Alert.alert("Image Required", "Please upload an event image");
            return;
        }

        try {
            // Upload image to Firebase Storage
            const imageRef = ref(storage, `events/${new Date().getTime()}_${auth.currentUser.uid}.jpg`);
            const response = await fetch(image); // Convert the image to a blob
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            // Get the image URL from Firebase Storage
            const imageUrl = await getDownloadURL(imageRef);

            // Save event data to Firestore
            const eventData = {
                name: eventName,
                date: eventDate,
                location,
                ticketPrice,
                maxTickets,
                imageUrl, // Store image URL
                createdBy: auth.currentUser.uid,
                createdAt: new Date(),
            };

            await addDoc(collection(db, "events"), eventData);

            Alert.alert("Success", "Event saved successfully!");
            router.push('/success');
        } catch (error) {
            console.error("Error saving event: ", error);
            Alert.alert("Error", "Failed to save event");
        }
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || eventDate;
        setShowPicker(false);
        setEventDate(currentDate);
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {/* Event Name */}
                <Text style={styles.label}>Event Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter event name"
                    value={eventName}
                    onChangeText={setEventName}
                />

                {/* Image Upload */}
                <Text style={styles.label}>Event Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : <Text>Pick an image (Square)</Text>}
                </TouchableOpacity>

                {/* Event Date */}
                <Text style={styles.label}>Event Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text style={styles.input}>{eventDate.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={eventDate}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}

                {/* Location (Google Places) */}
                <Text style={styles.label}>Location</Text>
                <GooglePlacesAutocomplete
                    placeholder="Search for a location"
                    onPress={(data) => setLocation(data.description)}
                    query={{
                        key: 'YOUR_GOOGLE_PLACES_API_KEY',
                        language: 'en',
                    }}
                    styles={{ textInput: styles.input }}
                />

                {/* Map Selection (optional) */}
                <TouchableOpacity onPress={() => router.push('screens/events/EventsMap')} style={styles.mapViewContainer}>
                    <MapView
                        style={styles.mapView}
                        initialRegion={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    />
                </TouchableOpacity>

                {/* Ticket Price */}
                <Text style={styles.label}>Ticket Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter ticket price"
                    keyboardType="numeric"
                    value={ticketPrice}
                    onChangeText={setTicketPrice}
                />

                {/* Max Tickets */}
                <Text style={styles.label}>Max Number of Tickets</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max number of tickets"
                    keyboardType="numeric"
                    value={maxTickets}
                    onChangeText={setMaxTickets}
                />

                {/* Save Button */}
                <TouchableOpacity onPress={saveEvent} style={styles.button}>
                    <Text style={styles.buttonText}>Save Event</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#fff',
        padding: 20,
    },
    container: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginVertical: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 8, // Ensures square image
    },
    mapViewContainer: {
        marginVertical: 20,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
    },
    mapView: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddEvents;
