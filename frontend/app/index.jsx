import { View, Text, StatusBar, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ColorList from "../components/ColorList";
import { BlurView } from 'expo-blur';

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

const getRandomGradient = () => {
    const colors = [
        ['#A8E063', '#56AB2F'],
        ['#FDC830', '#F37335'],
        ['#FF9966', '#FF5E62'],
        ['#76B852', '#8DC26F'],
        ['#F4C20D', '#F39C12'],
        ['#b0dc70', '#77aa3d'],
        ['#FFAB40', '#FF8C00'],
        ['#fae77a', '#e4c132'],
        ['#F48FB1', '#F06292'],
        ['#FF7043', '#FF5722'],
    ];
    return colors.sort(() => Math.random() - 0.5);
};

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const gradients = getRandomGradient();

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

            <ScrollView contentContainerStyle={{ paddingTop: StatusBar.currentHeight || 50, marginTop: 16 }}>
                <View style={{ position: 'relative' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 8 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Home</Text>
                        <View style={{ backgroundColor: '#003ca5', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: '#fff' }}>BG</Text>
                        </View>
                    </View>

                    {/* Search Bar with Icon */}
                    <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e0e0', padding: 12, borderRadius: 25 }}>
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search..."
                                placeholderTextColor="#75808c"
                                style={{ flex: 1, fontSize: 16, textAlignVertical: 'center' }}
                            />
                            <TouchableOpacity>
                                <FontAwesome name="search" size={18} color="#75808c" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Title and See More Button */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Popular Attractions</Text>
                        <TouchableOpacity>
                            <Text style={{ color: '#2475ff', fontWeight: '500' }}>See More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tourist Attractions - Horizontally Scrollable View */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                        {attractions.map((attraction, index) => {
                            const gradient = gradients[index % gradients.length];
                            return (
                                <View key={index} style={{ alignItems: 'center', marginRight: 16 }}>
                                    <LinearGradient
                                        colors={gradient}
                                        style={{ width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <MaterialIcons name={attraction.icon} size={24} color="#fff" />
                                    </LinearGradient>
                                    <Text style={{ marginTop: 8, fontSize: 12, fontWeight: '500', textAlign: 'center' }}>{attraction.name}</Text>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* ColorList Component */}
                    <ColorList color="#60a5fa" />
                </View>
            </ScrollView>
        </View>
    );
}

export default Home;
