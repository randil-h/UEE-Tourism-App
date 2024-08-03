import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapPage from "@/frontend/app/screens/MapPage";
import HomePage from "@/frontend/app/screens/Homepage";
import EventPage from "@/frontend/app/screens/EventPage";
import ItineraryPage from "@/frontend/app/screens/ItineraryPage";
import AddBlogPage from "@/frontend/app/screens/AddBlogPage";
import {NavigationContainer} from "@react-navigation/native";

import BackgroundImage from '../assets/images/onboarding.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
    return (
        <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Sri Lanka</Text>
                <Text style={styles.subtitle}>Wonder of Asia</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace('Main')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Events') {
                        iconName = 'calendar';
                    } else if (route.name === 'Map') {
                        iconName = 'compass-outline';
                    } else if (route.name === 'Itinerary') {
                        iconName = 'list-outline';
                    }

                    return <Ionicons name={iconName} color={color} size={size} />;
                },
                tabBarActiveTintColor: 'lime',
                tabBarInactiveTintColor: 'white',
                tabBarStyle: { backgroundColor: '#474bd6' },
            })}
        >
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Events" component={EventPage} />
            <Tab.Screen name="Map" component={MapPage} />
            <Tab.Screen name="Itinerary" component={ItineraryPage} />
        </Tab.Navigator>
    );
};

const App = () => {
    return (
        <PaperProvider>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="New Blog" component={AddBlogPage} options={{headerShown : true}} />
                </Stack.Navigator>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        marginTop: 45,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 70,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    subtitle: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
    },
    button: {
        marginTop: 60,
        backgroundColor: 'black',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default App;
