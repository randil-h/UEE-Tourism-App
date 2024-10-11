import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Platform} from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
import { useRouter } from "expo-router";
import EventsList from "../../components/events_page/EventsList";
import { Divider } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import colors from '../../assets/colors/colorScheme';
import {BlurView} from "expo-blur";

const Events = () => {
    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* BlurView for StatusBar */}
            {Platform.OS === 'ios' && (
                <BlurView
                    intensity={80}
                    tint="extraLight"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: StatusBar.currentHeight || 50,
                        zIndex: 1,
                    }}
                />
            )}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

            <View>
                <View style={styles.headerContainer}>
                    <View >
                        <Text style={styles.headerTitle}>Local Events,</Text>
                        <Text style={styles.headerSubtitle}>With Instant Access!</Text>
                        <Divider />
                    </View>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('screens/events/ReservedEvents')}>
                        <FontAwesome6 name="bucket" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('screens/events/AddEvents')}>
                        <FontAwesome6 name="add" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapContainer}>
                    {/* Map Preview */}
                    <TouchableOpacity onPress={() => router.push('screens/events/EventsMap')} style={styles.mapTouchable}>
                        <View style={styles.mapViewContainer}>
                            <MapView
                                style={styles.mapView}
                                initialRegion={{
                                    latitude: 7.8731,
                                    longitude: 80.7718,
                                    latitudeDelta: 2.2,
                                    longitudeDelta: 2.2,
                                }}
                                showsUserLocation={true}
                                followsUserLocation={true}
                                scrollEnabled={true} // Enable panning
                                zoomEnabled={true}   // Enable zoom
                                pitchEnabled={true}  // Enable map tilt
                                rotateEnabled={true} // Enable map rotation
                            />
                        </View>
                    </TouchableOpacity>

                </View>
                {/* Event List */}
                <EventsList />
            </View>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {

        marginTop: 16,
        backgroundColor: colors.white, // bg-slate-900
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20, // px-6
        paddingVertical: 24, // py-2
        marginTop: 36, // mt-4
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 40, // text-5xl
        paddingTop: 16, // pt-4
    },
    headerSubtitle: {
        fontWeight: 'bold',
        fontSize: 24, // text-2xl
        marginBottom: 16, // mb-4
        color: colors.gray_text, // text-slate-500
    },
    mapContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    mapTouchable: {
        pointerEvents: 'box-none',
    },
    mapViewContainer: {
        paddingHorizontal: 16, // px-4
        paddingVertical: 8, // py-2
        marginVertical: 24, // my-6
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    mapView: {
        height: 300,
        width: 300,
        borderRadius: 150,
    },
    iconButton: {
        backgroundColor: colors.accent,
        height: 32,
        width: 32,
        marginTop: 32, // mt-8
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
});

export default Events;
