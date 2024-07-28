import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

import openingImage from "../assets/images/kandy-lake.jpg";

const App = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={openingImage}
                resizeMode="cover"
                style={styles.background}
            >
                <Text style={styles.title}>Sri Lanka</Text>
                <Text style={styles.subtitle}>Wonder of Asia</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    subtitle: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
    },
    button: {
        marginTop: 60,
        backgroundColor: 'blue',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default App;
