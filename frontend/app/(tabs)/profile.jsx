import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import colors from '../../assets/colors/colorScheme'; // Assume colors are imported

const Profile = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-16" style={{ backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" />

            {/* Profile Section */}
            <View className="px-6 py-6">
                <Text className="font-bold text-5xl mb-4" style={{ color: colors.racingGreen }}>
                    Profile
                </Text>
                <Divider />

                {/* User Info */}
                <View className="mt-8 flex flex-row justify-between items-center">
                    <View>
                        <Text className="font-bold text-xl" style={{ color: colors.darkSlateGray }}>
                            John Doe
                        </Text>
                        <Text className="text-lg text-slate-400">johndoe@gmail.com</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name="pencil" size={24} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Settings Section */}
            <View className="px-6 py-6">
                <Text className="font-bold text-3xl mb-6" style={{ color: colors.racingGreen }}>
                    Settings
                </Text>

                {/* Settings Options */}
                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity className="flex flex-row justify-between py-4">
                        <Text className="text-lg" style={{ color: colors.darkSlateGray }}>Account</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity className="flex flex-row justify-between py-4">
                        <Text className="text-lg" style={{ color: colors.darkSlateGray }}>Notifications</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity className="flex flex-row justify-between py-4">
                        <Text className="text-lg" style={{ color: colors.darkSlateGray }}>Privacy</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />

                    <TouchableOpacity className="flex flex-row justify-between py-4">
                        <Text className="text-lg" style={{ color: colors.darkSlateGray }}>Language</Text>
                        <FontAwesome name="chevron-right" size={20} color={colors.darkOliveGreen} />
                    </TouchableOpacity>
                    <Divider />
                </View>
            </View>
        </ScrollView>
    );
};

export default Profile;
