import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // For navigation
import EventsGrid from '../../components/events_page/EventsGrid';
import ColorList from '../../components/test_components/ColorList';
import MapView from 'react-native-maps';
import {useRouter} from "expo-router";
import EventsList from "../../components/events_page/EventsList";
import {Divider} from "react-native-paper"; // Import MapView

const Events = () => {
    const router = useRouter();

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-16">
            <View>
                <View className="flex flex-col justify-between px-6 py-2 mt-4">
                    <Text className="font-bold text-5xl">Local Events,</Text>
                    <Text className="font-bold text-2xl mb-4 text-slate-500">With Instant Access!</Text>
                    <Divider/>
                </View>



                {/* Map Preview */}
                <TouchableOpacity onPress={() => router.push('screens/events/EventsMap')}>
                    <View className="px-4 py-2 my-6 flex items-center">
                        <MapView
                            style={{ height: 200, width: 200, borderRadius: 65 }}
                            initialRegion={{
                                latitude: 7.8731,
                                longitude: 80.7718,
                                latitudeDelta: 2.5,
                                longitudeDelta: 2.5,
                            }}
                            showsUserLocation={true}
                            followsUserLocation={true}
                        />
                    </View>
                </TouchableOpacity>
                {/*<EventsGrid/>*/}
                <EventsList/>

            </View>
        </ScrollView>
    );
};

export default Events;
