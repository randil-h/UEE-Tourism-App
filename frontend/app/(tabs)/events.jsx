import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // For navigation
import EventsGrid from '../../components/events_page/EventsGrid';
import ColorList from '../../components/test_components/ColorList';
import MapView from 'react-native-maps';
import {useRouter} from "expo-router"; // Import MapView

const Events = () => {
    const router = useRouter();

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-16">
            <View>
                <View className="flex flex-col justify-between px-6 py-2 mt-4">
                    <Text className="font-bold text-5xl">Local Events,</Text>
                    <Text className="font-bold text-2xl text-slate-500">With Instant Access!</Text>
                </View>

                <EventsGrid />

                {/* Map Preview */}
                <TouchableOpacity onPress={() => router.push('Events/EventMap')}>
                    <View className="px-4 py-2 mt-6">
                        <MapView
                            style={{ height: 300, width: '100%', borderRadius: 24 }}
                            initialRegion={{
                                latitude: 37.78825,
                                longitude: -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <ColorList color="#57a3d8" />
            </View>
        </ScrollView>
    );
};

export default Events;
