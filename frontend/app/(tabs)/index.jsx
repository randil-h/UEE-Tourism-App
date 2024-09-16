import { View, Text, StatusBar, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ColorList from "../../components/test_components/ColorList";
import { BlurView } from 'expo-blur';
import PopularAttractions from "../../components/home_page/PopularAttractions";
import Blogs from "../../components/home_page/Blogs";

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
                        <Text className="font-bold text-5xl">Home</Text>

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



                    <PopularAttractions/>
                    <Blogs/>

                </View>
            </ScrollView>
        </View>
    );
}

export default Home;
