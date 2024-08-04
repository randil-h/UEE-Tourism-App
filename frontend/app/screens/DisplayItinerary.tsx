import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

interface Place {
    name: string;
    price: number;
    lat: number;
    lng: number;
}

const places: Place[] = [
    { name: "Nallur Kandaswamy Temple", price: 500, lat: 9.6615, lng: 80.0255 },
    { name: "Kalpitiya", price: 1000, lat: 8.2333, lng: 79.7667 },
    { name: "Negombo", price: 800, lat: 7.2083, lng: 79.8358 },
    { name: "Viharamahadevi Park", price: 200, lat: 6.9147, lng: 79.8583 },
    { name: "Colombo Museum", price: 1000, lat: 6.9103, lng: 79.8587 },
    { name: "Galle Face Green", price: 0, lat: 6.9271, lng: 79.8429 },
    { name: "Wadduwa Beach", price: 0, lat: 6.6667, lng: 79.9244 },
    { name: "Kalutara Temple", price: 300, lat: 6.5854, lng: 79.9608 },
    { name: "Bentota Beach", price: 0, lat: 6.4281, lng: 79.9958 },
    { name: "Ambalangoda Mask Museum", price: 500, lat: 6.2358, lng: 80.0542 },
    { name: "Hikkaduwa", price: 1000, lat: 6.1395, lng: 80.1063 },
    { name: "Galle Fort", price: 500, lat: 6.0267, lng: 80.2167 },
    { name: "Weligama Beach", price: 0, lat: 5.9742, lng: 80.4289 },
    { name: "Mirissa Beach", price: 0, lat: 5.9483, lng: 80.4589 },
    { name: "Hummanaya Blow Hole", price: 300, lat: 5.9306, lng: 80.5592 },
    { name: "Tangalle Beach", price: 0, lat: 6.0244, lng: 80.7964 },
    { name: "Kumbuk River", price: 1500, lat: 6.3964, lng: 81.3080 },
    { name: "Yala National Park", price: 3000, lat: 6.3586, lng: 81.5047 },
    { name: "Arugam Bay", price: 1000, lat: 6.8390, lng: 81.8344 },
    { name: "Udawalawe National Park", price: 2500, lat: 6.4689, lng: 80.8900 },
    { name: "Sinharaja Forest Reserve", price: 2000, lat: 6.4000, lng: 80.5000 },
    { name: "Bopath Falls", price: 300, lat: 6.8207, lng: 80.3697 },
    { name: "Adam's Peak", price: 1000, lat: 6.8095, lng: 80.4991 },
    { name: "Diyaluma Falls", price: 500, lat: 6.7333, lng: 80.9667 },
    { name: "Haputale", price: 800, lat: 6.7675, lng: 80.9589 },
    { name: "Horton Plains National Park", price: 2500, lat: 6.8015, lng: 80.8083 },
    { name: "Ella Rock", price: 500, lat: 6.8667, lng: 81.0461 },
    { name: "Nuwara Eliya Golf Club", price: 2000, lat: 6.9697, lng: 80.7792 },
    { name: "Ramboda Falls", price: 400, lat: 7.0558, lng: 80.6967 },
    { name: "Kitulgala", price: 1500, lat: 6.9900, lng: 80.4122 },
    { name: "Pinnawala Elephant Sanctuary", price: 2500, lat: 7.3000, lng: 80.3833 },
    { name: "Kandy Botanical Gardens", price: 1500, lat: 7.2684, lng: 80.5956 },
    { name: "Helga's Folly", price: 1000, lat: 7.2936, lng: 80.6413 },
    { name: "Temple of the Tooth Relic", price: 1500, lat: 7.2936, lng: 80.6413 },
    { name: "Yapahuwa", price: 500, lat: 7.8167, lng: 80.3000 },
    { name: "Dambulla Cave Temple", price: 1500, lat: 7.8675, lng: 80.6494 },
    { name: "Polonnaruwa Ancient City", price: 2500, lat: 7.9403, lng: 81.0186 },
    { name: "Sigiriya Rock Fortress", price: 4500, lat: 7.9570, lng: 80.7603 },
    { name: "Minneriya National Park", price: 2500, lat: 8.0344, lng: 80.9000 },
    { name: "Ritigala", price: 500, lat: 8.1167, lng: 80.6500 },
    { name: "Anuradhapura Ancient City", price: 3500, lat: 8.3114, lng: 80.4037 },
    { name: "Mihintale", price: 500, lat: 8.3500, lng: 80.5000 },
    { name: "Trincomalee", price: 1000, lat: 8.5667, lng: 81.2333 },
    { name: "Koneswaram Temple", price: 300, lat: 8.5811, lng: 81.2459 },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function generateItinerary(numDays: number, budget: string, activityPreference: string): Place[] {
    let availablePlaces = [...places];
    let itinerary: Place[] = [];
    let currentBudget = budget === 'low' ? 30000 : budget === 'mid' ? 60000 : 100000;
    let currentLocation = availablePlaces[0];

    for (let day = 0; day < numDays; day++) {
        availablePlaces.sort((a, b) => {
            const distA = calculateDistance(currentLocation.lat, currentLocation.lng, a.lat, a.lng);
            const distB = calculateDistance(currentLocation.lat, currentLocation.lng, b.lat, b.lng);
            return distA - distB;
        });

        for (const place of availablePlaces) {
            if (place.price <= currentBudget) {
                itinerary.push(place);
                currentBudget -= place.price;
                currentLocation = place;
                availablePlaces = availablePlaces.filter(p => p !== place);
                break;
            }
        }

        if (currentBudget <= 0 || availablePlaces.length === 0) break;
    }

    return itinerary;
}

const ItineraryPage: React.FC = () => {
    const [numDays, setNumDays] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [activityPreference, setActivityPreference] = React.useState('sightseeing');
    const [budget, setBudget] = React.useState('low');
    const [itinerary, setItinerary] = React.useState<Place[]>([]);

    const handleGetItinerary = () => {
        const generatedItinerary = generateItinerary(parseInt(numDays), budget, activityPreference);
        setItinerary(generatedItinerary);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Unveil Sri Lanka</Text>
                <Text style={styles.subtitleSmall}>Tailored Itinerary just for you</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Number of Days"
                    keyboardType="numeric"
                    value={numDays}
                    onChangeText={setNumDays}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Starting Date (YYYY-MM-DD)"
                    value={startDate}
                    onChangeText={setStartDate}
                />
                <Text style={styles.subtitle}>Activity Preferences</Text>
                <RadioButton.Group onValueChange={setActivityPreference} value={activityPreference}>
                    <View style={styles.radioGroupContainer}>
                        <View style={styles.radioItem}>
                            <RadioButton value="sightseeing" />
                            <Text style={styles.radioText}>Sightseeing</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="cultural" />
                            <Text style={styles.radioText}>Cultural</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="adventurous" />
                            <Text style={styles.radioText}>Adventurous</Text>
                        </View>
                    </View>
                </RadioButton.Group>
                <Text style={styles.subtitle}>Budget</Text>
                <RadioButton.Group onValueChange={setBudget} value={budget}>
                    <View style={styles.radioGroupContainer}>
                        <View style={styles.radioItem}>
                            <RadioButton value="low" />
                            <Text style={styles.radioText}>Low</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="mid" />
                            <Text style={styles.radioText}>Mid</Text>
                        </View>
                        <View style={styles.radioItem}>
                            <RadioButton value="high" />
                            <Text style={styles.radioText}>High</Text>
                        </View>
                    </View>
                </RadioButton.Group>
                <TouchableOpacity style={styles.button} onPress={handleGetItinerary}>
                    <Text style={styles.buttonText}>Get My Itinerary</Text>
                </TouchableOpacity>

                {itinerary.length > 0 && (
                    <View style={styles.itineraryContainer}>
                        <Text style={styles.subtitle}>Your Itinerary:</Text>
                        {itinerary.map((place, index) => (
                            <Text key={index} style={styles.itineraryItem}>
                                Day {index + 1}: {place.name} (LKR {place.price})
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        width: '100%',
    },
    title: {
        marginBottom: 20,
        marginTop: 25,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 20,
        marginBottom: 10,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    radioGroupContainer: {
        alignItems: 'flex-start',
        width: '100%',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioText: {
        marginLeft: 8,
        fontSize: 16,
    },
    subtitleSmall: {
        marginBottom: 10,
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: 'black',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    itineraryContainer: {
        marginTop: 20,
    },
    itineraryItem: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default ItineraryPage;