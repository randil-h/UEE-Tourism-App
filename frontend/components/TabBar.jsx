import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native'
import React from 'react'
import ColorList from "../components/ColorList";
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons";


const TabBar = ({ state, descriptors, navigation }) => {
    const icons = {
        index: (props)=> <AntDesign name="home" size={26} {...props} />,
        events: (props)=> <Feather name="music" size={24} {...props} />,
        route: (props)=> <Feather name="compass" size={26} {...props} />,
        map: (props)=> <Feather name="map" size={24} {...props} />,
        profile: (props)=> <AntDesign name="user" size={26} {...props} />,
    }

    const primaryColor = '#005eff';
    const greyColor = '#737373';
    return (
        <View style={styles.tabbar}>
            <StatusBar barStyle="dark-content" />
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

               /* return (
                    <TabBarButton
                        key={route.name}
                        style={styles.tabbarItem}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name}
                        color={isFocused? primaryColor: greyColor}
                        label={label}
                    />
                )*/

                return (
                  <TouchableOpacity
                    key={route.name}
                    style={styles.tabbarItem}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                  >
                    {
                        icons[route.name]({
                            color: isFocused? primaryColor: greyColor
                        })
                    }
                    <Text style={{
                        color: isFocused ? primaryColor : greyColor,
                        fontSize: 11
                    }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    }
})

export default TabBar
