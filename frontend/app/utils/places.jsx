// app/data/places.js
import { Image } from 'react-native';

export const places = [
    {
        name: 'Sigiriya',
        location: 'Sigiriya',
        type: 'Sightseeing',
        ticketPrice: { local: 120, foreign: 5500 },
        imageSource: require('../../assets/images/itinerary/sigiriya.jpg'),
        lat: 7.957, lon: 80.760
    },
    {
        name: 'Temple of the Tooth',
        location: 'Kandy',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 1500 },
        imageSource : require('../../assets/images/itinerary/temple-sacred-tooth-relic-kandy-sri-lanka.jpg'),
        lat: 7.293, lon: 80.641
    },
    {
        name: 'Galle Fort',
        location: 'Galle',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/gallefort.jpg'),
        lat: 6.026, lon: 80.217
    },
    {
        name: 'Ella Rock',
        location: 'Ella',
        type: 'Adventurous',
        ticketPrice: { local: 0, foreign: 1000 },
        imageSource: require('../../assets/images/itinerary/ella.jpeg'),
        lat: 6.866, lon: 81.046
    },
    {
        name: 'Nuwara Eliya Tea Plantations',
        location: 'Nuwara Eliya',
        type: 'Sightseeing',
        ticketPrice: { local: 500, foreign: 1000 },
        imageSource: require('../../assets/images/itinerary/neliyatea.jpg'),
        lat: 6.970, lon: 80.782
    },
    {
        name: 'Minneriya National Park',
        location: 'Minneriya',
        type: 'Sightseeing',
        ticketPrice: { local: 500, foreign: 25000 },
        imageSource: require('../../assets/images/itinerary/minneriya.jpg'),
        lat: 8.032, lon: 80.897
    },
    {
        name: 'Yala National Park',
        location: 'Yala',
        type: 'Adventurous',
        ticketPrice: { local: 360, foreign: 8000 },
        imageSource: require('../../assets/images/itinerary/yala.jpg'),
        lat: 6.363, lon: 81.521
    },
    {
        name: 'Adams Peak',
        location: 'Hatton',
        type: 'Adventurous',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/adamspeak.jpg'),
        lat: 6.809, lon: 80.499
    },
    {
        name: 'Dambulla Cave Temple',
        location: 'Dambulla',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 2000 },
        imageSource: require('../../assets/images/itinerary/dambullacave.jpeg'),
        lat: 7.856, lon: 80.650
    },
    {
        name: 'Mirissa Beach',
        location: 'Mirissa',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/mirissa.jpg'),
        lat: 5.948, lon: 80.459
    },
    {
        name: 'Polonnaruwa Ancient City',
        location: 'Polonnaruwa',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 7000 },
        imageSource: require('../../assets/images/itinerary/polonnaruwa.jpeg'),
        lat: 7.939, lon: 81.002
    },
    {
        name: 'Pinnawala Elephant Orphanage',
        location: 'Pinnawala',
        type: 'Sightseeing',
        ticketPrice: { local: 350, foreign: 5000 },
        imageSource: require('../../assets/images/itinerary/pinnawala.jpeg'),
        lat: 7.301, lon: 80.384
    },
    {
        name: 'Unawatuna Beach',
        location: 'Unawatuna',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/unawatuna-sri-lanka.jpg'),
        lat: 5.978, lon: 80.440
    },
    {
        name: 'Trincomalee Harbor',
        location: 'Trincomalee',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/trincoharbour.jpg'),
        lat: 8.571, lon: 81.233
    },
    {
        name: 'Jaffna Fort',
        location: 'Jaffna',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 1500 },
        imageSource: require('../../assets/images/itinerary/jaffnafort.jpg'),
        lat: 9.661, lon: 80.011
    },
    {
        name: 'Udawalawe National Park',
        location: 'Udawalawe',
        type: 'Adventurous',
        ticketPrice: { local: 400, foreign: 22500 },
        imageSource: require('../../assets/images/itinerary/udawalawa.jpeg'),
        lat: 6.472, lon: 80.888
    },
    {
        name: 'Ravana Falls',
        location: 'Ella',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/ravanafalls.jpg'),
        lat: 6.852, lon: 81.046
    },
    {
        name: 'Horton Plains National Park',
        location: 'Nuwara Eliya',
        type: 'Adventurous',
        ticketPrice: { local: 100, foreign: 4000 },
        imageSource: require('../../assets/images/itinerary/hortonplains.jpg'),
        lat: 6.801, lon: 80.789
    },
    {
        name: 'Bentota Beach',
        location: 'Bentota',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/bentota.jpg'),
        lat: 6.428, lon: 80.000
    },
    {
        name: 'Pigeon Island',
        location: 'Trincomalee',
        type: 'Adventurous',
        ticketPrice: { local: 2000, foreign: 26000 },
        imageSource: require('../../assets/images/itinerary/pigeonisland.jpg'),
        lat: 8.718, lon: 81.221
    },
    {
        name: 'Independence Square',
        location: 'Colombo',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/independencesquare.jpg'),
        lat: 6.927, lon: 79.861
    },
    {
        name: 'Gangaramaya Temple',
        location: 'Colombo',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 500 },
        imageSource: require('../../assets/images/itinerary/gangaramaya.jpg'),
        lat: 6.927, lon: 79.860
    },
    {
        name: 'Nine Arches Bridge',
        location: 'Ella',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/ninearch.jpg'),
        lat: 6.874, lon: 81.049
    },
    {
        name: 'Kelaniya Temple',
        location: 'Kelaniya',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/kelaniyatemple.jpg'),
        lat: 6.961, lon: 79.931
    },
    {
        name: 'Whale Watching',
        location: 'Mirissa',
        type: 'Adventurous',
        ticketPrice: { local: 5000, foreign: 20000 },
        imageSource: require('../../assets/images/itinerary/whalewatching.jpg'),
        lat: 5.948, lon: 80.459
    },
    {
        name: 'Koneswaram Temple',
        location: 'Trincomalee',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/koneswaramtemple.jpg'),
        lat: 8.569, lon: 81.233
    },
    {
        name: 'Knuckles Mountain Range',
        location: 'Kandy',
        type: 'Adventurous',
        ticketPrice: { local: 300, foreign: 20000 },
        imageSource: require('../../assets/images/itinerary/knuckles.jpeg'),
        lat: 7.466, lon: 80.786
    },
    {
        name: 'Colombo National Museum',
        location: 'Colombo',
        type: 'Cultural',
        ticketPrice: { local: 150, foreign: 1000 },
        imageSource: require('../../assets/images/itinerary/museum.jpeg'),
        lat: 6.927, lon: 79.861
    },
    {
        name: 'Dutch Hospital',
        location: 'Galle',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/dutchhospital.jpg'),
        lat: 6.027, lon: 80.217
    },
    {
        name: 'Royal Botanical Gardens',
        location: 'Peradeniya',
        type: 'Sightseeing',
        ticketPrice: { local: 500, foreign: 3500 },
        imageSource: require('../../assets/images/itinerary/royalbotanic.jpg'),
        lat: 7.256, lon: 80.596
    },
    {
        name: 'Kandy Lake',
        location: 'Kandy',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/kandylake.jpg'),
        lat: 7.290, lon: 80.633
    },
    {
        name: 'Weligama Bay',
        location: 'Weligama',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/weligambay.jpg'),
        lat: 5.972, lon: 80.399
    },
    {
        name: 'Mihintale',
        location: 'Mihintale',
        type: 'Cultural',
        ticketPrice: { local: 200, foreign: 2000 },
        imageSource: require('../../assets/images/itinerary/mihintale.jpg'),
        lat: 8.392, lon: 80.545
    },
    {
        name: 'Hikkaduwa Beach',
        location: 'Hikkaduwa',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/hikkaduwa.jpg'),
        lat: 6.124, lon: 80.095
    },
    {
        name: 'Yapahuwa',
        location: 'Yapahuwa',
        type: 'Cultural',
        ticketPrice: { local: 300, foreign: 15 },
        imageSource: require('../../assets/images/itinerary/yapahuwa.jpeg'),
        lat: 7.519, lon: 80.468
    },
    {
        name: 'Pidurangala Rock',
        location: 'Sigiriya',
        type: 'Adventurous',
        ticketPrice: { local: 0, foreign: 1000 },
        imageSource: require('../../assets/images/itinerary/pidurangala.jpeg'),
        lat: 7.952, lon: 80.753
    },
    {
        name: 'Knuckles Conservation Forest',
        location: 'Kandy',
        type: 'Adventurous',
        ticketPrice: { local: 0, foreign: 11000 },
        imageSource: require('../../assets/images/itinerary/knuckles.jpeg'),
        lat: 7.433, lon: 80.703
    },
    {
        name: 'Devon Falls',
        location: 'Talawakele',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/devonfalls.jpeg'),
        lat: 6.972, lon: 80.574
    },
    {
        name: 'Lankathilaka Temple',
        location: 'Kandy',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 500 },
        imageSource: require('../../assets/images/itinerary/lankathilaka.jpg'),
        lat: 7.285, lon: 80.614
    },
    {
        name: 'Kithulgala',
        location: 'Kithulgala',
        type: 'Adventurous',
        ticketPrice: { local: 5000, foreign: 8500 },
        imageSource: require('../../assets/images/itinerary/kithulgala.jpeg'),
        lat: 6.974, lon: 80.411
    },

    {
        name: 'Ahangama Beach',
        location: 'Ahangama',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/ahangama.jpg'),
        lat: 5.952, lon: 80.078
    },
    {
        name: 'Sinharaja Forest Reserve',
        location: 'Ratnapura',
        type: 'Adventurous',
        ticketPrice: { local: 500, foreign: 1500 },
        imageSource: require('../../assets/images/itinerary/sinharaja.jpg'),
        lat: 6.366, lon: 80.667
    },
    {
        name: 'Nuwara Eliya Golf Club',
        location: 'Nuwara Eliya',
        type: 'Relaxation',
        ticketPrice: { local: 3000, foreign: 20000 },
        imageSource: require('../../assets/images/itinerary/nuwaraeliyagolfclub.jpeg'),
        lat: 6.950, lon: 80.221
    },
    {
        name: 'Kandy National Museum',
        location: 'Kandy',
        type: 'Cultural',
        ticketPrice: { local: 50, foreign: 1500 },
        imageSource: require('../../assets/images/itinerary/kandymuseum.jpeg'),
        lat: 7.293, lon: 80.636
    },
    {
        name: 'Polonnaruwa Gal Vihara',
        location: 'Polonnaruwa',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 2500 },
        imageSource: require('../../assets/images/itinerary/polonnaruwagal.jpeg'),
        lat: 7.934, lon: 81.002
    },
    {
        name: 'Anuradhapura',
        location: 'Anuradhapura',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/anuradhapura.jpg'),
        lat: 8.348, lon: 80.395
    },
    {
        name: 'Kalpitiya',
        location: 'Kalpitiya',
        type: 'Relaxation',
        ticketPrice: { local: 120, foreign: 3500 },
        imageSource: require('../../assets/images/itinerary/kalpitiya.jpg'),
        lat: 8.409, lon: 79.771
    },
    {
        name: 'Hambantota Port',
        location: 'Hambantota',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/hambantotabeach.png'),
        lat: 6.125, lon: 81.119
    },

    {
        name: 'Galle Face Green',
        location: 'Colombo',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/galleface.jpeg'),
        lat: 6.927, lon: 79.958
    },

    {
        name: 'Pettah Market',
        location: 'Colombo',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/pettahmarket.jpg'),
        lat: 6.940, lon: 79.961
    },


    {
        name: 'Batticaloa Lagoon',
        location: 'Batticaloa',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/baticaloalagoon.jpg'),
        lat: 7.706, lon: 81.693
    },
    {
        name: 'Ramboda Falls',
        location: 'Ramboda',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/ramboda.jpg'),
        lat: 6.975, lon: 80.569
    },
    {
        name: 'Hatton Tea Museum',
        location: 'Hatton',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/hattontea.jpeg'),
        lat: 6.774, lon: 80.486
    },
    {
        name: 'Tangalle Beach',
        location: 'Tangalle',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/tangallebeach.jpg'),
        lat: 5.979, lon: 80.816
    },
    {
        name: 'Diyaluma Falls',
        location: 'Koslanda',
        type: 'Sightseeing',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/diyaluma.jpg'),
        lat: 6.920, lon: 81.161
    },

    {
        name: 'Ambalangoda Mask Museum',
        location: 'Ambalangoda',
        type: 'Cultural',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/ambalangodamask.jpeg'),
        lat: 6.181, lon: 80.084
    },
    {
        name: 'Beruwala Beach',
        location: 'Beruwala',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/beruwelabeach.jpg'),
        lat: 6.495, lon: 79.988
    },
    {
        name: 'Ratnapura Gem Museum',
        location: 'Ratnapura',
        type: 'Cultural',
        ticketPrice: { local: 200, foreign: 1000 },
        imageSource: require('../../assets/images/itinerary/ratnapuragem.jpeg'),
        lat: 6.684, lon: 80.370
    },
    {
        name: 'Koggala Lake',
        location: 'Koggala',
        type: 'Relaxation',
        ticketPrice: { local: 0, foreign: 0 },
        imageSource: require('../../assets/images/itinerary/koggalalake.jpg'),
    },

];
