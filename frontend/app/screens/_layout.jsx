import {Stack} from "expo-router";
import React from "react";

export default function ScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="AddBlog" options={{ headerShown: false, title: 'Add Blog'}}/>
            <Stack.Screen name="ViewBlog" options={{ headerShown: true, title: 'Blog'}}/>
            <Stack.Screen name="AllBlogs" options={{headerShown: true, title: 'View Blogs'}}/>
        </Stack>
    )
} ;