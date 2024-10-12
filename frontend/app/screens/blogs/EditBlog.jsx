import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    Image,
    Platform,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RadioButton } from 'react-native-paper';
import { doc, updateDoc, getDoc } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { router, useLocalSearchParams } from 'expo-router';
import {db} from "../../../firebaseConfig";
import travel from "../../../assets/images//demo_images/travel.jpg";
import Ionicons from "react-native-vector-icons/Ionicons";

const categories = ['Religious', 'Beach', 'Adventure', 'Wildlife', 'Food & Culinary', 'Cultural'];

const EditBlogPage = () => {
    const { blogId } = useLocalSearchParams(); // Get blog ID from query params
    const [loading, setLoading] = useState(false);
    const [blogData, setBlogData] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [titleError, setTitleError] = useState(false);
    const [contentError, setContentError] = useState(false);

    // Fetch blog data on mount
    useEffect(() => {
        console.log(blogId);
        const fetchBlog = async () => {
            const blogRef = doc(db, 'blogs', blogId);
            const blogSnap = await getDoc(blogRef);

            if (blogSnap.exists()) {
                const blog = blogSnap.data();
                setBlogData(blog);
                setTitle(blog.title);
                setCategory(blog.category);
                setContent(blog.content);
                setImages(blog.images || []);
            } else {
                Alert.alert('Error', 'Blog not found!');
                router.push('/screens/blogs/MyBlogs');
            }
        };

        fetchBlog();
    }, [blogId]);

    const handleUpdateBlog = async () => {
        // Set errors to false initially
        setTitleError(false);
        setContentError(false);

        // Validate the form
        if (!title) setTitleError(true);
        if (!content) setContentError(true);
        if (!title || !category || images.length === 0) {
            Alert.alert('Error!', 'Please fill necessary fields!');
            return;
        }

        setLoading(true);

        try {
            const storage = getStorage();
            const updatedImageUrls = [];

            for (const image of images) {
                if (!image.startsWith('https://')) {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    const storageRef = ref(storage, `blogs/${Date.now()}_${Math.random().toString(36).substring(7)}`);
                    await uploadBytes(storageRef, blob);
                    const downloadURL = await getDownloadURL(storageRef);
                    updatedImageUrls.push(downloadURL);
                } else {
                    updatedImageUrls.push(image);
                }
            }

            const updatedBlog = {
                title,
                category,
                content,
                images: updatedImageUrls,
                date: new Date().toISOString(),
            };

            const blogRef = doc(db, 'blogs', blogId);
            await updateDoc(blogRef, updatedBlog);

            Alert.alert('Success', 'Blog updated successfully!');
            router.push('/screens/blogs/MyBlogs');
        } catch (error) {
            console.error('Error updating blog', error);
            Alert.alert('Error', 'There was an error updating the blog.');
        } finally {
            setLoading(false);
        }
    };

    const selectImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            base64: false,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const uris = result.assets.map(asset => asset.uri);
            setImages([...images, ...uris]);
        }
    };

    const removeImage = (uri) => {
        setImages(images.filter(image => image !== uri));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {blogData ? (
                <>
                    <ImageBackground source={travel} style={styles.bimage}>
                        <View style={styles.headContainer}>
                            <Text style={styles.imageHead}>Share your</Text>
                            <Text style={styles.imageHead}>Experiences</Text>
                            <Text style={[styles.imageHead, { color: 'white' }]}>with the World</Text>
                        </View>
                        <View style={styles.footerContainer}>
                            <Text style={[styles.imageFootText, { color: 'white' }]}>Edit Blog</Text>
                        </View>
                    </ImageBackground>

                    <View style={styles.innerContainer}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={[styles.input, titleError && styles.errorInput]}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter blog title"
                            selectionColor='black'
                        />

                        <Text style={styles.label}>Category</Text>
                        <View style={styles.radioGroup}>
                            {categories.map((cat) => (
                                <View key={cat} style={styles.radioContainer}>
                                    <RadioButton
                                        value={cat}
                                        status={category === cat ? 'checked' : 'unchecked'}
                                        onPress={() => setCategory(cat)}
                                    />
                                    <Text>{cat}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.label}>Content</Text>
                        <TextInput
                            style={[styles.textArea, contentError && styles.errorInput]}
                            value={content}
                            onChangeText={setContent}
                            placeholder="Enter blog content..."
                            selectionColor='black'
                            multiline
                        />

                        <Text style={styles.label}>Images</Text>
                        <View style={{borderWidth: 1, borderStyle: 'dashed', width: '75%', justifyContent: 'center', padding: 10, marginTop: 10, borderColor: 'grey', marginBottom: 15}}>
                            <TouchableOpacity
                                style={{justifyContent: 'center', alignItems: 'center'}}
                                onPress={selectImages}
                            >
                                {images.length === 0 ? (
                                    <>
                                        <Ionicons name="image-outline" size={60} color="grey" />
                                        <Text style={styles.imagePickerButtonText}>Add Images</Text>
                                    </>
                                ) : (
                                    <Text style={styles.imagePickerButtonText}>Add More Images</Text>
                                )}
                            </TouchableOpacity>
                            <View style={styles.imageContainer}>
                                {images.map((image, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri: image }} style={styles.image} />
                                        <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(image)}>
                                            <Text style={styles.removeButtonText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color="black" />
                        ) : (
                            <TouchableOpacity
                                style={styles.updateBlgBttn}
                                onPress={handleUpdateBlog}
                            >
                                <Text style={styles.updateBlgBttnText}>Update Blog</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            ) : (
                <ActivityIndicator size="large" color="black" />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    innerContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bimage: {
        width: '100%',
        height: 275,  // Adjust the height as needed
        resizeMode: 'cover',  // Adjust the image to cover the entire area
        marginBottom: 20,
        borderRadius: 10,
    },
    headContainer: {
        padding: 20,
        marginTop: 25,
    },
    imageHead: {
        fontWeight: "bold",
        fontSize: 25
    },
    footerContainer: {
        position: 'absolute',
        bottom: 12,
        right: 15
    },
    imageFootText: {
        fontWeight: "bold",
        fontSize: 18,
    },
    title: {
        color: 'black',
        fontSize: 24,
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontWeight: "bold"
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
    },
    textArea: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        height: 100,
        textAlignVertical: 'top'
    },
    radioGroup: {
        width: '100%',
        marginBottom: 10
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    imagePickerButton: {
        backgroundColor: 'black',
        padding: 12,
        borderRadius: 20,
        marginBottom: 10,
    },
    imagePickerButtonText: {
        color: 'grey',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: "bold"
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 5
    },
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    image: {
        width: 100,
        height: 100,
        margin: 3,
        borderRadius: 5,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'silver',
        borderRadius: 100,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    updateBlgBttn: {
        backgroundColor: '#457c39',
        borderRadius: 10,
        width: '50%',
        padding: 12,
        marginBottom: 10,
    },
    updateBlgBttnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center"
    },
    errorInput: {
        borderColor: 'red'
    }
});

export default EditBlogPage;