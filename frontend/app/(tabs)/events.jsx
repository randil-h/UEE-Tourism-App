import {View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import ColorList from "../../components/test_components/ColorList";
import {FontAwesome} from "@expo/vector-icons";

const Events = () => {
    return (
        <ScrollView className="mt-16">
            <View className="relative">

                {/* Background Image or BlurView here */}

                <View className="flex flex-row justify-between px-6 py-2">
                    <Text className="font-bold text-3xl">Events</Text>

                </View>



                <ColorList color="#57a3d8" />
            </View>
        </ScrollView>
    )
}

export default Events
