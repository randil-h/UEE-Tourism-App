import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const CategoriesBar = () => {
    const categories = ['Music', 'Safari', 'Diving', 'Sailing', 'Hiking', 'Camping'];

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                {categories.map((category, index) => (
                    <TouchableOpacity key={index} style={styles.categoryButton}>
                        <Text style={styles.text}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        marginTop: 16,
        paddingVertical: 8,
        backgroundColor: '#e3e3e3',
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 16,
        right: 16,
    },
    categoryButton: {
        backgroundColor: '#5185ec', // Tailwind lime-200 equivalent
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginRight: 8, // Add margin between buttons
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
});

export default CategoriesBar;
