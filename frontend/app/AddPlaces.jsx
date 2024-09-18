import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddPlaceForm = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [localPrice, setLocalPrice] = useState('');
    const [foreignPrice, setForeignPrice] = useState('');
    const [image, setImage] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddPlace = async () => {
        // Validate form fields
        if (!name || !location || !type || !localPrice || !foreignPrice || !image || !lat || !lon) {
            Alert.alert('Error', 'Please fill all fields!');
            return;
        }

        setLoading(true);

        try {
            const place = {
                name,
                location,
                type,
                price: {
                    local: parseFloat(localPrice),
                    foreign: parseFloat(foreignPrice),
                },
                image,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
            };

            const docRef = await addDoc(collection(db, 'places'), place);
            console.log('Place added with ID:', docRef.id);

            // Clear form fields
            setName('');
            setLocation('');
            setType('');
            setLocalPrice('');
            setForeignPrice('');
            setImage('');
            setLat('');
            setLon('');

            Alert.alert('Success', 'Place added successfully!');
        } catch (error) {
            console.error('Error adding place:', error);
            Alert.alert('Error', 'There was an error adding the place.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter place name"
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter location"
                />

                <Text style={styles.label}>Type</Text>
                <TextInput
                    style={styles.input}
                    value={type}
                    onChangeText={setType}
                    placeholder="Enter type"
                />

                <Text style={styles.label}>Local Price</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={localPrice}
                    onChangeText={setLocalPrice}
                    placeholder="Enter local price"
                />

                <Text style={styles.label}>Foreign Price</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={foreignPrice}
                    onChangeText={setForeignPrice}
                    placeholder="Enter foreign price"
                />

                <Text style={styles.label}>Image URL</Text>
                <TextInput
                    style={styles.input}
                    value={image}
                    onChangeText={setImage}
                    placeholder="Enter image URL"
                />

                <Text style={styles.label}>Latitude</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={lat}
                    onChangeText={setLat}
                    placeholder="Enter latitude"
                />

                <Text style={styles.label}>Longitude</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={lon}
                    onChangeText={setLon}
                    placeholder="Enter longitude"
                />

                {loading ? (
                    <ActivityIndicator size="large" color="black" />
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={handleAddPlace}>
                        <Text style={styles.submitButtonText}>Add Place</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    innerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 12,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddPlaceForm;
