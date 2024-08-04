import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const ItineraryPage: React.FC = () => {
    const [numDays, setNumDays] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [activityPreference, setActivityPreference] = React.useState('sightseeing');

    const [budget, setBudget] = React.useState('low');

    const handleGetItinerary = () => {
        // Handle the form submission logic here
        console.log('Number of Days:', numDays);
        console.log('Starting Date:', startDate);
        console.log('Budget:', budget);
        console.log('Activity Preference:', activityPreference);

        // You can add more logic to generate the itinerary here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Itinerary Page</Text>
            <TextInput
                style={styles.input}
                placeholder="Number of Days"
                keyboardType="numeric"
                value={numDays}
                onChangeText={setNumDays}
            />
            <TextInput
                style={styles.input}
                placeholder="Starting Date (YYYY-MM-DD)"
                value={startDate}
                onChangeText={setStartDate}
            />
            <Text style={styles.subtitle}>Activity Preferences</Text>
            <RadioButton.Group onValueChange={setActivityPreference} value={activityPreference}>
                <View style={styles.radioContainer}>
                    <RadioButton value="sightseeing" />
                    <Text style={styles.radioText}>Sightseeing</Text>
                </View>
                <View style={styles.radioContainer}>
                    <RadioButton value="cultural" />
                    <Text style={styles.radioText}>Cultural</Text>
                </View>
                <View style={styles.radioContainer}>
                    <RadioButton value="adventurous" />
                    <Text style={styles.radioText}>Adventurous</Text>
                </View>
            </RadioButton.Group>
            <Text style={styles.subtitle}>Budget</Text>
            <RadioButton.Group onValueChange={setBudget} value={budget}>
                <View style={styles.radioContainer}>
                    <RadioButton value="low" />
                    <Text style={styles.radioText}>Low</Text>
                </View>
                <View style={styles.radioContainer}>
                    <RadioButton value="mid" />
                    <Text style={styles.radioText}>Mid</Text>
                </View>
                <View style={styles.radioContainer}>
                    <RadioButton value="high" />
                    <Text style={styles.radioText}>High</Text>
                </View>
            </RadioButton.Group>
            <TouchableOpacity style={styles.button} onPress={handleGetItinerary}>
                <Text style={styles.buttonText}>Get My Itinerary</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        marginBottom: 20,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 20,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
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
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioText: {
        marginLeft: 10,
        fontSize: 16,
    },
    button: {
        marginTop: 20,
        backgroundColor: 'black',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ItineraryPage;
