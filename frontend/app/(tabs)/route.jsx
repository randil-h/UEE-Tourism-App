import React, { useState } from 'react';
import {View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {router} from "expo-router";
import generateItinerary from '../screens/itinerary/GenerateItinerary';
import ColorScheme from "../../assets/colors/colorScheme";
import {Divider} from "react-native-paper";
import colorScheme from "../../assets/colors/colorScheme";
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
    const handleGenerateItinerary = async () => {
        // Validate input fields
        if (!days || isNaN(days) || parseInt(days) <= 0) {
            alert("Please enter a valid number of days.");
            return;
        }

        if (activities.length === 0) {
            alert("Please select at least one activity preference.");
            return;
        }

        console.log('Form submitted with:', { days, budget, activities, startLocation, endLocation, touristType });

        try {
            const generatedItinerary = await generateItinerary(
                parseInt(days), // Ensure days is an integer
                budget,
                activities,
                startLocation,
                endLocation,
                touristType
            );

            // Log the generated itinerary for debugging
            console.log('Generated Itinerary:', JSON.stringify(generatedItinerary));

            // Navigate to ItineraryDisplay with the generated itinerary
            router.push({
                pathname: "/screens/itinerary/ItineraryDisplay",
                params: { itinerary: JSON.stringify(generatedItinerary), touristType }
            });
        } catch (error) {
            console.error('Error generating itinerary:', error);
            // Handle the error (e.g., show an alert to the user)
            alert('An error occurred while generating the itinerary. Please try again.');
        }
    };




    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <ImageBackground
                    source={{ uri: 'https://cdn.shopify.com/s/files/1/0026/2894/3925/t/20/assets/pf-1169a9ec--2007183484959238583074083851976799060087709n.jpg?v=1623782705' }} // Replace with your image URL
                    style={styles.imageBackground}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <Text style={styles.title1}>Smart Itinerary</Text>
                        <Text style={styles.subtitle}>Tailored Just For You</Text>
                        <Divider style={{ marginBottom: 30 }} />
                    </View>
                </ImageBackground>

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
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: ColorScheme.white,

    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with transparency
        width: '100%', // Ensures overlay covers the entire background
        padding: 20,   // Adds padding to your content
    },
    backgroundImage: {
        width: '100%',
        height: 200,
        position: 'absolute',
    },

    title1: {
        fontSize: 40,
        fontWeight: 'bold',
        color: ColorScheme.white,
        textAlign: "left",
        marginTop: 30,
    },
    title2: {
        fontSize: 40,
        fontWeight: 'bold',
        color: ColorScheme.accent,

    },
    subtitle: {
        fontSize: 28,
        color: ColorScheme.gray_text,
        fontWeight: 'bold',
        textAlign: 'left', // Aligns the text to the right
        marginTop: 0, // Adjust this value to move the subtitle down

    },
    form: {
        paddingTop: 30,
        paddingLeft:30,
        paddingRight:30,
        paddingBottom:5,
         // Adjust this value if needed to ensure form starts after the image
    },
    label: {
        fontSize: 20,
        marginVertical: 10,
        marginLeft: 10,
        fontWeight: 'bold',
        color: colorScheme.black,
    },
    input: {
        borderBottomWidth: 1.5,
        borderColor: colorScheme.accent,
        borderRadius: 0,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    budgetContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 20,
    },
    budgetButton: {
        flex: 1,
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: '#fff', // Adds a clean button background
    },
    selectedBudget: {
        backgroundColor: ColorScheme.accent,
    },
    budgetText: {
        textAlign: 'center',
        color: '#000',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    activityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Ensures even spacing
        marginBottom: 20,
        marginTop: 20,
    },
    activityButton: {
        borderRadius: 25,
        padding: 10,
        width: '49%', // Makes sure two items fit per row with some spacing
        marginBottom: 10,
        backgroundColor: '#fff', // Adds a clean button background
    },
    selectedActivity: {
        backgroundColor: colorScheme.accent,
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
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 10,
        flex: 1,
        marginRight: 10,
    },
    selectedTouristType: {
        backgroundColor: ColorScheme.accent,
    },
    touristTypeText: {
        textAlign: 'center',
        color: '#000',
    },
    generateButton: {
        borderWidth: 1,
        borderColor: ColorScheme.accent,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        width: '60%',
        alignSelf: 'center',
        marginBottom: 120,
    },

    generateButtonText: {
        color: ColorScheme.black,
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },


});

export default Itinerary;
