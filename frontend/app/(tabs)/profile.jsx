import { View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { router } from "expo-router";
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
        Alert.alert('Confirm Logout!', 'Are you sure you want to log out?',
            [
                { text: 'Cancel', onPress: () => console.log('Logout cancelled'), style: 'cancel' },
                { text: 'Logout', onPress: handleLogout }
            ],
            { cancelable: true }
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
                <View style={styles.userActionContainer}>
                    <Text style={styles.title}>Profile</Text>
                    {user ? (
                        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => router.push('/screens/Login')} style={styles.logoutButton}>
                            <Text style={styles.logoutText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Divider style={styles.divider} />

                {/* User Info */}
                <View style={styles.userInfoContainer}>
                    <View>
                        <Text style={[styles.userName, { color: colors.darkSlateGray }]}>Bimidu Gunathilake</Text>
                        <Text style={styles.userEmail}>johndoe@gmail.com</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name="pencil" size={24} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <Text style={[styles.settingsTitle, { color: colors.gray_bg }]}>Settings</Text>
                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Account</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider style={styles.divider} />

                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Notifications</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider style={styles.divider} />

                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Privacy</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider style={styles.divider} />

                    <TouchableOpacity style={styles.settingsOption}>
                        <Text style={[styles.settingsText, { color: colors.darkSlateGray }]}>Language</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider style={styles.divider} />
                </View>
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
        paddingTop: 64,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        marginBottom: 16,
        color: colors.darkSlateGray,
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
        textAlign: 'left',
    },
    userEmail: {
        fontSize: 16,
        color: 'slategray',
        marginTop: 4,
    },
    settingsTitle: {
        fontWeight: 'bold',
        fontSize: 28,
        marginBottom: 24,
    },
    settingsContainer: {
        marginBottom: 20,
    },
    settingsOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        alignItems: 'center',
    },
    settingsText: {
        fontSize: 18,
        fontWeight: '500',
    },
    userActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutButton: {
        justifyContent: 'center',
        padding: 15,
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: colors.accent,
    },
    logoutText: {
        fontWeight: 'bold',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray_bg,
        marginVertical: 16,
    },
});

export default Profile;
