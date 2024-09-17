
import {View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import ColorList from "../../components/test_components/ColorList";
import {FontAwesome} from "@expo/vector-icons";
import {auth} from "../../firebaseConfig";
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {router} from "expo-router";
import { Divider } from 'react-native-paper';
import colors from '../../assets/colors/colorScheme'; // Assume colors are imported


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

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>


            {/* Profile Section */}
            <View style={styles.section}>
                <Text style={[styles.title, { color: colors.gray_bg }]}>
                    Profile
                </Text>
                <Divider />

                {/* User Info */}
                <View style={styles.userInfoContainer}>
                    <View>
                        <Text style={[styles.userName, { color: colors.darkSlateGray }]}>
                            Bimidu Gunathilake
                        </Text>
                        <Text style={styles.userEmail}>johndoe@gmail.com</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name="pencil" size={24} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <Text style={[styles.settingsTitle, { color: colors.gray_bg }]}>
                    Settings
                </Text>

                {/* Settings Options */}
                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Account</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Notifications</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Privacy</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Language</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />
                </View>

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
    );
};

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 16,
        backgroundColor: 'white',
    },
    section: {
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 40,
        marginBottom: 16,
    },
    userInfoContainer: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    userEmail: {
        fontSize: 18,
        color: 'slategray',
    },
    settingsTitle: {
        fontWeight: 'bold',
        fontSize: 32,
        marginBottom: 24,
    },
    settingsContainer: {
        marginBottom: 20,
    },
    settingsOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    settingsText: {
        fontSize: 18,
    },
});

export default Profile;
