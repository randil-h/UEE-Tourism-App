import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Route = () => {
    const [numDays, setNumDays] = useState('');
    const [startDate, setStartDate] = useState('');
    const [activityPreference, setActivityPreference] = useState('sightseeing');
    const [budget, setBudget] = useState('low');

    const handleGetItinerary = () => {
        console.log('Number of Days:', numDays);
        console.log('Starting Date:', startDate);
        console.log('Budget:', budget);
        console.log('Activity Preference:', activityPreference);
    };

    const RadioButton = ({ label, value, selectedValue, onSelect }) => (
        <TouchableOpacity style={styles.radioItem} onPress={() => onSelect(value)}>
            <View style={[styles.radioButton, value === selectedValue && styles.radioButtonSelected]} />
            <Text style={styles.radioText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Unveil Sri Lanka</Text>
            <Text style={styles.subtitleSmall}>Tailored Itinerary just for you</Text>
            <TextInput
                style={styles.input}
                placeholder="Number of Days"
                value={numDays}
                onChangeText={setNumDays}
                keyboardType="numeric"
            />
            <Text style={styles.subtitle}>Activity Preferences</Text>
            <View style={styles.radioGroupContainer}>
                <RadioButton label="Sightseeing" value="sightseeing" selectedValue={activityPreference} onSelect={setActivityPreference} />
                <RadioButton label="Cultural" value="cultural" selectedValue={activityPreference} onSelect={setActivityPreference} />
                <RadioButton label="Adventurous" value="adventurous" selectedValue={activityPreference} onSelect={setActivityPreference} />
                <RadioButton label="Wildlife" value="wildlife" selectedValue={activityPreference} onSelect={setActivityPreference} />
            </View>
            <Text style={styles.subtitle}>Budget</Text>
            <View style={styles.radioGroupContainer}>
                <RadioButton label="Low" value="low" selectedValue={budget} onSelect={setBudget} />
                <RadioButton label="Mid" value="mid" selectedValue={budget} onSelect={setBudget} />
                <RadioButton label="High" value="high" selectedValue={budget} onSelect={setBudget} />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleGetItinerary}>
                <Text style={styles.buttonText}>Get My Itinerary</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        marginBottom: 20,
        marginTop: 25,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 20,
        marginBottom: 10,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    radioGroupContainer: {
        alignItems: 'flex-start',
        width: '100%',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        backgroundColor: 'black',
    },
    radioText: {
        marginLeft: 8,
        fontSize: 16,
    },
    subtitleSmall: {
        marginBottom: 10,
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: 'black',
        padding: 12,
        borderRadius: 50,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Route;
