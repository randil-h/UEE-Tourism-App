import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Button, TextInput, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BlogList from "@/frontend/app/screens/components/BlogList";

const HomePage: React.FC = () => {
    const navigation = useNavigation();

  return (

      <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.searchContainer}>
              <Ionicons name= "search" size = {20} color = "gray" style = {styles.searchIcon}/>
              <TextInput
                  style={styles.search}
                  placeholder={'Search here....'}
                  selectionColor= 'black'
              />
          </View>
          <Text style={styles.title}>Home Page</Text>
          <TouchableOpacity
              style={styles.blgBttn}
              onPress={() => navigation.navigate('New Blog')}
          >
              <Text style={styles.blgbttnText}>Add Blog</Text>
          </TouchableOpacity>
          <Text style={styles.title1}>Blogs</Text>
          <BlogList navigation={navigation}/>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '80%',
    },
    search: {
        fontSize: 16
    },
    searchIcon: {
        marginRight: 10
    },
    title: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    title1: {
        marginTop: 10,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
        paddingHorizontal: 20,
        alignSelf: 'flex-start'
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
