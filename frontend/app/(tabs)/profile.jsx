import {View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native'
import React, {useEffect, useState} from 'react'
import ColorList from "../../components/test_components/ColorList";
import {FontAwesome} from "@expo/vector-icons";
import {auth} from "../../firebaseConfig";
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {router} from "expo-router";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            setUser(currentuser);
        });

        return () => unsubscribe();
    }, []);

    const confirmLogout = () => {
        Alert.alert('Confirm Logout!', 'Are you sure want to log out?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Logout cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: handleLogout,
                },
            ],
            {cancelable: true}
        );
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert('Logged Out!', 'You have been logged out.');
                router.push('events');
            })
            .catch((error) => {
                Alert.alert('Error', error.message);
            });
    };

    return (
        <ScrollView className="mt-16">
            <View className="relative">
                <View className="flex flex-row justify-between px-6 py-2">
                    <Text className="font-bold text-3xl">Profile</Text>
                    {user? (
                        <TouchableOpacity onPress={confirmLogout} style={{justifyContent: 'center',paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#2475ff'}}>
                            <Text style={{fontWeight: 'bold', color: 'white'}}>Logout</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => router.push('/screens/Login')} style={{justifyContent: 'center',paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#2475ff'}}>
                            <Text style={{fontWeight: 'bold', color: 'white'}}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <ColorList color="#57a3d8" />
            </View>
        </ScrollView>
    )
}

export default Profile
