import React, { useState } from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "../../firebaseConfig";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
            <Text style={styles.heading}>Sign in to your</Text>
            <Text style={styles.heading}>Account</Text>
            <Text style={styles.postHead}>Enter your email and password to log in</Text>
            <Text style={styles.preInput}>Email</Text>
            <TextInput
                style={[styles.input, emailError && styles.errorBorder]}
                placeholder="Enter your Email"
                value={email}
                onChangeText={setEmail}
                selectionColor= 'black'
            />
            <Text style={styles.preInput}>Password</Text>
            <TextInput
                style={[styles.input, passwordError && styles.errorBorder]}
                placeholder="Enter your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor= 'black'
            />
            <Text style={styles.forgot}>Forgot Password ?</Text>
            <TouchableOpacity onPress={handleLogin} style={{alignItems: 'center', backgroundColor: '#1D61E7', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 25}}>
                <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>Login</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10}}>
                <View style={{flex: 1, height: 1, backgroundColor: '#D3D3D3', marginVertical: 10, width: '50%' }} />
                <Text style={{marginHorizontal: 5, color: 'grey'}}>Or</Text>
                <View style={{flex: 1, height: 1, backgroundColor: '#D3D3D3', marginVertical: 10, width: '25%' }} />
            </View>
            <TouchableOpacity style={styles.authBttn}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name ="google" size={25} color="#DB4437"></Icon>
                    <Text style={styles.authOpt}>Continue with Google</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authBttn}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon name ="facebook" size={25} color="#4267B2"></Icon>
                    <Text style={styles.authOpt}>Continue with Facebook</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emLoginBttn}>
                <Text style={styles.emLoginTxt}>Login as Event Manager</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                <Text style={{marginTop: 25}}>Don't have an account?</Text>
                <Text style={styles.linkText} onPress={() => router.push('/screens/SignUp')}>Sign Up</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        marginHorizontal: 10

    },
    heading: {
        fontSize: 30,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    postHead: {
      fontSize: 12,
        color: 'gray',
        marginTop: 5,
        marginBottom: 15,
    },
    preInput: {
      marginBottom: 10,
        color: 'grey'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        width: '100%'
    },
    errorBorder: {
        borderColor: 'red'
    },
    forgot: {
        color: '#4D81E7',
        fontSize: 12,
        textAlign: 'right',
        marginBottom: 14
    },
    authBttn: {
      borderRadius: 10,
      borderWidth: 1,
      marginBottom: 15,
      borderColor: 'silver',
    },
    authOpt: {
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    emLoginBttn: {
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6552E5',
        marginTop: 10,
        alignSelf: 'center'
    },
    emLoginTxt: {
        color: 'white',
        fontSize: 15,
        fontWeight: '400'
    },
    linkText: {
        marginTop: 25,
        textAlign: 'center',
        color: 'blue',
        marginHorizontal: 8
    },
});

export default Login;
