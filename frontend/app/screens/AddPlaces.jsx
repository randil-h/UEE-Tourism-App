import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Use this if you want a picker for type selection
import {collection, addDoc, getDocs} from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust the import path as needed

const AddPlaceForm = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [localPrice, setLocalPrice] = useState('');
    const [foreignPrice, setForeignPrice] = useState('');
    const [image, setImage] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');

    const handleSubmit = async () => {
        if (!name || !location || !type || !localPrice || !foreignPrice || !image || !lat || !lon) {
            Alert.alert('Error', 'Please fill all fields!');
            return;
        }

        console.log('Attempting to add document to Firestore...');
        try {
            const placeData = {
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
                createdAt: new Date(),
            };
            console.log('Place data:', placeData);

            const docRef = await addDoc(collection(db, 'places'), placeData);
            console.log('Document written with ID:', docRef.id);

            // Verify the document was added
            console.log('Verifying document was added...');
            const querySnapshot = await getDocs(collection(db, 'places'));
            console.log('Number of documents in collection:', querySnapshot.size);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });

            Alert.alert('Success', `Place added successfully. Document ID: ${docRef.id}`);
            clearForm();
        } catch (error) {
            console.error('Error adding document:', error);
            console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            Alert.alert('Error', `Failed to add place: ${error.message}`);
        }
    };
    const clearForm = () => {
        setName('');
        setLocation('');
        setType('');
        setLocalPrice('');
        setForeignPrice('');
        setImage('');
        setLat('');
        setLon('');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Add New Place</Text>

                {/* Input fields */}
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Type"
                    value={type}
                    onChangeText={setType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Local Price"
                    keyboardType="numeric"
                    value={localPrice}
                    onChangeText={setLocalPrice}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Foreign Price"
                    keyboardType="numeric"
                    value={foreignPrice}
                    onChangeText={setForeignPrice}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Image URL"
                    value={image}
                    onChangeText={setImage}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Latitude"
                    keyboardType="numeric"
                    value={lat}
                    onChangeText={setLat}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    keyboardType="numeric"
                    value={lon}
                    onChangeText={setLon}
                />

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Add Place</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#80AF81',
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddPlaceForm;
