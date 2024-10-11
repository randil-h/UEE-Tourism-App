import React, { useEffect, useState, useRef } from 'react';
import {StyleSheet, View, Alert, Text, Image, Modal, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import {Chip, FAB} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from "../../apiConfig";
import { db} from '../../firebaseConfig';
import { getDocs, doc, setDoc, arrayUnion, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const Map = () => {
    const [location, setLocation] = useState(null);
    const [radius, setRadius] = useState(5000);
    const [popularAttractions, setPopularAttractions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [newTip, setNewTip] = useState('');
    const [newNote, setNewNote] = useState('');
    const [userNotes, setUserNotes] = useState({});
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [newUserNote, setNewUserNote] = useState('');
    const [routeCoordinates, setRouteCoordinates] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [attractionTypes, setAttractionTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const mapRef = useRef(null);
    const markerRef = useRef({});

    const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

    const fetchUserNotes = async (placeId) => {
        try {
            const noteDoc = await getDoc(doc(db, 'userNotes', placeId));
            if (noteDoc.exists()) {
                return noteDoc.data().notes;
            }
            return [];
        } catch (error) {
            console.error('Error fetching user notes:', error);
            return [];
        }
    };

    const handleMarkerPress = async (place) => {
        setSelectedPlace(place);
        const notes = await fetchUserNotes(place.place_id);
        setUserNotes(prevNotes => ({
            ...prevNotes,
            [place.place_id]: notes
        }));
    };

    const addUserNote = async (placeId, note) => {
        try {
            const noteRef = doc(db, 'userNotes', placeId);
            await setDoc(noteRef, {
                notes: arrayUnion(note)
            }, { merge: true });

            setUserNotes(prevNotes => ({
                ...prevNotes,
                [placeId]: [...(prevNotes[placeId] || []), note]
            }));
        } catch (error) {
            console.error('Error adding user note:', error);
            Alert.alert('Error', 'Failed to add note');
        }
    };

    const editUserNote = async (placeId, noteIndex, updatedNote) => {
        try {
            const noteRef = doc(db, 'userNotes', placeId);
            const currentNotes = userNotes[placeId];
            const updatedNotes = [...currentNotes];
            updatedNotes[noteIndex] = updatedNote;

            await updateDoc(noteRef, {
                notes: updatedNotes
            });

            setUserNotes(prevNotes => ({
                ...prevNotes,
                [placeId]: updatedNotes
            }));
            setEditingNote(null);
        } catch (error) {
            console.error('Error editing user note:', error);
            Alert.alert('Error', 'Failed to edit note');
        }
    };

    const deleteUserNote = async (placeId, noteIndex) => {
        try {
            const noteRef = doc(db, 'userNotes', placeId);
            await updateDoc(noteRef, {
                notes: arrayRemove(userNotes[placeId][noteIndex])
            });

            setUserNotes(prevNotes => ({
                ...prevNotes,
                [placeId]: prevNotes[placeId].filter((_, index) => index !== noteIndex)
            }));
        } catch (error) {
            console.error('Error deleting user note:', error);
            Alert.alert('Error', 'Failed to delete note');
        }
    };

    const getCurrentLocation = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const currentLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setLocation(currentLocation);
            console.log('Current location:', currentLocation);

            mapRef.current?.animateToRegion(currentLocation, 1000);

            fetchPopularAttractions(currentLocation);
        } catch (error) {
            console.warn(error);
            Alert.alert('Error', 'Failed to get current location');
        }
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Location permission denied');
                return;
            }
            getCurrentLocation();
        };
        requestLocationPermission();
    }, []);

    const fetchTravelTime = async (origin, destination) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                return data.routes[0].legs[0].duration.text;
            }
            return 'N/A';
        } catch (error) {
            console.error('Error fetching travel time:', error);
            return 'N/A';
        }
    };

    const fetchPopularAttractions = async (location) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();

            const popular = data.results.filter(place =>
                place.rating >= 4.0 && place.user_ratings_total > 100
            );

            const attractionsWithTravelTime = await Promise.all(popular.map(async (place) => {
                const travelTime = await fetchTravelTime(location, {
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng
                });
                return { ...place, travelTime };
            }));

            setPopularAttractions(attractionsWithTravelTime);

            // Extract unique attraction types
            const types = [...new Set(attractionsWithTravelTime.flatMap(place => place.types))];
            setAttractionTypes(types);
        } catch (error) {
            console.error('Error fetching popular attractions:', error);
        }
    };

    const filterAttractions = () => {
        if (selectedTypes.length === 0) {
            return popularAttractions;
        }
        return popularAttractions.filter(place =>
            place.types.some(type => selectedTypes.includes(type))
        );
    };

    const toggleTypeSelection = (type) => {
        setSelectedTypes(prevTypes =>
            prevTypes.includes(type)
                ? prevTypes.filter(t => t !== type)
                : [...prevTypes, type]
        );
    };

    const formatAttractionType = (type) => {
        return type.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const openImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleAddLocation = () => {
        setModalVisible(false);
        setImage(null);
        setNewTip('');
        setNewNote('');
    };

    const fetchRoute = async (destination, placeId) => {
        if (!location) return;

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const points = data.routes[0].overview_polyline.points;
                const decodedPoints = decodePolyline(points);
                setRouteCoordinates(decodedPoints);

                const coordinates = [
                    { latitude: location.latitude, longitude: location.longitude },
                    { latitude: destination.latitude, longitude: destination.longitude },
                    ...decodedPoints
                ];
                mapRef.current?.fitToCoordinates(coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });

                markerRef.current[placeId]?.hideCallout();
            }
        } catch (error) {
            console.error('Error fetching route:', error);
            Alert.alert('Error', 'Failed to fetch route');
        }
    };

    const decodePolyline = (encoded) => {
        const poly = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return poly;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterChipsContainer}
            >
                {attractionTypes.map((type) => (
                    <Chip
                        key={type}
                        selected={selectedTypes.includes(type)}
                        onPress={() => toggleTypeSelection(type)}
                        style={styles.filterChip}
                        textStyle={styles.filterChipText}
                    >
                        {formatAttractionType(type)}
                    </Chip>
                ))}
            </ScrollView>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={location || {
                    latitude: 7.8731,
                    longitude: 80.7718,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {location && (
                    <Marker
                        coordinate={location}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.currentLocationMarker}>
                            <View style={styles.currentLocationMarkerInner} />
                        </View>
                    </Marker>
                )}
                {filterAttractions().map((place, index) => {
                    const placeType = place.types?.[0] ? formatAttractionType(place.types[0]) : 'Tourist Attraction';
                    const isOpenNow = place.opening_hours?.open_now;
                    const openStatus = isOpenNow ? 'Open now' : 'Closed';
                    const is24Hours = place.opening_hours?.periods?.some(period => period.open.day === 0 && period.open.time === "0000");

                    return (
                        <Marker
                            key={index}
                            ref={ref => markerRef.current[place.place_id] = ref}
                            coordinate={{
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng
                            }}
                            title={place.name}
                            description={`${placeType}\nRating: ${place.rating} (${place.user_ratings_total} reviews)\n${is24Hours ? 'Open 24 hours' : openStatus}`}
                            onPress={() => handleMarkerPress(place)}
                        >
                            <Image source={require('../../assets/icons/MapPin2.png')} style={{ height: 35, width: 35 }} />

                            <Callout
                                tooltip
                                style={[
                                    styles.calloutContainer,
                                    { maxHeight: 600 },
                                ]}
                            >
                                <ScrollView
                                    contentContainerStyle={styles.calloutScrollView}
                                    showsVerticalScrollIndicator={true}
                                >
                                    <Text style={styles.calloutTitle}>{place.name}</Text>
                                    <View style={styles.placeDetailsContainer}>
                                        <View style={styles.detailRow}>
                                            <Icon name="map-marker" size={18} color="#478747" />
                                            <Text style={styles.detailText}>{placeType}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Icon name="star" size={18} color="#fbc02d" />
                                            <Text style={styles.detailText}>
                                                {place.rating}
                                                <Text style={styles.reviewCount}> ({place.user_ratings_total} reviews)</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Icon name="clock" size={18} color="#478747" />
                                            <Text style={styles.detailText}>{is24Hours ? 'Open 24 hours' : openStatus}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Icon name="car" size={18} color="#478747" />
                                            <Text style={styles.detailText}>Travel time: {place.travelTime}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.navigateButton}
                                        onPress={() => fetchRoute({
                                            latitude: place.geometry.location.lat,
                                            longitude: place.geometry.location.lng
                                        }, place.place_id)}
                                    >
                                        <View style={styles.buttonContent}>
                                            <Icon name="navigation" size={20} color="#fff" />
                                            <Text style={styles.navigateButtonText}>Navigate</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <Text style={styles.notesTitle}>User Notes:</Text>
                                    {userNotes[place.place_id]?.map((note, i) => (
                                        <View key={i} style={styles.noteContainer}>
                                            {editingNote === i ? (
                                                <TextInput
                                                    style={styles.editNoteInput}
                                                    value={note}
                                                    onChangeText={(text) => {
                                                        const updatedNotes = [...userNotes[place.place_id]];
                                                        updatedNotes[i] = text;
                                                        setUserNotes(prevNotes => ({
                                                            ...prevNotes,
                                                            [place.place_id]: updatedNotes
                                                        }));
                                                    }}
                                                    onBlur={() => editUserNote(place.place_id, i, userNotes[place.place_id][i])}
                                                />
                                            ) : (
                                                <Text style={styles.userNote}>{note}</Text>
                                            )}
                                            <View style={styles.noteActions}>
                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() => setEditingNote(i)}
                                                >
                                                    <Icon name="pencil" size={20} color="#478747" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => deleteUserNote(place.place_id, i)}
                                                >
                                                    <Icon name="delete" size={20} color="#f44336" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                    <TextInput
                                        style={styles.noteInput}
                                        placeholder="Add a new note"
                                        value={newUserNote}
                                        onChangeText={setNewUserNote}
                                    />
                                    <TouchableOpacity
                                        style={styles.addNoteButton}
                                        onPress={() => {
                                            if (newUserNote.trim()) {
                                                addUserNote(place.place_id, newUserNote.trim());
                                                setNewUserNote('');
                                            }
                                        }}
                                    >
                                        <Text style={styles.addNoteButtonText}>Add Note</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </Callout>
                        </Marker>
                    );
                })}
                {routeCoordinates && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#478747"
                        strokeWidth={3}
                    />
                )}
            </MapView>

            <BlurView intensity={60} style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={1000}
                    maximumValue={50000}
                    step={1000}
                    value={radius}
                    onValueChange={(value) => {
                        setRadius(value);
                        if (location) {
                            fetchPopularAttractions(location);
                        }
                    }}
                    minimumTrackTintColor="#478747"
                    maximumTrackTintColor="#95a195"
                    thumbTintColor="#478747"
                />
                <Text style={styles.sliderValue}>{radius / 1000} km</Text>
            </BlurView>

            {/*<FAB*/}
            {/*    style={styles.fab}*/}
            {/*    icon="plus"*/}
            {/*    onPress={() => setModalVisible(true)}*/}
            {/*/>*/}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Add New Attraction</Text>

                        <GooglePlacesAutocomplete
                            placeholder='Search for a tourist attraction'
                            onPress={(data, details = null) => {
                                console.log(data, details);
                            }}
                            query={{
                                key: GOOGLE_MAPS_API_KEY,
                                language: 'en',
                                types: 'tourist_attraction'
                            }}
                            styles={{
                                container: {
                                    width: '100%',
                                    marginBottom: 20,
                                },
                                textInputContainer: {
                                    width: '100%',
                                },
                                textInput: {
                                    height: 40,
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    paddingHorizontal: 10,
                                },
                            }}
                        />

                        <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.selectedImage} />
                            ) : (
                                <Text style={styles.imagePickerText}>Pick an Image</Text>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter tips"
                            value={newTip}
                            onChangeText={setNewTip}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter notes"
                            value={newNote}
                            onChangeText={setNewNote}
                        />

                        {/*<TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>*/}
                        {/*    <Text style={styles.addButtonText}>Add Attraction</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    calloutContainer: {
        backgroundColor: '#f7f7f7',
        padding: 10,
        width: 250,
        maxHeight: 300,
        overflow: 'hidden',
        borderColor: '#57854e',
        borderWidth: 1,
        borderRadius: 16,
    },
    calloutScrollView: {
        paddingVertical: 10,
    },
    calloutTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        alignSelf: 'center',
        color: '#333',
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        height: 400,
        width: 80,
        overflow: 'hidden',
        borderColor: '#57854e',
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slider: {
        width: 340,
        height: 40,
        transform: [{ rotate: '-90deg' }],
        marginBottom: 20,
    },
    sliderValue: {
        fontSize: 16,
        color: '#000',
        position: 'absolute',
        bottom: 10,
        left: 20,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#3f51b5',
        borderRadius: 28,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    imagePicker: {
        width: '100%',
        height: 150,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePickerText: {
        color: '#999',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    /*addButton: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#3f51b5',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },*/
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    notesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    userNote: {
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        width: '100%',
    },
    noteInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
    },
    editNoteInput: {
        fontSize: 12,
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        padding: 2,
    },
    noteActions: {
        flexDirection: 'row',
    },
    editButton: {
        padding: 5,
        marginRight: 5,
    },
    deleteButton: {
        padding: 5,
    },
    addNoteButton: {
        backgroundColor: '#478747',
        padding: 5,
        borderRadius: 30,
        marginTop: 10,
        alignItems: 'center',
    },
    addNoteButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    navigateButton: {
        backgroundColor: '#478747',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navigateButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
    },
    currentLocationMarker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentLocationMarkerInner: {
        width: 16,
        height: 16,
        borderRadius: 12,
        backgroundColor: '#478747',
    },
    placeDetailsContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 5,
        fontWeight: '500',
    },
    filterChipsContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 10,
    },
    filterChip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#ffe8c5',
        borderColor: '#57854e',
        borderWidth: 2,
        borderRadius: 16,
    },
    filterChipText: {
        color: '#57854e',
    },
    reviewCount: {
        fontSize: 12,
        color: '#777',
        fontWeight: '400',
    },
});


export default Map;