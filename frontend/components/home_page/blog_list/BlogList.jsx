
import React from "react";
import { ScrollView, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, onSnapshot, query, orderBy, limit } from "@firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { useRouter } from "expo-router";
import ColorScheme from "../../../assets/colors/colorScheme";

const BlogList = () => {
    const [blogs, setBlogs] = React.useState([]);
    const router = useRouter();
    const currentUser = auth.currentUser;

    React.useEffect(() => {
        const q = query(collection(db, 'blogs'), orderBy('date', 'desc'), limit(5));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const blogsArray = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const date = new Date(data.date);
                const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                return {
                    id: doc.id,
                    ...data,
                    date: formattedDate,
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
                            <ImageBackground key={index} source={{ uri: image }} style={styles.image}>
                                {/* Dark overlay */}
                                <View style={styles.overlay} />

                                {/* Like button (placed directly under ImageBackground) */}
                                <View style={styles.likeContainer}>
                                    <Ionicons
                                        name={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "heart" : "heart-outline"}
                                        size={24}
                                        color="red"
                                        style={styles.likeIcon}
                                    />
                                </View>

                                {/* Blog content */}
                                <View style={styles.contentContainer}>
                                    <Text style={styles.title}>{blog.title}</Text>

                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.userName}>By {blog.userName}</Text>
                                        <Text style={styles.date}>{blog.date}</Text>
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
    container: {
        flexGrow: 1,
        padding: 10,
        height: 450,
        marginLeft: 10,
    },
    blogCard: {
        marginBottom: 20,
        marginRight: 12,
        width: 250,
        height: 400,
        backgroundColor: 'rgba(231, 245, 255, 0.8)',
        overflow: 'hidden',
        borderRadius: 25,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',  // Ensure children can be positioned absolutely
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    contentContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    detailsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 30,
        alignItems: 'flex-start',
    },
    userName: {
        fontSize: 12,
        color: ColorScheme.gray_text,
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: ColorScheme.gray_text,
        fontStyle: 'italic',
    },
    likeContainer: {
        position: 'absolute',
        top: 16,
        right: 16,  // Moves the like button to the top right corner
        zIndex: 3,  // Ensure the like button is on top of other elements
    },
    likeIcon: {
        marginRight: 5,
    },
});

export default BlogList;
