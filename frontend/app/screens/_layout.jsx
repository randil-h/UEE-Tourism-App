import {Stack} from "expo-router";
import React from "react";

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen name="AddBlog" options={{ headerShown: false, title: 'Add Blog'}}/>
            <Stack.Screen name="ViewBlog" options={{ headerShown: true, title: 'Blog'}}/>
            <Stack.Screen name="AllBlogs" options={{headerShown: true, title: 'View Blogs'}}/>

            <Stack.Screen name="events/EventsMap" options={{headerShown: true, title: 'Find Events', animation: 'fade', presentation: 'card'}}/>

            <Stack.Screen name="Login" options={{headerShown: false, title: 'Login'}}/>
            <Stack.Screen name="SignUp" options={{headerShown: false, title: 'Sign Up'}}/>

        </Stack>
    )
} ;
