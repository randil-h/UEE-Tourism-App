import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import {FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";
import TabBar from "../../components/navbar/TabBar";

export default function TabLayout() {


    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }} tabBar={props=> <TabBar {...props} />}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Foundation name="home" size={20} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Events',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="music" color={color} />,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="map-location-dot" color={color} />,
                }}
            />
            <Tabs.Screen
                name="route"
                options={{
                    title: 'Route',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="compass" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account" color={color} />,
                }}
            />
        </Tabs>
    );
}
