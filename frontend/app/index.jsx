import { View, Text, StatusBar, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for icons
import ColorList from "../components/ColorList";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <ScrollView className="mt-16">
            <View className="relative">
                {/* StatusBar */}
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

                {/* Background Image or BlurView here */}

                <View className="flex flex-row justify-between px-6 py-2">
                    <Text className="font-bold text-3xl">Home</Text>
                    <View className="bg-blue-950 w-8 h-8 rounded-full flex justify-center items-center">
                        <Text className="text-base text-white">BG</Text>
                    </View>
                </View>

                {/* Search Bar with Icon */}
                <View className="px-6 py-4">
                    <View className="flex flex-row items-center bg-gray-200 p-3 rounded-full">
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search..."
                            placeholderTextColor="#75808c"
                            className="flex-1 pl-2 placeholder:font-medium"
                            style={{ fontSize: 16, textAlignVertical: 'center' }}
                        />
                        <TouchableOpacity>
                            <FontAwesome className="" name="search" size={18} color="#75808c" style={{ marginLeft: 10, marginEnd: 8 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ColorList color="#57a3d8" />
            </View>
        </ScrollView>
    );
}

export default Home;
