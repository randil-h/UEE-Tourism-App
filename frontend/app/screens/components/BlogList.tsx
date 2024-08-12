import {db, collection} from "@/frontend/firebaseConfig";
import { onSnapshot, query, QuerySnapshot, DocumentData } from 'firebase/firestore';
import React from "react";
import {ScrollView, StyleSheet, Text, View, Image, Touchable, TouchableOpacity} from "react-native";
import {formatDate} from "tough-cookie";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";

const BlogList: React.FC = () => {
    const [blogs, setBlogs] = React.useState<any[]>([]);
    const navigation = useNavigation();

    React.useEffect(() => {
        const q = query(collection(db, 'blogs'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const blogsArray = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const date = new Date(data.date);  //converting data string to Date object
                const formattedDate = date.toLocaleDateString();    //format date into (MM/DD/YYYY)

                return {
                    id: doc.id,
                    ...doc.data(),
                    date: formattedDate,  //using formatted date type
                };
            });
            setBlogs(blogsArray);
        });

        return () => unsubscribe();

    },[]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {blogs.map((blog) => (
                <TouchableOpacity
                    key={blog.id}
                    style={styles.blogCard}
                    onPress={() => navigation.navigate('View Blog', {blog})}
                >
                    <Text style={styles.title}>{blog.title}</Text>
                    <Text style={styles.category}>Category: {blog.category}</Text>
                    <Text style={styles.content} numberOfLines={1} ellipsizeMode='tail'>{blog.content}</Text>
                    <View style={styles.dateContainer}>
                        <Ionicons name= "calendar-outline" size = {18} color = "gray" style = {styles.timeIcon}/>
                        <Text style={styles.date}>{blog.date}</Text>
                        <Ionicons name= "heart" size = {18} color = "red" style = {styles.likeIcon}/>
                    </View>
                    <View style={styles.imageContainer}>
                        {blog.images.map((image: string, index: number) => (
                            <Image key={index} source={{ uri: image }} style={styles.image} />
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
        padding: 10
    },
    blogCard: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 20,
        backgroundColor: 'rgba(231, 245, 255, 0.8)'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
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
    },
    date: {
      fontSize: 14,
      marginBottom: 10,
        color: 'gray',
        marginRight: 10
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10
    },
});

export default BlogList;