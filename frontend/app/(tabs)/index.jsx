import { View, Text, StatusBar, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import React, {useEffect, useState} from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ColorList from "../../components/test_components/ColorList";
import { BlurView } from 'expo-blur';
import PopularAttractions from "../../components/home_page/PopularAttractions";
import Blogs from "../../components/home_page/Blogs";
import {router} from "expo-router";
import {auth} from "../../firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import ColorScheme from "../../assets/colors/colorScheme";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [initials, setInitials] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.displayName) {
                setInitials(getInitials(user.displayName));
            } else {
                setInitials('NA');
            }
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, []);

    const getInitials = (fullName) => {
        const nameArray = fullName.split(' ');
        const initials = nameArray.map(name => name[0]).join('').toUpperCase();
        return initials;
    };

    const handleProfileOrLogin = () => {
        const user = auth.currentUser;

        if(user) {
            router.push('profile');
        } else {
            router.push('/screens/Login')
        }
    };

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

            <ScrollView contentContainerStyle={{ paddingTop: StatusBar.currentHeight || 50, marginTop: 16, marginBottom: 32, paddingBottom:75 }}>
                <View style={{ position: 'relative' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 8 }}>

                        <Text style={{fontSize: 40, fontWeight: 'bold'}}>Home</Text>
                        {/*<Text style={{fontSize: 28, fontWeight: 'bold', color: ColorScheme.gray_text}}>Discover Ceylon</Text>*/}

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
                                <FontAwesome name="search" size={18} color={ColorScheme.accent} style={{ marginLeft: 10 }} />
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
