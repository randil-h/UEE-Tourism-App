import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, Alert} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {doc, collection, onSnapshot, query, orderBy, getDoc} from "@firebase/firestore";
import {useRouter} from "expo-router";
import {auth, db} from "../../firebaseConfig";
import {FontAwesome} from "@expo/vector-icons";
import {onAuthStateChanged} from "firebase/auth";

const AllBlogs = () => {
    const [blogs, setBlogs] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentUser, setCurrentUser] = useState(null);
    const [userPreferences, setUserPreferences] = useState({});
    const router = useRouter();

    const categories =["All",'Religious', 'Beach', 'Adventure', 'Wildlife', 'Food & Culinary', 'Cultural'];

    useEffect(() => {
        const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));

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

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if(user) {
                setCurrentUser(user);
                await fetchUserPreferences(user.uid);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const fetchUserPreferences = async (userId) => {
        try {
            const preferencesDoc = await getDoc(doc(db, "preferences", userId));
            if (preferencesDoc.exists()) {
                setUserPreferences(preferencesDoc.data().categories || {});
            } else {
                setUserPreferences({});
            }
        } catch (error) {
            console.error("Error fetching preferences:", error);
        }
    };

    const handleAddBlog = () => {
        if (!currentUser) {
            Alert.alert('Not Logged In!', 'You need to be logged in to add a blog.');
            router.push('/screens/Login');
        }else {
            router.push('/screens/AddBlog');
        }
    };

    const sortBlogsByPreferences = (blogs) => {
        if (!currentUser || !userPreferences || Object.keys(userPreferences).length === 0) {
            return blogs;
        }

        return blogs.sort((a, b) => {
            const likesA = userPreferences[a.category] || 0;
            const likesB = userPreferences[b.category] || 0;

            // Sort blogs with the most liked categories first
            if (likesA > likesB) {
                return -1;
            } else if (likesA < likesB) {
                return 1;
            }
            return 0; // If categories are equally liked, preserve order
        });
    };

    const filteredBlogs = sortBlogsByPreferences(
        blogs.filter((blog) =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedCategory === "All" || blog.category === selectedCategory)
        )
    );

    return (
        <View style={{ padding: 10 }}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}} >
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius:20, marginRight: 20, marginBottom: 1}}>
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
                <TouchableOpacity onPress={handleAddBlog}>
                    <FontAwesome name="plus" size={24} color="#2475ff" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginBottom: 10, paddingHorizontal: 10 }}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.selectedCategoryButton,
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.selectedCategoryText,
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <ScrollView contentContainerStyle={styles.container}>
                {filteredBlogs.map((blog) => (
                    <TouchableOpacity
                        key={blog.id}
                        style={styles.blogCard}
                        onPress={() => router.push(`screens/ViewBlog?blog=${encodeURIComponent(JSON.stringify(blog))}`)}
                    >
                       {/* <View style={styles.imageContainer}>
                            {blog.images.map((image, index) => (
                                <ImageBackground key={index} source={{ uri: image }} style={styles.image} >
                                    <Text style={styles.title}>{blog.title}</Text>
                                    <View style={styles.dateContainer}>
                                        <Ionicons name={blog.liked ? "heart" : "heart-outline"}
                                                  size={24}
                                                  color={blog.liked ? "red" : "red"}
                                                  style={styles.likeIcon} />
                                    </View>
                                </ImageBackground>
                            ))}
                        </View>*/}

                        <Text style={styles.title}>{blog.title}</Text>
                        <View style={{flexDirection: 'row', paddingLeft: 15}}>
                            <Ionicons name="create-outline" size={18} color="gray" style={styles.createIcon} />
                            <Text style={styles.uName}>{blog.userName}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            {blog.images.map((image: string, index: number) => (
                                <ImageBackground key={index} source={{ uri: image }} style={styles.image} />
                            ))}
                        </View>
                        <Text style={styles.content} numberOfLines={1} ellipsizeMode='tail'>{blog.content}</Text>
                        <View style={styles.dateContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name= "time-outline" size = {18} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon}/>
                                <Text style={styles.date}>{blog.date}</Text>
                            </View>
                            <Text style={styles.category}>{blog.category}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "heart" : "heart-outline"}
                                          size={20}
                                          color={blog.likedBy && currentUser && blog.likedBy.includes(currentUser.uid) ? "red" : "red"}
                                          style={styles.likeIcon} />
                                <Text style={{color: 'rgba(73, 73, 73, 0.8)'}}>{blog.likes}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Ionicons name="chatbubbles-outline" size={18} color="rgba(73, 73, 73, 0.8)" style={styles.timeIcon}/>
                                <View style={styles.commentCountContainer}>
                                    <Text style={styles.commentCountText}>{blog.comments ? blog.comments.length : 0}</Text>
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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
        paddingHorizontal: 5
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
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,

        // Elevation for Android
        elevation: 10,

        // 3D transformation
        transform: [{ perspective: 1000 }, { rotateX: '1deg' }, { rotateY: '-1deg' }]

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        alignContent: 'center',
        color: 'black',
        textAlign: 'left',
        paddingLeft: 15,
        paddingTop: 12,
        paddingBottom: 3
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
        fontSize: 14,
        marginBottom: 8,
        color: 'rgba(73, 73, 73, 0.8)',

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
        marginRight: 5,
        fontWeight: 500
    },
    createIcon: {
        marginRight: 3
    },
    likeIcon: {
        marginRight: 5
    },
    date: {
        fontSize: 14,
        marginBottom: 10,
        color: 'rgba(73, 73, 73, 0.8)',
        marginRight: 10,
        fontWeight: '500'
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: 200,
        paddingHorizontal: 15,
        justifyContent: 'center',
        borderRadius: 25,
        overflow: 'hidden'
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
    commentCountContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },

    commentCountText: {
        position: 'absolute', // Allows for precise placement
        top: -16, // Adjusts the vertical placement of the number
        left: -14, // Adjusts the horizontal placement of the number
        fontSize: 11,
        fontWeight: 'bold',
        color: 'rgba(73, 73, 73, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional background for better readability
        paddingHorizontal: 1,
        borderRadius: 8,

    }
});

export default AllBlogs;
