import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
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
    const [locationCoordinates, setLocationCoordinates] = useState(null);
    const [ticketPrice, setTicketPrice] = useState('');
    const [maxTickets, setMaxTickets] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility for map
    const [selectedLocation, setSelectedLocation] = useState(null); // Store selected location

    const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

    // Handle Image Pick with aspect ratio constraint
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
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
        // Validate date format
        if (!eventDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            Alert.alert("Invalid Date", "Please enter a valid date in MM/DD/YYYY format");
            return;
        }

        // Validate name
        if (!image) {
            Alert.alert("Image Required", "Please upload an event image");
            return;
        }

        // Validate image
        if (!eventName) {
            Alert.alert("Event Name Required", "Please enter an event name");
            return;
        }

        // Validate coordinates
        if (!selectedLocation) {
            Alert.alert("Location Required", "Please select a valid location.");
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
                    coordinates: selectedLocation,
                },
                ticketPrice,
                maxTickets,
                imageUrl,
                createdAt: new Date(),
            };

            await addDoc(collection(db, "events"), eventData);
            Alert.alert("Success", "Event saved successfully!");
            router.push('/events'); // Navigate to events list or another page
        } catch (error) {
            console.error("Error saving event: ", error);
            Alert.alert("Error", "Failed to save event");
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
    };

    // Handle selecting location
    const handleLocationSelect = (coordinate) => {
        setSelectedLocation(coordinate);
        setLocationCoordinates(coordinate);
        setModalVisible(false);
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
                    placeholderTextColor={colorScheme.gray_text}
                    value={eventName}
                    onChangeText={setEventName}
                />

                {/* Location Selection */}
                <Text style={styles.label}>Location</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
                    <Text style={{ color: colorScheme.gray_text }}>
                        {selectedLocation ? `Selected: ${selectedLocation.lat}, ${selectedLocation.lng}` : "Select a location on the map"}
                    </Text>
                </TouchableOpacity>

                {/* Ticket Price */}
                <Text style={styles.label}>Ticket Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter ticket price"
                    placeholderTextColor={colorScheme.gray_text}
                    keyboardType="numeric"
                    value={ticketPrice}
                    onChangeText={setTicketPrice}
                />

                {/* Max Tickets */}
                <Text style={styles.label}>Max Number of Tickets</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max number of tickets"
                    placeholderTextColor={colorScheme.gray_text}
                    keyboardType="numeric"
                    value={maxTickets}
                    onChangeText={setMaxTickets}
                />

                {/* Event Date (Text Input with Validation) */}
                <Text style={styles.label}>Event Date (MM/DD/YYYY)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter event date"
                    placeholderTextColor={colorScheme.gray_text}
                    value={eventDate}
                    onChangeText={setEventDate}
                />

                {/* Image Upload */}
                <Text style={styles.label}>Event Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : <Text>Pick an image (Square)</Text>}
                </TouchableOpacity>
            </View>

            {/* Modal for Map View */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
            >
                <View style={styles.modalContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 7.8731,
                            longitude: 80.7718,
                            latitudeDelta: 2.5,
                            longitudeDelta: 2.5,
                        }}
                        onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)} // Handle location select on map press
                    >
                        {selectedLocation && (
                            <Marker
                                coordinate={selectedLocation}
                                title="Selected Location"
                            />
                        )}
                    </MapView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginTop: 0,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        backgroundColor: colorScheme.accent,
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddEvents;
