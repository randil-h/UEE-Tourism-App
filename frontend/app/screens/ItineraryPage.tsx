import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Unveil Sri Lanka</Text>
                <Text style={styles.subtitleSmall}>Tailored Itinerary just for you</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Number of Days"
                    keyboardType="numeric"
                    value={numDays}
                    onChangeText={setNumDays}
                />


                <Text style={styles.subtitle}>Activity Preferences</Text>
                <RadioButton.Group onValueChange={setActivityPreference} value={activityPreference}>
                    <View style={styles.radioGroupContainer}>
                        <View style={styles.radioItem}>
                            <RadioButton value="sightseeing" />
                            <Text style={styles.radioText}>Sightseeing</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="cultural" />
                            <Text style={styles.radioText}>Cultural</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="adventurous" />
                            <Text style={styles.radioText}>Adventurous</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="wildlife" />
                            <Text style={styles.radioText}>Wild life</Text>
                        </View>
                    </View>
                </RadioButton.Group>
                <Text style={styles.subtitle}>Budget</Text>
                <RadioButton.Group onValueChange={setBudget} value={budget}>
                    <View style={styles.radioGroupContainer}>
                        <View style={styles.radioItem}>
                            <RadioButton value="low" />
                            <Text style={styles.radioText}>Low</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="mid" />
                            <Text style={styles.radioText}>Mid</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="high" />
                            <Text style={styles.radioText}>High</Text>
                        </View>
                    </View>
                </RadioButton.Group>
                <TouchableOpacity style={styles.button} onPress={handleGetItinerary}>
                    <Text style={styles.buttonText}>Get My Itinerary</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        width: '100%',
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
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ItineraryPage;