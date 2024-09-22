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
import Config from "../../../apiConfig";
import colorScheme from "../../../assets/colors/colorScheme";

const AddEvents = () => {
    const router = useRouter();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [maxTickets, setMaxTickets] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

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
        if (!image) {
            Alert.alert("Image Required", "Please upload an event image");
            return;
        }

        try {
            const imageRef = ref(storage, `events/${new Date().getTime()}.jpg`);
            const response = await fetch(image);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            const imageUrl = await getDownloadURL(imageRef);

            const eventData = {
                name: eventName,
                date: eventDate,
                location,
                ticketPrice,
                maxTickets,
                imageUrl,
                createdAt: new Date(),
            };

            await addDoc(collection(db, "events"), eventData);
            Alert.alert("Success", "Event saved successfully!");
            router.push('/success'); // Redirect after successful save
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

                {/* Location (Google Places) */}
                <Text style={styles.label}>Location</Text>
                <GooglePlacesAutocomplete
                    placeholder="Search for a location"
                    onPress={(data) => setLocation(data.description)}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                    }}
                    styles={{
                        textInput: {backgroundColor: colorScheme.gray_bg, borderRadius: 0, borderColor: colorScheme.accent, borderBottomWidth: 1.5},
                        listView: { borderRadius: 0, marginTop: 0 }, // Add this for better styling,
                    }}
                />

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

                {/* Image Upload */}
                <Text style={styles.label}>Event Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : <Text>Pick an image (Square)</Text>}
                </TouchableOpacity>

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
        backgroundColor: colorScheme.gray_bg,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
    },
    container: {
        flex: 1,
    },
    label: {
        fontSize: 24,
        marginVertical: 10,
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
        borderRadius: 0, // Ensures square image
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
        backgroundColor: colorScheme.accent,
        padding: 15,
        borderRadius: 0,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddEvents;
