import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Route = () => {
    const [numDays, setNumDays] = useState('');
    const [startDate, setStartDate] = useState('');
    const [activityPreferences, setActivityPreferences] = useState([]);
    const [budget, setBudget] = useState([]);

    const handleGetItinerary = () => {
        console.log('Number of Days:', numDays);
        console.log('Starting Date:', startDate);
        console.log('Budget:', budget);
        console.log('Activity Preferences:', activityPreferences);
    };

    const toggleSelection = (value, type) => {
        if (type === 'activity') {
            setActivityPreferences(prevState =>
                prevState.includes(value)
                    ? prevState.filter(item => item !== value)
                    : [...prevState, value]
            );
        } else if (type === 'budget') {
            setBudget(prevState =>
                prevState.includes(value)
                    ? prevState.filter(item => item !== value)
                    : [...prevState, value]
            );
        }
    };

    const Box = ({ label, value, selectedValues, type }) => (
        <TouchableOpacity
            style={[styles.box, selectedValues.includes(value) && styles.boxSelected]}
            onPress={() => toggleSelection(value, type)}
        >
            <Text style={[styles.boxText, selectedValues.includes(value) && styles.boxTextSelected]}>
                {label}
            </Text>
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
            <View style={styles.boxGroupContainer}>
                <Box label="Sightseeing" value="sightseeing" selectedValues={activityPreferences} type="activity" />
                <Box label="Cultural" value="cultural" selectedValues={activityPreferences} type="activity" />
                <Box label="Adventurous" value="adventurous" selectedValues={activityPreferences} type="activity" />
                <Box label="Wildlife" value="wildlife" selectedValues={activityPreferences} type="activity" />
            </View>
            <Text style={styles.subtitle}>Budget</Text>
            <View style={styles.boxGroupContainer}>
                <Box label="Low" value="low" selectedValues={budget} type="budget" />
                <Box label="Mid" value="mid" selectedValues={budget} type="budget" />
                <Box label="High" value="high" selectedValues={budget} type="budget" />
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
    boxGroupContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    box: {
        width: '48%',
        padding: 15,
        marginVertical: 5,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    boxSelected: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    boxText: {
        fontSize: 16,
        color: 'black',
    },
    boxTextSelected: {
        color: 'white',
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
