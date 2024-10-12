import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import React from 'react'
import ColorScheme from "../../assets/colors/colorScheme";

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
            ['#55a52f', '#a2d660'],
            ['#9bce5e', '#55a52f'],
            ['#76B852', '#8DC26F'],
            ['#96c65c', '#55a52f'],
            ['#b0dc70', '#77aa3d'],
            ['#539f30', '#72b151'],
            ['#539f30', '#89ba6b'],
            ['#89ba6b', '#74a43d'],
            ['#709e3d', '#539f30'],
        ];
        return colors.sort(() => Math.random() - 0.5);
    };

    const gradients = getRandomGradient();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 28, paddingLeft: 8 }}>Attractions</Text>

            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24, paddingVertical: 16, paddingEnd: 48}}>
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
        </View>

    )
}

export default PopularAttractions