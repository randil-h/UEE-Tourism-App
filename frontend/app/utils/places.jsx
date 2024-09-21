// app/data/places.js
import { Image } from 'react-native';

export const places = [
    {
        name: 'Sigiriya',
        location: 'Sigiriya',
        type: 'Sightseeing',
        ticketPrice: { local: 500, foreign: 30 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.957, lon: 80.760
    },
    {
        name: 'Temple of the Tooth',
        location: 'Kandy',
        type: 'Cultural',
        ticketPrice: { local: 300, foreign: 10 },
        imageSource : require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.293, lon: 80.641
    },
    {
        name: 'Galle Fort',
        location: 'Galle',
        type: 'Sightseeing',
        ticketPrice: { local: 200, foreign: 12 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.026, lon: 80.217
    },
    {
        name: 'Ella Rock',
        location: 'Ella',
        type: 'Adventurous',
        ticketPrice: { local: 150, foreign: 8 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.866, lon: 81.046
    },
    {
        name: 'Nuwara Eliya Tea Plantations',
        location: 'Nuwara Eliya',
        type: 'Sightseeing',
        ticketPrice: { local: 400, foreign: 15 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.970, lon: 80.782
    },
    {
        name: 'Minneriya National Park',
        location: 'Minneriya',
        type: 'Sightseeing',
        ticketPrice: { local: 500, foreign: 25 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 8.032, lon: 80.897
    },
    {
        name: 'Yala National Park',
        location: 'Yala',
        type: 'Adventurous',
        ticketPrice: { local: 600, foreign: 35 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.363, lon: 81.521
    },
    {
        name: 'Adams Peak',
        location: 'Hatton',
        type: 'Adventurous',
        ticketPrice: { local: 100, foreign: 10 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.809, lon: 80.499
    },
    {
        name: 'Dambulla Cave Temple',
        location: 'Dambulla',
        type: 'Cultural',
        ticketPrice: { local: 400, foreign: 20 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.856, lon: 80.650
    },
    {
        name: 'Mirissa Beach',
        location: 'Mirissa',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 5.948, lon: 80.459
    },
    {
        name: 'Polonnaruwa Ancient City',
        location: 'Polonnaruwa',
        type: 'Cultural',
        ticketPrice: { local: 500, foreign: 25 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.939, lon: 81.002
    },
    {
        name: 'Pinnawala Elephant Orphanage',
        location: 'Pinnawala',
        type: 'Sightseeing',
        ticketPrice: { local: 350, foreign: 20 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.301, lon: 80.384
    },
    {
        name: 'Unawatuna Beach',
        location: 'Unawatuna',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 5.978, lon: 80.440
    },
    {
        name: 'Trincomalee Harbor',
        location: 'Trincomalee',
        type: 'Sightseeing',
        ticketPrice: { local: 200, foreign: 10 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 8.571, lon: 81.233
    },
    {
        name: 'Jaffna Fort',
        location: 'Jaffna',
        type: 'Cultural',
        ticketPrice: { local: 150, foreign: 7 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 9.661, lon: 80.011
    },
    {
        name: 'Udawalawe National Park',
        location: 'Udawalawe',
        type: 'Adventurous',
        ticketPrice: { local: 400, foreign: 25 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.472, lon: 80.888
    },
    {
        name: 'Ravana Falls',
        location: 'Ella',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.852, lon: 81.046
    },
    {
        name: 'Horton Plains National Park',
        location: 'Nuwara Eliya',
        type: 'Adventurous',
        ticketPrice: { local: 500, foreign: 30 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.801, lon: 80.789
    },
    {
        name: 'Bentota Beach',
        location: 'Bentota',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.428, lon: 80.000
    },
    {
        name: 'Pigeon Island',
        location: 'Trincomalee',
        type: 'Adventurous',
        ticketPrice: { local: 350, foreign: 15 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 8.718, lon: 81.221
    },
    {
        name: 'Independence Square',
        location: 'Colombo',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.927, lon: 79.861
    },
    {
        name: 'Gangaramaya Temple',
        location: 'Colombo',
        type: 'Cultural',
        ticketPrice: { local: 100, foreign: 5 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.927, lon: 79.860
    },
    {
        name: 'Nine Arches Bridge',
        location: 'Ella',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.874, lon: 81.049
    },
    {
        name: 'Kelaniya Temple',
        location: 'Kelaniya',
        type: 'Cultural',
        ticketPrice: { local: 100, foreign: 5 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.961, lon: 79.931
    },
    {
        name: 'Whale Watching',
        location: 'Mirissa',
        type: 'Adventurous',
        ticketPrice: { local: 2500, foreign: 50 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 5.948, lon: 80.459
    },
    {
        name: 'Koneswaram Temple',
        location: 'Trincomalee',
        type: 'Cultural',
        ticketPrice: { local: 200, foreign: 10 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 8.569, lon: 81.233
    },
    {
        name: 'Knuckles Mountain Range',
        location: 'Kandy',
        type: 'Adventurous',
        ticketPrice: { local: 300, foreign: 20 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.466, lon: 80.786
    },
    {
        name: 'Colombo National Museum',
        location: 'Colombo',
        type: 'Cultural',
        ticketPrice: { local: 200, foreign: 10 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.927, lon: 79.861
    },
    {
        name: 'Dutch Hospital',
        location: 'Galle',
        type: 'Sightseeing',
        ticketPrice: { local: 100, foreign: 5 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 6.027, lon: 80.217
    }
];
