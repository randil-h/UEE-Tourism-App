import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, Alert } from "react-native";
import { collection, onSnapshot, query, where, getDoc, doc } from "@firebase/firestore";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../../firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";

const SaveBlogs = () => {
    const [savedBlogs, setSavedBlogs] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // Track the currently authenticated user
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Fetch saved blogs from user's preferences
    useEffect(() => {
        if (currentUser) {
            const preferencesRef = doc(db, "preferences", currentUser.uid);
            getDoc(preferencesRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const { savedBlogIds = [] } = docSnapshot.data(); // Retrieve saved blog IDs

                    if (savedBlogIds.length > 0) {
                        // Query blogs using the saved blog IDs
                        const q = query(collection(db, "blogs"), where("__name__", "in", savedBlogIds));
                        onSnapshot(q, (querySnapshot) => {
                            const blogsArray = querySnapshot.docs.map((doc) => {
                                const data = doc.data();
                                const date = new Date(data.date);
                                const formattedDate = date.toLocaleDateString();

                                return {
                                    id: doc.id,
                                    ...data,
                                    date: formattedDate,
                                };
                            });
                            setSavedBlogs(blogsArray);
                        });
                    } else {
                        setSavedBlogs([]);
                    }
                }
            });
        }
    }, [currentUser]);

    const filteredBlogs = savedBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewBlog = (blog) => {
        router.push(`screens/ViewBlog?blog=${encodeURIComponent(JSON.stringify(blog))}`);
    };

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: 20 }}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Blogs..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        selectionColor='black'
                    />
                    <TouchableOpacity>
                        <FontAwesome name="search" size={18} color="#75808c" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {filteredBlogs.length === 0 ? (
                    <Text style={styles.noBlogsText}>You haven't saved any blogs yet.</Text>
                ) : (
                    filteredBlogs.map((blog) => (
                        <TouchableOpacity
                            key={blog.id}
                            style={styles.blogCard}
                            onPress={() => handleViewBlog(blog)}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.imageContainer}>
                                    {blog.images.map((image, index) => (
                                        <ImageBackground key={index} source={{ uri: image }} style={styles.image} />
                                    ))}
                                </View>
                                <View style={{ flex: 1, padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{blog.title}</Text>
                                    <Text style={styles.category}>{blog.category}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Ionicons name="time-outline" size={16} color="rgba(73, 73, 73, 0.8)" style={styles.timeIcon} />
                                        <Text style={styles.date}>{blog.date}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    // Add your styles here
    noBlogsText: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderColor: 'gray',
        backgroundColor: '#e0e0e0',
        marginHorizontal: 15,
        marginBottom: 5,
        fontSize: 15,
    },
    container: {
        paddingBottom: 100,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        paddingHorizontal: 5,
    },
    blogCard: {
        marginBottom: 20,
        borderRadius: 25,
        backgroundColor: 'rgba(250, 250, 250, 0.9)',
        overflow: 'hidden',
        elevation: 10,
    },
    imageContainer: {
        width: '40%',
        height: 150,
        borderRadius: 25,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    category: {
        color: 'rgba(87, 87, 87, 1)',
        fontSize: 13,
        fontWeight: 'semibold',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 1.5,
        marginVertical: 2,
    },
    date: {
        fontSize: 12,
        color: 'rgba(73, 73, 73, 0.8)',
    },
    timeIcon: {
        marginRight: 2,
    },
});

export default SaveBlogs;
