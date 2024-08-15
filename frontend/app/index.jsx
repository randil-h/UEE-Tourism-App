import { View, Text, StatusBar, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ColorList from "../components/test_components/ColorList";
import { BlurView } from 'expo-blur';
import PopularAttractions from "../components/home_page/PopularAttractions";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');

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

<PopularAttractions/>

                    {/* ColorList Component */}
                    <ColorList color="#60a5fa" />
                </View>
            </ScrollView>
        </View>
    );
}

export default Home;
