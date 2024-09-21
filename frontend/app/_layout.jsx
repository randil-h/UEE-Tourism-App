import {View, Text, Button} from 'react-native'
import React from 'react'
import {Stack, Tabs} from 'expo-router'
import TabBar from "../components/navbar/TabBar";
import { useNavigation } from '@react-navigation/native';

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen name="screens/AddBlog" options={{ headerShown: false, title: 'Add Blog'}}/>
            <Stack.Screen name="screens/ViewBlog" options={{ headerShown: true, title: 'Blog'}}/>
            <Stack.Screen name="screens/AllBlogs" options={{headerShown: true, title: 'View Blogs'}}/>
            <Stack.Screen name="screens/blogs/MyBlogs" options={{headerShown: true, title: 'My Blogs'}}/>
            <Stack.Screen name="screens/blogs/EditBlog" options={{headerShown: true, title: 'Edit Blog'}}/>

            <Stack.Screen name="screens/AddPlaces" options={{headerShown: true, title: 'Add places'}}/>
            <Stack.Screen name="screens/itinerary/ItineraryDisplay" options={{headerShown: true, title: 'Generated Itinerary'}}/>

            <Stack.Screen name="screens/events/EventsMap" options={{headerShown: true, title: 'Find Events', animation: 'default', presentation: 'card'}}/>

            <Stack.Screen
                name="screens/events/AddEvents"
                options={{
                    headerShown: true,
                    title: 'Add Events (for testing)',
                    animation: 'slide_from_bottom',
                    presentation: 'modal', // This enables the sliding modal style
                    gestureEnabled: true, // Allows you to swipe down to dismiss
                    cardStyle: {
                        borderTopRadius: 40,  // Rounded corners like a card
                        marginTop: 20,  // Slight margin to show the screen below
                    },
                }}
            />




            <Stack.Screen name="screens/Login" options={{headerShown: false, title: 'Login'}}/>
            <Stack.Screen name="screens/SignUp" options={{headerShown: false, title: 'Sign Up'}}/>
        </Stack>
    )
}

export default _layout
