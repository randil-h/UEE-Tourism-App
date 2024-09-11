import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {collection, onSnapshot, query, orderBy} from "@firebase/firestore";
import {useRouter} from "expo-router";
import {db} from "../../firebaseConfig";
import {FontAwesome} from "@expo/vector-icons";

const AllBlogs = () => {
    const [blogs, setBlogs] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const router = useRouter();

    const categories =["All",'Religious', 'Beach', 'Adventure', 'Wildlife', 'Food & Culinary', 'Cultural'];

    React.useEffect(() => {
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

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === "All" || blog.category === selectedCategory)
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
                <TouchableOpacity onPress={() => router.push('screens/AddBlog')}>
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
                            <Ionicons name={blog.liked ? "heart" : "heart-outline"}
                                      size={20}
                                      color={blog.liked ? "red" : "red"}
                                      style={styles.likeIcon} />
                            <Ionicons name= "chatbubbles-outline" size = {18} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon}/>
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
        backgroundColor: 'rgba(178, 188, 202, 0.8)',
        overflow: 'hidden',
        paddingVertical: 5,

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        alignContent: 'center',
        color: 'black',
        textAlign: 'left',
        paddingLeft: 15,
        paddingVertical: 12
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
        marginRight: 5
    },
    likeIcon: {
        marginRight: 5
    },
    date: {
        fontSize: 14,
        marginBottom: 10,
        color: 'rgba(73, 73, 73, 0.8)',
        marginRight: 10
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
});

export default AllBlogs;
