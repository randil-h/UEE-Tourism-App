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
                                <Text style={styles.title}>{blog.title}</Text>
                                <View style={styles.dateContainer}>
                                    <Ionicons name={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "heart" : "heart-outline"}
                                              size={24}
                                              color={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "red" : "red"}
                                              style={styles.likeIcon} />
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
    container: {
        flexGrow: 1,
        padding: 10,
        height: 450,
        marginLeft: 10,
    },
    blogCard: {
        marginBottom: 20,
        marginRight: 14,
        width: 300,
        height: 400,
        borderRadius: 25,
        backgroundColor: 'rgba(231, 245, 255, 0.8)',
        overflow: 'hidden'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        alignContent: 'center',
        color: 'white',
        textAlign: 'center'
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
        marginRight: 5
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
