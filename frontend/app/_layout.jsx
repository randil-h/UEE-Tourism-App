import { Stack } from 'expo-router';


const _layout = () => {
        return (
            <Stack>
                    {/* Tab layout screen, which includes all the tab screens */}
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                    {/* Additional screens that will be displayed above the tab bar */}
                    <Stack.Screen name="screens/AddBlog" options={{ headerShown: true, title: 'Add Blog'}}/>
                    <Stack.Screen name="screens/ViewBlog" options={{ headerShown: true, title: 'Blog'}}/>
                    <Stack.Screen name="screens/AllBlogs" options={{headerShown: true, title: 'View Blogs'}}/>
                    <Stack.Screen name="screens/blogs/MyBlogs" options={{headerShown: true, title: 'My Blogs'}}/>
                    <Stack.Screen name="screens/blogs/EditBlog" options={{headerShown: true, title: 'Edit Blog'}}/>
                    <Stack.Screen name="screens/blogs/SaveBlogs" options={{headerShown: true, title: 'Save Blogs'}}/>

                    <Stack.Screen name="screens/itinerary/ItineraryDisplay" options={{headerShown: true, title: 'Generated Itinerary'}}/>
                    <Stack.Screen name="screens/itinerary/ItineraryMapView" options={{ headerShown: true, title: 'Itinerary Map'}} />
                    <Stack.Screen name="screens/events/EventsMap" options={{headerShown: true, title: 'Find Events', animation: 'default', presentation: 'card'}}/>
                    <Stack.Screen name="screens/events/ReservedEvents" options={{headerShown: true, title: 'Reserved Events'}}/>

                    <Stack.Screen
                        name="screens/events/AddEvents"
                        options={{
                                headerShown: true,
                                title: 'Add Events (for testing)',
                                animation: 'slide_from_bottom',
                                presentation: 'modal', // This enables the sliding modal style
                                gestureEnabled: true, // Allows you to swipe down to dismiss
                        }}
                    />

                    <Stack.Screen name="screens/Login" options={{headerShown: false, title: 'Login'}}/>
                    <Stack.Screen name="screens/SignUp" options={{headerShown: false, title: 'Sign Up'}}/>
            </Stack>
        )
}

export default _layout;
