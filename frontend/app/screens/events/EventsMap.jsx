import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {collection, getDocs} from '@firebase/firestore';
import colorScheme from '../../../assets/colors/colorScheme';
import Config from "../../../apiConfig";
import {db} from "../../../firebaseConfig"; // Import your Firestore instance
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from "@react-native-community/slider";
import * as turf from '@turf/turf';

const GOOGLE_MAPS_APIKEY = Config.GOOGLE_MAPS_API_KEY;

// Load the JSON file
const routesData = require('../../../assets/data_scripts/routes.json'); // Update this path

const EventsMap = () => {
    const [selectedRoute, setSelectedRoute] = useState(routesData.routes[0].name);
    const [route, setRoute] = useState(routesData.routes[0]);
    const [events, setEvents] = useState([]); // State to hold events
    const [open, setOpen] = useState(false); // Controls dropdown visibility
    const [distance, setDistance] = useState(5); // State to hold the distance value for filtering

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
        const { coordinates } = event.location; // Assuming event.location has coordinates
        const distanceToRoute = calculateDistanceFromRoute(coordinates); // Implement this function
        return distanceToRoute <= distance;
    };

    // Function to calculate the distance from the event to the nearest point on the route
    const calculateDistanceFromRoute = (eventCoords) => {
        // Create a point for the event
        const eventPoint = turf.point([eventCoords.longitude, eventCoords.latitude]);

        // Create a LineString from the route's waypoints
        const routeLine = turf.lineString(
            route.waypoints.map(wp => [wp.longitude, wp.latitude]) // Ensure you have longitude, latitude for waypoints
        );

        // Calculate the distance from the event point to the nearest point on the route line
        return turf.pointToLineDistance(eventPoint, routeLine, {units: 'kilometers'}); // Return the calculated distance in kilometers
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
                {/* Render route dynamically */}
                <MapViewDirections
                    origin={route.start}
                    waypoints={route.waypoints.length > 0 ? route.waypoints : undefined}
                    destination={route.end}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={6}
                    strokeColor={colorScheme.accent}
                    optimizeWaypoints={true}
                    onStart={() => {
                        console.log(`Starting route from ${JSON.stringify(route.start)} to ${JSON.stringify(route.end)}`);
                    }}
                    onReady={(result) => {
                        console.log(`Route ready: ${result}`);
                    }}
                    onError={(errorMessage) => {
                        console.log(`Error: ${errorMessage}`);
                    }}
                />
                <Marker coordinate={route.start} title="Start" />
                <Marker coordinate={route.end} title="End" />
                {route.waypoints.map((wp, index) => (
                    <Marker key={index} coordinate={wp} title={`Waypoint ${index + 1}`} />
                ))}

                {/* Render event markers with custom icon */}
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
                                    source={{ uri: event.image }} // Ensure `event.image` is a URL string
                                    style={styles.calloutImage}
                                />
                                <Text>Date: {event.date}</Text>
                                <Text>Description: {event.description}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            {/* Dropdown for selecting a route */}
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
                    style={styles.dropdown} // Customize styles
                    dropDownContainerStyle={styles.dropDownContainer} // Dropdown container styling
                />
            </View>

            {/* Slider for controlling distance */}
            <View style={styles.sliderContainer}>
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
        top: 0,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 0,
        padding: 5,
        elevation: 2,
        width: '100%', // Use the same width for both platforms
        zIndex: 1,  // Ensure it's on top of other elements
    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 0,
        padding: 10,
        elevation: 2,
    },
    dropDownContainer: {
        backgroundColor: 'white',
        zIndex: 1000, // Important for iOS
        borderWidth: 0,
        width: '80%',
        alignSelf: 'flex-start',
    },
    picker: {
        width: '100%',  // Ensure the picker fits within the container
        height: 40,
        color: 'black',
    },
    eventMarker: {
        width: 40, // Adjust the size as needed
        height: 40,
        resizeMode: 'contain', // Ensure the image maintains its aspect ratio
    },
    calloutContainer: {
        width: 150,
        padding: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
    },
    sliderContainer: {
        position: 'absolute',
        bottom: 40,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default EventsMap;
