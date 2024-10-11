import React, {useEffect, useState} from 'react';
import {Button, Image, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {collection, getDocs, addDoc} from '@firebase/firestore';
import colorScheme from '../../../assets/colors/colorScheme';
import Config from "../../../apiConfig";
import {db} from "../../../firebaseConfig"; // Import your Firestore instance
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from "@react-native-community/slider";
import * as turf from '@turf/turf';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BlurView} from "expo-blur";

const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_API_KEY;
const routesData = require('../../../assets/data_scripts/routes.json'); // Load JSON file

const EventsMap = () => {
    const [selectedRoute, setSelectedRoute] = useState(routesData.routes[0].name);
    const [route, setRoute] = useState(routesData.routes[0]);
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [distance, setDistance] = useState(5);

    useEffect(() => {
        const selected = routesData.routes.find(r => r.name === selectedRoute);
        setRoute(selected);
    }, [selectedRoute]);

    // Fetch events from Firestore
    const fetchEvents = async () => {
        try {
            const eventsCollection = collection(db, "events");
            const eventSnapshot = await getDocs(eventsCollection);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventList);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
    };

    useEffect(() => {
        fetchEvents(); // Fetch events on component mount
    }, []);

    // Function to check if the event is within the specified distance from the route
    const isEventNearby = (event) => {
        const { coordinates } = event.location;
        const distanceToRoute = calculateDistanceFromRoute(coordinates);
        return distanceToRoute <= distance;
    };

    // Function to calculate the distance from the event to the nearest point on the route
    const calculateDistanceFromRoute = (eventCoords) => {
        const eventPoint = turf.point([eventCoords.longitude, eventCoords.latitude]);
        const routeLine = turf.lineString(route.waypoints.map(wp => [wp.longitude, wp.latitude]));
        return turf.pointToLineDistance(eventPoint, routeLine, {units: 'kilometers'});
    };

    const handleReserveEvent = async (event) => {
        try {
            const reservedEventsRef = collection(db, "reserved_events");
            const querySnapshot = await getDocs(reservedEventsRef);
            const alreadyReserved = querySnapshot.docs.some(doc => doc.data().id === event.id);

            if (alreadyReserved) {
                Alert.alert("Already Reserved", "This event has already been reserved.");
            } else {
                await addDoc(reservedEventsRef, event);
                Alert.alert("Success", "Event reserved successfully!");
            }
        } catch (error) {
            console.error("Error reserving event: ", error);
            Alert.alert("Error", `Failed to reserve the event: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 7.8731,
                    longitude: 80.7718,
                    latitudeDelta: 2.5,
                    longitudeDelta: 2.5,
                }}
                showsUserLocation={true}
                followsUserLocation={false}
            >
                <MapViewDirections
                    origin={route.start}
                    waypoints={route.waypoints.length > 0 ? route.waypoints : undefined}
                    destination={route.end}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={6}
                    strokeColor={colorScheme.accent}
                    optimizeWaypoints={true}
                />
                <Marker coordinate={route.start} title="Start" />
                <Marker coordinate={route.end} title="End" />
                {route.waypoints.map((wp, index) => (
                    <Marker key={index} coordinate={wp} title={`Waypoint ${index + 1}`} />
                ))}

                {events.filter(isEventNearby).map(event => (
                    <Marker
                        key={event.id}
                        coordinate={{
                            latitude: event.location.coordinates.latitude,
                            longitude: event.location.coordinates.longitude,
                        }}
                        title={event.name}
                    >
                        <Image
                            source={require('../../../assets/icons/icons8-marker-100.png')}
                            style={styles.eventMarker}
                        />
                        <Callout>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{event.name}</Text>
                                <Image
                                    source={{ uri: event.imageUrl }}
                                    style={styles.calloutImage}
                                />
                                <Text style={styles.calloutText}>Date: {event.date}</Text>
                                <Text style={styles.calloutText}>Ticket Price: Rs. {event.ticketPrice}</Text>

                                {/* Reserve Button with icon */}
                                <TouchableOpacity
                                    style={styles.reserveButton}
                                    onPress={() => handleReserveEvent(event)}
                                >
                                    <Ionicons name="bookmark-outline" size={20} color="white" style={styles.reserveIcon} />
                                    <Text style={styles.reserveButtonText}>Reserve</Text>
                                </TouchableOpacity>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View style={styles.pickerContainer}>
                <DropDownPicker
                    open={open}
                    value={selectedRoute}
                    items={routesData.routes.map(route => ({
                        label: route.name,
                        value: route.name,
                    }))}
                    setOpen={setOpen}
                    setValue={setSelectedRoute}
                    placeholder="Select a route"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropDownContainer}
                    textStyle={styles.dropdownText}
                />
                <BlurView intensity={100} tint="light" style={styles.blurContainer} />
            </View>




            <View style={styles.sliderContainer}>
                <BlurView intensity={100} tint="light" style={styles.blurBackground} />
                <Text>Distance from route (km): {distance}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={50}
                    step={1}
                    value={distance}
                    onValueChange={setDistance}
                />
            </View>
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
    pickerContainer: {
        position: 'absolute',
        top: 12,
        alignSelf: 'center',
        width: '80%',
        zIndex: 9999, // Ensure the container is on top of all other views
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 50,
        overflow: 'hidden',
    },
    dropdown: {
        backgroundColor: 'rgba(255,255,255,0.5)', // Semi-transparent background for the blur effect
        borderWidth: 0,
        padding: 10,
        borderRadius: 50,
    },
    dropDownContainer: {
        backgroundColor: 'rgba(255,255,255,0.5)', // Dark background for dropdown items
        zIndex: 10000, // Ensure the dropdown is visible on top of other components
        borderWidth: 0,
        borderRadius: 25,
        width: '100%',
    },
    dropdownText: {
        color: 'black', // Set text color to white for contrast
        fontWeight: 'bold',
    },
    eventMarker: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    calloutContainer: {
        width: 250, // Make the callout wider for more content space
        borderRadius: 10,
        alignItems: 'center',
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8, // Added spacing between title and content
        color: colorScheme.black,
        textAlign: 'center', // Center-align the title
    },
    calloutText: {
        fontSize: 14,
        color: colorScheme.black,
        marginBottom: 5,
        textAlign: 'center', // Center-align the text
    },
    calloutImage: {
        width: '100%', // Slightly larger image
        height: 120,
        borderRadius: 10,
        marginBottom: 10, // Adjust spacing between image and text
    },
    reserveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the content horizontally
        backgroundColor: colorScheme.accent,
        paddingVertical: 10, // Adjust padding for better clickability
        paddingHorizontal: 15,
        borderRadius: 25,
        marginTop: 10,
        width: '100%', // Full width of the container
    },
    reserveButtonText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
        textAlign: 'center', // Center-align text
    },
    reserveIcon: {
        marginRight: 5,
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 30,
        width: '80%',
        alignSelf: 'center',
        paddingVertical: 5,

        borderRadius: 25,

        alignItems: 'center',
        zIndex: 9999, // Ensure the slider is on top of other views
    },
    blurBackground: {
        position: 'absolute',
        top: 0,

        alignSelf: 'center',
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 25,
        overflow: 'hidden',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});


export default EventsMap;
