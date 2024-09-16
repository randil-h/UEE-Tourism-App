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
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderColor: '#d5d5d5',
        marginTop: 16,
        paddingTop: 0,
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryButton: {

        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderStyle: 'solid',
        borderColor: '#d5d5d5',
        borderRightWidth: 1,

    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2e2e2e',
    },
});

export default CategoriesBar;
