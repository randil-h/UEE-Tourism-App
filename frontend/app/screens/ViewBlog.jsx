import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { fetchImageURL } from "../utils/fetchImageURL";

const ViewBlog = ({ route }) => {
    const { blog } = useLocalSearchParams();
    const parsedBlog = JSON.parse(decodeURIComponent(blog));
    const [liked, setLiked] = useState(false);
    const [imageURLs, setImageURLs] = useState([]);

    useEffect(() => {
        const loadImages = async () => {
            const urls = await Promise.all(
                parsedBlog.images.map(async (imagePath) => {
                    const url = await fetchImageURL(imagePath);
                    return url;
                })
            );
            setImageURLs(urls);
        };
        loadImages();
    }, [parsedBlog.images]);

    const toggleLike = () => {
        setLiked(!liked);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{parsedBlog.title}</Text>
            <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={18} color="gray" style={styles.timeIcon} />
                <Text style={styles.date}>{parsedBlog.date}</Text>
                <Text style={styles.category}>{parsedBlog.category}</Text>
                <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                    <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "red" : "gray"} />
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                {imageURLs.map((url, index) => (
                    <Image
                        key={index}
                        source={{ uri: url }}
                        style={styles.image}
                        resizeMode='cover'  // Changed to 'cover' to fill the container
                    />
                ))}
            </View>
            <Text style={styles.content}>{parsedBlog.content}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    category: {
        fontSize: 14,
        marginBottom: 10,
        color: 'gray',
        marginRight: 10,
    },
    content: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "semibold",
        color: 'rgba(87, 87, 87, 1)'
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    timeIcon: {
        marginRight: 5,
    },
    likeButton: {
        marginRight: 5,
    },
    date: {
        fontSize: 14,
        color: 'gray',
        marginRight: 15,
    },
    imageContainer: {
        width: '100%',
        height: 400,
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 25
    },
});

export default ViewBlog;
