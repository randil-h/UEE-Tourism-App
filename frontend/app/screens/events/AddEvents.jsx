import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Platform} from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
import { useRouter } from "expo-router";
import EventsList from "../../../components/events_page/EventsList";
import { Divider } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import colors from '../../../assets/colors/colorScheme';
import {BlurView} from "expo-blur";

const AddEvents = () => {
    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

                <View>

                    {/*
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome6 name="bucket" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mapContainer}>
                         //Map Preview
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
                    // Event List
                    <EventsList />*/}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {

        marginTop: 0,
        backgroundColor: colors.white, // bg-slate-900
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20, // px-6
        paddingVertical: 24, // py-2
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
    },
    mapTouchable: {
        pointerEvents: 'box-none',
    },
    mapViewContainer: {
        paddingHorizontal: 16, // px-4
        paddingVertical: 8, // py-2
        marginVertical: 24, // my-6
        flex: 1,
        alignItems: 'flex-start',
        width: '100%',
    },
    mapView: {
        height: 200,
        width: 200,
        borderRadius: 100,
    },
    iconButton: {
        backgroundColor: colors.accent, // bg-blue-950
        height: 32,
        width: 32,
        marginTop: 32, // mt-8
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
});

export default AddEvents;
