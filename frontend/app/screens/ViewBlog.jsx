import React, { useEffect, useState } from "react";
import {ScrollView, Text, View, Image, StyleSheet, Dimensions, TouchableOpacity, Alert} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { fetchImageURL } from "../utils/fetchImageURL";
import {auth, db} from "../../firebaseConfig";
import {doc, getDoc, updateDoc} from "@firebase/firestore";

const ViewBlog = ({ route }) => {
    const { blog } = useLocalSearchParams();
    const parsedBlog = JSON.parse(decodeURIComponent(blog));
    const [liked, setLiked] = useState(false);
    const [imageURLs, setImageURLs] = useState([]);
    const [likesCount, setLikesCount] = useState(null);
    const currentUser = auth.currentUser;

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
        const fetchLikes = async () => {
            const docRef = doc(db, "blogs", parsedBlog.id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                const data = docSnap.data();
                setLikesCount(data.likes || 0);
                if (currentUser) {
                    if (data.likedBy && data.likedBy.includes(currentUser.uid)) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }
                }
            }
        };

        loadImages();
        fetchLikes();
    }, [parsedBlog.images, parsedBlog.id]);

    const toggleLike = async () => {
        if( !currentUser) {
            Alert.alert("Authentication Required!", "You must be logged in to like this blog.");
            return;
        }
        const newLikeStatus = !liked;
        const newLikesCount = newLikeStatus ? likesCount + 1 : likesCount - 1;

        setLiked(newLikeStatus);
        setLikesCount(newLikesCount);

        try {
            const docRef = doc(db, "blogs", parsedBlog.id);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            let likedBy = data.likedBy || [];

            if(newLikeStatus) {
                likedBy.push(currentUser.uid);
            }else {
                likedBy = likedBy.filter(userId => userId !== currentUser.uid);
            }

            await updateDoc(docRef, {
                likes: newLikesCount,
                likedBy: likedBy
            });
        } catch (error) {
            console.error("Error updating likes", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{parsedBlog.title}</Text>
            <View style={{flexDirection: 'row'}}>
                <Ionicons name="create-outline" size={18} color="gray" style={styles.timeIcon} />
                <Text style={styles.uName}>{parsedBlog.userName}</Text>
            </View>
            <View style={styles.dateContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Ionicons name="calendar-outline" size={18} color="gray" style={styles.timeIcon} />
                    <Text style={styles.date}>{parsedBlog.date}</Text>
                </View>
                <Text style={styles.category}>{parsedBlog.category}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                        <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "red" : "gray"} />
                    </TouchableOpacity>
                    <Text style={{color: 'rgba(87, 87, 87, 1)', marginRight: 15}}>{likesCount}</Text>
                </View>
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
        marginBottom: 2
    },
    category: {
        fontSize: 14,
        marginBottom: 10,
        color: 'gray',
        marginRight: 10,
    },
    content: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: "semi-bold",
        color: 'rgba(87, 87, 87, 1)'
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    uName: {
        color: 'rgba(87, 87, 87, 1)',
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 'semibold',
        backgroundColor: 'rgba(190, 189, 190, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 8
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
