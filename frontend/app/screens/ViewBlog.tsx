import React from "react";
import {ScrollView, Text, View, Image, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ViewBlog: React.FC<any> = ({route}) => {
    const {blog} = route.params;
    const screenWidth = Dimensions.get('window').width;
    const [liked, setLiked] = React.useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{blog.title}</Text>
            <View style={styles.dateContainer}>
                <Ionicons name= "calendar-outline" size = {18} color = "gray" style = {styles.timeIcon}/>
                <Text style={styles.date}>{blog.date}</Text>
                <Text style={styles.category}>{blog.category}</Text>
                <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                    <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "red" : "gray"}/>
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                {blog.images.map((image: string, index: number) => (
                    <Image key={index} source={{ uri: image }} style={styles.image} resizeMode='contain'/>
                ))}
            </View>
            <Text style={styles.content}>{blog.content}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    category: {
        fontSize: 14,
        marginBottom: 10,
        color: 'gray',
        marginRight: 10
    },
    content: {
        fontSize : 18,
        marginBottom: 10,
        fontWeight: "semibold"
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    timeIcon: {
        marginRight: 5
    },
    likeButton: {
        marginRight: 5
    },
    date: {
        fontSize: 14,
        color: 'gray',
        marginRight: 15
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'silver'
    },
});

export default ViewBlog;