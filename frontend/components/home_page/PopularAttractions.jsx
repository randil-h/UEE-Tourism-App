import {View, Text, ScrollView} from 'react-native'
import React from 'react'

import { MaterialIcons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

const PopularAttractions = () => {
    const popular_attraction_categories = [
        { name: 'Safari', icon: 'nature' },
        { name: 'Beaches', icon: 'beach-access' },
        { name: 'Hotels', icon: 'hotel' },
        { name: 'Viewpoints', icon: 'landscape' },
        { name: 'Lakes', icon: 'waves' },
        { name: 'Temples', icon: 'account-balance' },
        { name: 'Parks', icon: 'park' },
        { name: 'Museums', icon: 'museum' },
        { name: 'Mountains', icon: 'terrain' },
        { name: 'Shopping', icon: 'shopping-cart' },
    ];

    const getRandomGradient = () => {
        const colors = [
            ['#A8E063', '#56AB2F'],
            ['#FDC830', '#F37335'],
            ['#FF9966', '#FF5E62'],
            ['#76B852', '#8DC26F'],
            ['#F4C20D', '#F39C12'],
            ['#b0dc70', '#77aa3d'],
            ['#FFAB40', '#FF8C00'],
            ['#fae77a', '#e4c132'],
            ['#F48FB1', '#F06292'],
            ['#FF7043', '#FF5722'],
        ];
        return colors.sort(() => Math.random() - 0.5);
    };

    const gradients = getRandomGradient();

    return (

    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
        {popular_attraction_categories.map((attraction, index) => {
            const gradient = gradients[index % gradients.length];
            return (
                <View key={index} style={{ alignItems: 'center', marginRight: 16 }}>
                    <LinearGradient
                        colors={gradient}
                        style={{ width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <MaterialIcons name={attraction.icon} size={24} color="#fff" />
                    </LinearGradient>
                    <Text style={{ marginTop: 8, fontSize: 12, fontWeight: '500', textAlign: 'center' }}>{attraction.name}</Text>
                </View>
            );
        })}
    </ScrollView>
    )
}

export default PopularAttractions
