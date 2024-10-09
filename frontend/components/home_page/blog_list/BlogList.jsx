import React from "react";
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {collection, onSnapshot, query, orderBy, limit} from "@firebase/firestore";
import {auth, db} from "../../../firebaseConfig";
import {useRouter} from "expo-router";

const BlogList = () => {
    const [blogs, setBlogs] = React.useState([]);
    const router = useRouter();
    const currentUser = auth.currentUser;

    React.useEffect(() => {
        const q = query(collection(db, 'blogs'),
            orderBy('date', 'desc'),
            limit(5));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const blogsArray = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const date = new Date(data.date);  // converting date string to Date object
                const formattedDate = date.toLocaleDateString();  // format date into (MM/DD/YYYY)

                return {
                    id: doc.id,
                    ...data,
                    date: formattedDate,  // using formatted date
                };
            });
            setBlogs(blogsArray);
        });

        return () => unsubscribe();
    }, []);

    return (
        <ScrollView horizontal contentContainerStyle={styles.container}>
            {blogs.map((blog) => (
                <TouchableOpacity
                    key={blog.id}
                    style={styles.blogCard}
                    onPress={() => router.push(`screens/ViewBlog?blog=${encodeURIComponent(JSON.stringify(blog))}`)}
                >
                    <View style={styles.imageContainer}>
                        {blog.images.map((image, index) => (
                            <ImageBackground key={index} source={{ uri: image }} style={styles.image} >
                                <View style={styles.overlayz}>
                                    <Text style={styles.title}>{blog.title}</Text>
                                    <View style={styles.dateContainer}>
                                        <Ionicons
                                            name={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "heart" : "heart-outline"}
                                            size={24}
                                            color={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "red" : "red"}
                                            style={styles.likeIcon}
                                        />
                                    </View>
                                </View>
                            </ImageBackground>
                        ))}
                    </View>
                </TouchableOpacity>

            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    overlayz: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',  // semi-transparent black overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 10,
        height: 450,
        marginLeft: 10,
    },
    blogCard: {
        marginBottom: 20,
        marginRight: 12,
        width: 275,
        height: 400,
        borderRadius: 20,
        backgroundColor: 'rgba(231, 245, 255, 0.8)',
        overflow: 'hidden'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        alignContent: 'center',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',  // shadow for better readability
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    category: {
        fontSize: 14,
        marginBottom: 8,
        color: 'gray'
    },
    content: {
        fontSize: 16,
        marginBottom: 8
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    timeIcon: {
        marginRight: 5
    },
    likeIcon: {
        marginRight: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',  // shadow for better readability
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    date: {
        fontSize: 14,
        marginBottom: 10,
        color: 'gray',
        marginRight: 10
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',

    },
});

export default BlogList;
