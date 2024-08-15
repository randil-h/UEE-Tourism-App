import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from "../components/navbar/TabBar";

const _layout = () => {
    return (
        <Tabs
            tabBar={props=> <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "Events",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="route"
                options={{
                    title: "Route",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: "Map",
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false
                }}
            />
        </Tabs>
    )
}

export default _layout
