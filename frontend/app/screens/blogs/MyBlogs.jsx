import React, { useEffect, useState } from "react";
import {ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert, TextInput} from "react-native";
import {collection, onSnapshot, query, orderBy, where, deleteDoc, doc} from "@firebase/firestore";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { onAuthStateChanged } from "firebase/auth";
import {auth, db} from "../../../firebaseConfig";
import {FontAwesome} from "@expo/vector-icons";

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();


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

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(db, "blogs"),
                where("createdBy", "==", currentUser.uid), // Filter by current user's ID
                orderBy("date", "desc")
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const blogsArray = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    const date = new Date(data.date);
                    const formattedDate = date.toLocaleDateString(); // Format date to MM/DD/YYYY

                    return {
                        id: doc.id,
                        ...data,
                        date: formattedDate,
                    };
                });
                setBlogs(blogsArray);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditBlog = (blogId) => {
        router.push(`/screens/blogs/EditBlog?blogId=${blogId}`);
    };

    const handleDeleteBlog = async (blogId) => {
        Alert.alert(
            "Delete Blog!",
            "Are you sure you want to delete the blog?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "blogs", blogId));
                            Alert.alert("Success", "Blog deleted Successfully!");
                        } catch (error) {
                            console.error("Error deleting blog", error);
                            Alert.alert("Error!", 'There was an error deleting the blog.');
                        }
                    },
                },
            ],
            {cancelable: true}
        );
    };

    return (
        <View style={{ padding: 10 }}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}} >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius:20, marginBottom: 1, alignContent: 'center'}}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Blogs..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        selectionColor= 'black'
                    />
                    <TouchableOpacity>
                        <FontAwesome name="search" size={18} color="#75808c" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {filteredBlogs.length === 0 ? (
                    <Text style={styles.noBlogsText}>You haven't created any blogs yet.</Text>
                ) : (
                    filteredBlogs.map((blog) => (
                        <TouchableOpacity
                            key={blog.id}
                            style={styles.blogCard}
                            onPress={() => router.push(`screens/ViewBlog?blog=${encodeURIComponent(JSON.stringify(blog))}`)}
                        >
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.imageContainer}>
                                    {blog.images.map((image: string, index: number) => (
                                        <ImageBackground key={index} source={{ uri: image }} style={styles.image} />
                                    ))}
                                </View>
                                <View style={{flex: 1, paddingVertical: 5, paddingHorizontal: 10, justifyContent: 'center'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18}}>{blog.title}</Text>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',marginVertical: 4 }}>
                                        <Text style={styles.category}>{blog.category}</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity onPress={() => handleEditBlog(blog.id)}>
                                                <Ionicons name= "pencil-outline" size = {22} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon1}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDeleteBlog(blog.id)}>
                                                <Ionicons name= "trash-outline" size = {22} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingVertical: 4, justifyContent: 'space-between'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Ionicons name= "time-outline" size = {16} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon}/>
                                            <Text style={styles.date}>{blog.date}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Ionicons name={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "heart" : "heart-outline"}
                                                      size={16}
                                                      color={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "red" : "red"}
                                                      style={styles.likeIcon} />
                                            <Text style={{color: 'rgba(73, 73, 73, 0.8)', fontSize: 12}}>{blog.likes}</Text>
                                        </View>
                                        <Ionicons name= "chatbubbles-outline" size = {16} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon}/>
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
        fontSize: 15
    },
    container: {
        paddingBottom: 100,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop : 10,
        paddingHorizontal: 5,
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginRight: 5,
        height: 35,
        marginBottom: 15,
    },
    selectedCategoryButton: {
        backgroundColor: '#2475ff',
        height: 35,
        marginHorizontal: 5
    },
    categoryText: {
        fontSize: 14,
        color: '#000',
    },
    selectedCategoryText: {
        color: '#fff',
    },
    blogCard: {
        marginBottom: 20,
        marginRight: 14,
        width: '100%',
        borderRadius: 25,
        backgroundColor: 'rgba(250, 250, 250, 0.9)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,

        // Elevation for Android
        elevation: 10,

        // 3D transformation
        transform: [{ perspective: 1000 }, { rotateX: '3deg' }, { rotateY: '-3deg' }]
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 15,
        paddingTop: 12,
        paddingBottom: 3,
        flexWrap: 'wrap',
        borderWidth: 1
    },
    uName: {
        fontWeight: 'medium',
        alignContent: 'center',
        color: 'rgba(73, 73, 73, 0.8)',
        fontSize: 13,
        flexWrap: 'wrap',
        paddingBottom: 7,
        marginBottom: 2,
        borderRadius: 10,
    },
    category: {
        color: 'rgba(87, 87, 87, 1)',
        fontSize: 13,
        fontWeight: 'semibold',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 1.5,
        alignSelf:'flex-start',
        marginVertical: 2
    },
    content: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 10,
        paddingHorizontal: 15,
        color: 'rgba(73, 73, 73, 0.8)',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    timeIcon: {
        marginRight: 2
    },
    timeIcon1: {
        marginRight: 7
    },
    createIcon: {
        marginRight: 3
    },
    likeIcon: {
        marginRight: 2
    },
    date: {
        fontSize: 12,
        marginBottom: 10,
        color: 'rgba(73, 73, 73, 0.8)',
        marginRight: 10
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '40%',
        height: 150,
        justifyContent: 'center',
        borderRadius: 25,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',

    },
});

export default MyBlogs;
