import { View, Text } from 'react-native'
import React from 'react'
import {Stack, Tabs} from 'expo-router'
import TabBar from "../components/navbar/TabBar";

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}

export default _layout
