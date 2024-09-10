import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import BlogList from "./blog_list/BlogList";
import { useRouter } from 'expo-router';

const Blogs = () => {
    const router = useRouter();
    const images = [
        require('../../assets/images/demo_images/image1.jpg'),
        require('../../assets/images/demo_images/image2.jpg'),
        require('../../assets/images/demo_images/image3.jpg'),
        require('../../assets/images/demo_images/image4.jpg'),
    ];

    return (
        <View >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Recent Blogs</Text>
                <TouchableOpacity onPress={() => router.push('screens/AddBlog')}>
                    <Text style={{fontWeight: 'bold',color: '#2475ff', padding: 4, borderRadius: 5}}>Add Blog</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('screens/AllBlogs')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#2475ff', fontWeight: '500' }}>See More</Text>
                    <Text style={{ color: '#2475ff', marginLeft: 4 }}>{'\u2192'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                {images.map((image, index) => (
                    <TouchableOpacity>
                        <ImageBackground
                            key={index}
                            source={image}
                            style={{ width: 300, height: 400, marginRight: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 25, overflow: 'hidden' }}
                        >
                            {/* You can add content inside the card here */}
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Blog Title</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <BlogList/>
        </View>
    );
}
export default Blogs;
