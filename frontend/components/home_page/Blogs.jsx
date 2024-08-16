import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';

const Blogs = () => {
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
                <TouchableOpacity onPress={() => navigate('/blogs/allBlogs')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#2475ff', fontWeight: '500' }}>See More</Text>
                    <Text style={{ color: '#2475ff', marginLeft: 4 }}>{'\u2192'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                {images.map((image, index) => (
                    <ImageBackground
                        key={index}
                        source={image}
                        style={{ width: 300, height: 400, marginRight: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 25, overflow: 'hidden' }}
                    >
                        {/* You can add content inside the card here */}
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Blog Title</Text>
                    </ImageBackground>
                ))}
            </ScrollView>
        </View>
    );
}

export default Blogs;
