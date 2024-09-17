import React, { useState } from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import {auth} from "../../firebaseConfig";
import {router} from "expo-router";

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSignup = () => {

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

        if(password !== confirmPassword){
            Alert.alert('Error!', 'Passwords do not match.');
            return;
        }

        if(!isValid) {
            Alert.alert('Signup Failed!', 'Please enter both email and password!');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                updateProfile(user, {
                    displayName: fullName,
                })
                    .then(() => {
                        Alert.alert('Success', 'Account created successfully!');
                        router.push('/screens/Login');
                    })
                    .catch((error) => {
                        Alert.alert('Profile Update Failed', error.message);
                    });
            })
            .catch((error) => {
                Alert.alert('Oops! Signup Failed', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            selectionColor= 'black'
            />
            <TextInput
                style={[styles.input, emailError && styles.borderError]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                selectionColor= 'black'
            />
            <TextInput
                style={[styles.input, passwordError && styles.borderError]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor= 'black'
            />
            <TextInput
                style={[styles.input]}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                selectionColor= 'black'
            />
            <TouchableOpacity onPress={handleSignup} style={{alignItems: 'center', backgroundColor: 'blue', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 25}} >
                <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>Signup</Text>
            </TouchableOpacity>
            <Text style={styles.linkText} onPress={() => router.push('/screens/Login')}>
                Already have an account? Log In
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center'
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
    borderError: {
      borderColor: 'red'
    },
    linkText: {
        marginTop: 15,
        textAlign: 'center',
        color: 'blue',
    },
});

export default Signup;
