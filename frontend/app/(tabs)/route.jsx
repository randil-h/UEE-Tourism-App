import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {router} from "expo-router";
import generateItinerary from '../screens/itinerary/GenerateItinerary';
const Itinerary = () => {
    const [days, setDays] = useState('');
    const [budget, setBudget] = useState('Mid');
    const [activities, setActivities] = useState(['Sightseeing', 'Cultural']);
    const [startLocation, setStartLocation] = useState('Colombo');
    const [endLocation, setEndLocation] = useState('Kandy');
    const [touristType, setTouristType] = useState('Local');

    const sriLankaCities = [
        'Colombo', 'Kandy', 'Galle', 'Anuradhapura', 'Sigiriya', 'Nuwara Eliya',
        'Trincomalee', 'Jaffna', 'Ella', 'Mirissa', 'Dambulla', 'Polonnaruwa'
    ];

    const toggleActivity = (activity) => {
        if (activities.includes(activity)) {
            setActivities(activities.filter(a => a !== activity));
        } else {
            setActivities([...activities, activity]);
        }
    };
    const handleNavigateToAddPlace = () => {
        router.push('/screens/AddPlaces'); // Adjust the route according to your setup
    };
    const handleGenerateItinerary = () => {
            console.log('Form submitted with:', { days, budget, activities, startLocation, endLocation, touristType });

            const generatedItinerary = generateItinerary(
            parseInt(days), // Ensure days is an integer
            budget,
            activities,
            startLocation,
            endLocation,
            touristType
        );

        // Log the generated itinerary for debugging
        console.log('Generated Itinerary:', generatedItinerary);

        // Navigate to ItineraryDisplay with the generated itinerary
        router.push({
            pathname: "/screens/itinerary/ItineraryDisplay",
            params: { itinerary: JSON.stringify(generatedItinerary), touristType }
        });
    };



    return (
        <View style={styles.container}>
            <ScrollView>
                <Image
                    source={{ uri: 'https://media1.thrillophilia.com/filestore/aobaf1yw2mrowt8a50rvhq5jhavm_1582217692_galle_lighthouse.jpg?w=400&dpr=2' }}
                    style={styles.backgroundImage}
                />
                <View style={styles.overlay}>
                    <View style={styles.overlay}>
                        <Text style={styles.title1}>Build Your</Text>
                        <Text style={styles.title2}>Ideal Trip</Text>
                        <Text style={styles.subtitle}>Tailored Itinerary Just For You</Text>
                    </View>

                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>No of days</Text>
                    <TextInput
                        style={styles.input}
                        value={days}
                        onChangeText={setDays}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Budget</Text>
                    <View style={styles.budgetContainer}>
                        {['High', 'Mid', 'Low'].map(b => (
                            <TouchableOpacity
                                key={b}
                                style={[styles.budgetButton, budget === b && styles.selectedBudget]}
                                onPress={() => setBudget(b)}
                            >
                                <Text style={[styles.budgetText, budget === b && styles.selectedText]}>{b}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Activity Preferences</Text>
                    <View style={styles.activityContainer}>
                        {['Sightseeing', 'Adventurous', 'Cultural', 'Relaxation'].map(a => (
                            <TouchableOpacity
                                key={a}
                                style={[styles.activityButton, activities.includes(a) && styles.selectedActivity]}
                                onPress={() => toggleActivity(a)}
                            >
                                <Text style={[styles.activityText, activities.includes(a) && styles.selectedText]}>{a}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Starting Location</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={startLocation}
                            style={styles.picker}
                            onValueChange={(itemValue) => setStartLocation(itemValue)}
                        >
                            {sriLankaCities.map(city => (
                                <Picker.Item key={city} label={city} value={city} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Ending Location</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={endLocation}
                            style={styles.picker}
                            onValueChange={(itemValue) => setEndLocation(itemValue)}
                        >
                            {sriLankaCities.map(city => (
                                <Picker.Item key={city} label={city} value={city} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Tourist Type</Text>
                    <View style={styles.touristTypeContainer}>
                        {['Local', 'Foreign'].map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.touristTypeButton, touristType === t && styles.selectedTouristType]}
                                onPress={() => setTouristType(t)}
                            >
                                <Text style={[styles.touristTypeText, touristType === t && styles.selectedText]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.generateButton}onPress={handleGenerateItinerary}>
                        <Text style={styles.generateButtonText}>Generate My Itinerary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addPlaceButton} onPress={handleNavigateToAddPlace}>
                        <Text style={styles.addPlaceButtonText}>Add Place</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom:150,
    },
    backgroundImage: {
        width: '100%',
        height: 200,
        position: 'absolute',
    },
    overlay: {
        padding: 20,
    },
    title1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    title2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'right', // Aligns the text to the right
        marginTop: 60, // Adjust this value to move the subtitle down

    },
    form: {
        paddingTop: 2,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:5,
         // Adjust this value if needed to ensure form starts after the image
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    budgetContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    budgetButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 5,
    },
    selectedBudget: {
        backgroundColor: '#000',
    },
    budgetText: {
        textAlign: 'center',
        color: '#000',
    },
    selectedText: {
        color: '#fff',
    },
    activityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Ensures even spacing
        marginBottom: 10,
    },
    activityButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '49%', // Makes sure two items fit per row with some spacing
        marginBottom: 10,
    },
    selectedActivity: {
        backgroundColor: '#000',
    },
    activityText: {
        color: '#000',
    },
    touristTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    touristTypeButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 5,
    },
    selectedTouristType: {
        backgroundColor: '#000',
    },
    touristTypeText: {
        textAlign: 'center',
        color: '#000',
    },
    generateButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: '60%',
        alignSelf: 'center',
    },

    generateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    addPlaceButton: {
        backgroundColor: 'blue', // You can change the color to your preference
        borderRadius: 20,
        padding: 12,
        marginTop: 10, // Space between buttons
    },
    addPlaceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',

    },

});

export default Itinerary;