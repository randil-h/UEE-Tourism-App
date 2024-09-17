import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // Import BlurView
import TabBarButton from './TabBarButton';
import colorScheme from "../../assets/colors/colorScheme";

const TabBar = ({ state, descriptors, navigation }) => {
    const primaryColor = colorScheme.accent;
    const greyColor = colorScheme.black;

    return (
        <View style={styles.container}>
            <BlurView intensity={90} tint={"systemChromeMaterialLight"} style={styles.tabbar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    if(['_sitemap', '+not-found'].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarButton
                            key={route.name}
                            style={styles.tabbarItem}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            isFocused={isFocused}
                            routeName={route.name}
                            color={isFocused ? primaryColor : greyColor}
                            label={label}
                        />
                    );
                })}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 0,
        borderRadius: 0,
        overflow: 'hidden', // Ensure the blur view respects the border radius
    },
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 25,
        backgroundColor: 'transparent', // Ensure the blur effect is visible

        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
    }
});

export default TabBar;
