import React, { useState } from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "../../firebaseConfig";
import {router} from "expo-router";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLogin = () => {
        let isValid = true;
        if(!email) {
            setEmailError(true);
            isValid = false;
        }else {
            setEmailError(false);
        }

        if (!password) {
            setPasswordError(true);
            isValid = false;
        }else {
            setPasswordError(false);
        }

        if(!isValid) {
            Alert.alert('Login Failed!', 'Please enter both email and password!');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                Alert.alert('Login Successful!');
                // Navigate to the home screen
                router.push('events');
            })
            .catch((error) => {
                Alert.alert('Login Failed!', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <TextInput
                style={[styles.input, emailError && styles.errorBorder]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                selectionColor= 'black'
            />
            <TextInput
                style={[styles.input, passwordError && styles.errorBorder]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor= 'black'
            />
            <TouchableOpacity onPress={handleLogin} style={{alignItems: 'center', backgroundColor: 'blue', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 25}}>
                <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.linkText} onPress={() => router.push('/screens/SignUp')}>
                Don't have an account? Sign Up
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',

    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        width: '90%'
    },
    errorBorder: {
        borderColor: 'red'
    },
    linkText: {
        marginTop: 15,
        textAlign: 'center',
        color: 'blue',
    },
});

export default Login;
