import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import colors from '../../assets/colors/colorScheme'; // Assume colors are imported

const Profile = () => {
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
