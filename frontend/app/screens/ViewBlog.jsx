import React, { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { fetchImageURL } from "../utils/fetchImageURL";
import {auth, db} from "../../firebaseConfig";
import {doc, getDoc, updateDoc, setDoc} from "@firebase/firestore";
import {FlatList, GestureHandlerRootView} from "react-native-gesture-handler";
import {Divider} from "react-native-paper";

const ViewBlog = ({ route }) => {
    const { blog } = useLocalSearchParams();
    const parsedBlog = JSON.parse(decodeURIComponent(blog));
    const [liked, setLiked] = useState(false);
    const [imageURLs, setImageURLs] = useState([]);
    const [likesCount, setLikesCount] = useState(null);
    const [comments, setComments] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newComment, setNewComment] = useState('');
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([loadImages(), fetchLikes()]);
        };
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
                setComments(data.comments || []);
                if (currentUser) {
                    if (data.likedBy && data.likedBy.includes(currentUser.uid)) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }
                }
            }
        };

        fetchData();
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

            const userPreferencesRef = doc(db, "preferences", currentUser.uid);
            const userPreferencesSnap = await getDoc(userPreferencesRef);

            if(newLikeStatus) {
                if(userPreferencesSnap.exists()) {
                    const userData = userPreferencesSnap.data();
                    const categoryMap = userData.categories || {};
                    categoryMap[parsedBlog.category] = (categoryMap[parsedBlog.category] || 0) + 1;

                    await updateDoc(userPreferencesRef, {
                        categories: categoryMap
                    });
                } else {
                    await setDoc(userPreferencesRef, {
                        userId: currentUser.uid,
                        userName: currentUser.displayName || "Anonymous",
                        categories: {
                            [parsedBlog.category]: 1
                        }
                    });
                }
            } else {
                if (userPreferencesSnap.exists()) {
                    const userData = userPreferencesSnap.data();
                    const categoryMap = userData.categories || {};

                    if(categoryMap[parsedBlog.category]) {
                        categoryMap[parsedBlog.category] = Math.max(0, categoryMap[parsedBlog.category] - 1);
                        await updateDoc(userPreferencesRef, {
                            categories: categoryMap
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error updating likes", error);
        }
    };

    /*const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const addComment = async () => {
        if(!currentUser) {
            Alert.alert('Authentication Required!', 'You must be logged in to comment on this blog.');
            return;
        }
        const newCommentObj = {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Anonymous",
            content: newComment,
            date: new Date().toLocaleDateString()
        };

        const updateComments = [...comments, newCommentObj];
        setComments(updateComments);
        setNewComment("");

        try {
            const docRef = doc(db, "blogs", parsedBlog.id);
            await updateDoc(docRef, {
                comments: updateComments
            });
        }catch (error) {
            console.error("Error adding comment", error);
        }
    };*/

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
                <TouchableOpacity>
                    <Ionicons name= "chatbubbles-outline" size = {18} color = "rgba(73, 73, 73, 0.8)" style = {styles.timeIcon}/>
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
            {/*<Modal
                visible={isModalVisible}
                onRequestClose={toggleModal}
                style={styles.modal}
                animationType= "slide"
                transparent={true}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
                    <View style={styles.modalContent}>
                        <GestureHandlerRootView>
                            <Divider style={{width: '25%', height: '1.5%', alignSelf: 'center', marginBottom: 5}}></Divider>
                            <Text style={{fontWeight: 'bold', fontSize: 22, marginBottom: 5}}>Comments</Text>
                            <FlatList
                                data={comments}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.commentItem}>
                                        <Text style={styles.commentUser}>{item.userName}</Text>
                                        <Text>{item.content}</Text>
                                        <Text style={styles.commentDate}>{item.date}</Text>
                                    </View>
                                )}
                            />
                        </GestureHandlerRootView>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                            selectionColor= 'black'
                        />
                        <TouchableOpacity onPress={addComment} style={{backgroundColor: 'black', borderRadius: 10, alignSelf: 'flex-start'}}>
                            <Text style={{color: 'white', fontWeight: 'bold', padding: 5}}>Post Comment</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>*/}
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
        fontSize: 13,
        marginBottom: 10,
        fontWeight: 'semibold',
        backgroundColor: 'rgba(190, 189, 190, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 1.5
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
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns the modal at the bottom of the screen
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    },
    modalContent: {
        height: '50%',
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    commentItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    commentUser: {
        fontWeight: 'bold',
        fontSize: 14
    },
    commentDate: {
        fontSize: 12,
        color: 'gray',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    }
});

export default ViewBlog;
