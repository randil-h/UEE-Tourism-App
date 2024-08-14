import { View, Text, StatusBar, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons for additional icons
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import ColorList from "../components/ColorList";

// Attractions array with 10 options
const attractions = [
    { name: 'Safari', icon: 'nature' },
    { name: 'Beaches', icon: 'beach-access' },
    { name: 'Hotels', icon: 'hotel' },
    { name: 'Viewpoints', icon: 'landscape' },
    { name: 'Lakes', icon: 'waves' },
    { name: 'Temples', icon: 'account-balance' },
    { name: 'Parks', icon: 'park' },
    { name: 'Museums', icon: 'museum' },
    { name: 'Mountains', icon: 'terrain' },
    { name: 'Shopping', icon: 'shopping-cart' },
];

// Function to generate random slightly vibrant gradients
const getRandomGradient = () => {
    const colors = [
        ['#A8E063', '#56AB2F'], // Light green to deep green
        ['#FDC830', '#F37335'], // Yellow to orange
        ['#FF9966', '#FF5E62'], // Orange to red (still has a hint of red)
        ['#76B852', '#8DC26F'], // Lime green to softer green
        ['#F4C20D', '#F39C12'], // Bright yellow to orange
        ['#b0dc70', '#77aa3d'], // Light lime green to deeper green
        ['#FFAB40', '#FF8C00'], // Orange to darker orange
        ['#fae77a', '#e4c132'], // Very light yellow to bright yellow
        ['#F48FB1', '#F06292'], // Light fuchsia to medium fuchsia
        ['#FF7043', '#FF5722'], // Vibrant orange to darker orange
    ];
    return colors.sort(() => Math.random() - 0.5); // Shuffling the colors
};

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const gradients = getRandomGradient(); // Generate and shuffle gradients once

    return (
        <ScrollView className="mt-16">
            <View className="relative">
                {/* StatusBar */}
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

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
                            <FontAwesome name="search" size={18} color="#75808c" style={{ marginLeft: 10, marginEnd: 8 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Title and See More Button */}
                <View className="flex flex-row justify-between items-center px-6 pt-4">
                    <Text className="font-bold text-xl">Popular Attractions</Text>
                    <TouchableOpacity>
                        <Text className="text-blue-500 font-medium">See More</Text>
                    </TouchableOpacity>
                </View>

                {/* Tourist Attractions - Horizontally Scrollable View */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 py-4">
                    {attractions.map((attraction, index) => {
                        const gradient = gradients[index % gradients.length];
                        return (
                            <View key={index} className="flex items-center mr-4">
                                <LinearGradient
                                    colors={gradient}
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                >
                                    <MaterialIcons name={attraction.icon} size={24} color="#fff" />
                                </LinearGradient>
                                <Text className="mt-2 text-sm font-medium text-center">{attraction.name}</Text>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* ColorList Component */}
                <ColorList color="#57a3d8" />
            </View>
        </ScrollView>
    );
}

export default Home;
