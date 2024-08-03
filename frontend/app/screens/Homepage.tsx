import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Button} from 'react-native';
import {useEffect, useState} from "react";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

const HomePage: React.FC = () => {
    const navigation = useNavigation();

  return (
      <View style={styles.container}>
          <Text style={styles.title}>Home Page</Text>
          <TouchableOpacity
              style={styles.blgBttn}
              onPress={() => navigation.navigate('New Blog')}
          >
              <Text style={styles.blgbttnText}>Add Blog</Text>
          </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
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
    blgBttn: {
        backgroundColor: 'black',
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 20
    },
    blgbttnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    blogContainer: {
        marginBottom: 20,
    },

    blogTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    snippet: {
        fontSize: 14,
        marginBottom: 10,
    },
    link: {
        fontSize: 12,
        color: 'blue',
    },
});

export default HomePage;
