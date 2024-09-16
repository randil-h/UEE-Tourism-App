import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
import { useRouter } from "expo-router";
import EventsList from "../../components/events_page/EventsList";
import { Divider } from "react-native-paper";

const Events = () => {
    const router = useRouter();

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-16">
            <View>
                <View className="flex flex-col justify-between px-6 py-2 mt-4">
                    <Text className="font-bold text-5xl">Local Events,</Text>
                    <Text className="font-bold text-2xl mb-4 text-slate-500">With Instant Access!</Text>
                    <Divider />
                </View>

                {/* Map Preview */}
                <TouchableOpacity onPress={() => router.push('screens/events/EventsMap')} style={{ pointerEvents: 'box-none' }}>
                    <View className="px-4 py-2 my-6 flex items-center" style={{ width: '100%' }}>
                        <MapView
                            style={{ height: 200, width: '100%', borderRadius: 60 }}
                            initialRegion={{
                                latitude: 7.8731,
                                longitude: 80.7718,
                                latitudeDelta: 2.5,
                                longitudeDelta: 2.5,
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

                {/* Event List */}
                <EventsList />
            </View>
        </ScrollView>
    );
};

export default Events;
