import React, { useState } from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import {auth} from "../../firebaseConfig";
import {router, useRouter} from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useRoute} from "@react-navigation/native";

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();

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
            <View style={{ position: 'absolute', top: 60, left: 20}}>
                <TouchableOpacity style={{marginBottom: 24,}} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20}></Ionicons>
                </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Sign Up</Text>
            <Text style={styles.postHead}>Create an account to continue!</Text>
            <Text style={styles.preInput}>Full Name</Text>
            <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            selectionColor= 'black'
            />
            <Text style={styles.preInput}>Email</Text>
            <TextInput
                style={[styles.input, emailError && styles.borderError]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                selectionColor= 'black'
            />
            <Text style={styles.preInput}>Set Password</Text>
            <TextInput
                style={[styles.input, passwordError && styles.borderError]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor= 'black'
            />
            <Text style={styles.preInput}>Confirm Password</Text>
            <TextInput
                style={[styles.input]}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                selectionColor= 'black'
            />
            <TouchableOpacity onPress={handleSignup} style={{alignItems: 'center', backgroundColor: '#1D61E7', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 25, marginTop: 10}} >
                <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>Signup</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                <Text style={{marginTop: 35}}>Already have an account?</Text>
                <Text style={styles.linkText} onPress={() => router.push('/screens/Login')}>Log In</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 10,
        marginBottom: 20
    },
    heading: {
        fontSize: 30,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    postHead: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
        marginBottom: 20,
    },
    preInput: {
        marginBottom: 5,
        color: 'grey'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 13,
        borderRadius: 10,
        width: '100%'
    },
    borderError: {
      borderColor: 'red'
    },
    linkText: {
        marginTop: 35,
        textAlign: 'center',
        color: 'blue',
        marginHorizontal: 8
    },
});

export default Signup;
