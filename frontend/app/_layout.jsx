import { Stack } from 'expo-router';
import TabBar from "../components/navbar/TabBar";
import AddPlaceForm from "./AddPlaces";

export default function Layout() {
    return (
        <Stack>
            {/* Define the tabs route */}
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, tabBar: () => <TabBar /> }}
            />
            {/* Define other screens here */}
            <Stack.Screen name="add-place-form" component={AddPlaceForm} />
        </Stack>
    );
}
