import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert, Text, Image, Modal, TextInput, TouchableOpacity } from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import { FAB } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from "../../apiConfig";

const Map = () => {
    const [location, setLocation] = useState(null);
    const [radius, setRadius] = useState(5000); // meters
    const [popularAttractions, setPopularAttractions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [newTip, setNewTip] = useState('');
    const [newNote, setNewNote] = useState('');
    const mapRef = useRef(null);

    const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

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

            // Fetch travel time for each attraction
            const attractionsWithTravelTime = await Promise.all(popular.map(async (place) => {
                const travelTime = await fetchTravelTime(location, {
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng
                });
                return { ...place, travelTime };
            }));

            setPopularAttractions(attractionsWithTravelTime);
        } catch (error) {
            console.error('Error fetching popular attractions:', error);
        }
    };

// Helper function to get a photo URL from a reference
    const getPhotoUrl = (photoReference) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
    };


    useEffect(() => {
        if (location) {
            fetchPopularAttractions(location);
        }
    }, [location, radius]);

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

    return (
        <View style={styles.container}>
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
                {popularAttractions.map((place, index) => {
                    const placeType = place.types?.[0]?.replace('_', ' ') || 'Tourist attraction';
                    const photos = place.photos ? place.photos.slice(0, 4).map(photo => getPhotoUrl(photo.photo_reference)) : [];
                    const isOpenNow = place.opening_hours?.open_now;
                    const openStatus = isOpenNow ? 'Open now' : 'Closed';
                    const is24Hours = place.opening_hours?.periods?.some(period => period.open.day === 0 && period.open.time === "0000");

                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng
                            }}
                            title={place.name}
                            description={`${placeType}\nRating: ${place.rating} (${place.user_ratings_total} reviews)\n${is24Hours ? 'Open 24 hours' : openStatus}`}
                        >
                            <Image source={require('../../assets/icons/MapPin2.png')} style={{ height: 35, width: 35 }} />

                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{place.name}</Text>
                                    <Text>{placeType}</Text>
                                    <Text>Rating: {place.rating} ({place.user_ratings_total} reviews)</Text>
                                    <Text>{is24Hours ? 'Open 24 hours' : openStatus}</Text>
                                    <Text>Travel time: {place.travelTime}</Text>

                                    <View style={styles.photoContainer}>
                                        {photos.map((photoUrl, i) => (
                                            <Image key={i} source={{ uri: photoUrl }} style={styles.photo} />
                                        ))}
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
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
                    minimumTrackTintColor="#3f51b5"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.8)"
                    thumbTintColor="#3f51b5"
                />
                <Text style={styles.sliderValue}>{radius / 1000} km</Text>
            </BlurView>

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => setModalVisible(true)}
            />

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

                        <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
                            <Text style={styles.addButtonText}>Add Attraction</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    calloutContainer: {
        width: 200,
        padding: 10,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    photo: {
        width: 50,
        height: 50,
        marginRight: 5,
        marginBottom: 5,
        borderRadius: 5,
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        height: 400,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slider: {
        marginBottom: 20,
        width: 340,
        height: 40,
        transform: [{ rotate: '-90deg' }],
    },
    sliderValue: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#3f51b5',
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
        backgroundColor: 'white',
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
    addButton: {
        backgroundColor: '#3f51b5',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default Map;
