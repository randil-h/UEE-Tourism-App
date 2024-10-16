import { places } from '../../utils/places';

// Function to calculate distance between two geographical points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (degree) => degree * (Math.PI / 180);
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Convert budget to numeric value based on predefined ranges
const parseBudget = (budget) => {
    const budgetMapping = {
        'Low': 20000,
        'Mid': 80000,
        'High': 120000
    };
    return budgetMapping[budget] || 0;  // Default to 0 if unknown
};

// Generate an itinerary based on the given parameters
const generateItinerary = (days, budget, activities = [], startLocation, endLocation, touristType) => {
    console.log('generateItinerary called with:', { days, budget, activities, startLocation, endLocation, touristType });

    // Input validation
    if (!days || !budget || !startLocation || !endLocation || !touristType) {
        console.error('Missing required parameters:', { days, budget, startLocation, endLocation, touristType });
        throw new Error("Missing required parameters");
    }

    const numericBudget = parseBudget(budget);

    if (!Array.isArray(activities) || activities.length === 0) {
        console.warn("No activities specified, using all types");
        activities = ['Sightseeing', 'Cultural', 'Adventurous', 'Relaxation'];
    }

    console.log('Total places:', places.length);
    console.log('Sample places:', JSON.stringify(places.slice(0, 3), null, 2));

    const filteredPlaces = places.filter(place => activities.includes(place.type));
    console.log(`Filtered places: ${filteredPlaces.length}`);

    const startPlace = places.find(place => place.location.toLowerCase() === startLocation.toLowerCase());
    const endPlace = places.find(place => place.location.toLowerCase() === endLocation.toLowerCase());

    if (!startPlace || !endPlace) {
        console.error('Start or End place not found:', { startLocation, endLocation });
        console.log('Available locations:', places.map(p => p.location));
        throw new Error('Start or End place not found.');
    }

    const budgetKey = touristType === 'Local' ? 'local' : 'foreign';

    // Sort places by distance from the current location (starting from startPlace)
    const itinerary = [];
    let currentLocation = startPlace;
    let remainingBudget = numericBudget;
    const maxDistance = 500; // Adjust this to fine-tune how far you're willing to travel per day
    const maxPlacesPerDay = 3; // Allow up to 3 places per day

    for (let day = 0; day < days; day++) {
        let dayPlan = [];

        for (let i = 0; i < maxPlacesPerDay; i++) {
            // Re-sort places based on the current location, ensuring the next closest place is chosen
            const suitablePlaces = filteredPlaces
                .filter(place => {
                    const distance = calculateDistance(currentLocation.lat, currentLocation.lon, place.lat, place.lon);
                    return place.ticketPrice[budgetKey] <= remainingBudget && distance <= maxDistance;
                })
                .sort((a, b) => {
                    const distanceA = calculateDistance(currentLocation.lat, currentLocation.lon, a.lat, a.lon);
                    const distanceB = calculateDistance(currentLocation.lat, currentLocation.lon, b.lat, b.lon);
                    return distanceA - distanceB;
                });

            console.log(`Day ${day + 1}, Place ${i + 1}: ${suitablePlaces.length} suitable places found`);

            if (suitablePlaces.length > 0) {
                const nextPlace = suitablePlaces[0]; // Pick the closest suitable place
                dayPlan.push({
                    name: nextPlace.name,
                    location: nextPlace.location,
                    image: nextPlace.imageSource,
                    ticketPrice: nextPlace.ticketPrice[budgetKey],
                    lat: nextPlace.lat,
                    lon: nextPlace.lon,
                });
                currentLocation = nextPlace; // Update the current location to the newly added place
                remainingBudget -= nextPlace.ticketPrice[budgetKey];
                filteredPlaces.splice(filteredPlaces.indexOf(nextPlace), 1); // Remove the visited place from the list
                console.log(`Added place: ${nextPlace.name}, Remaining budget: ${remainingBudget}`);
            } else {
                console.warn(`No more suitable places found for Day ${day + 1}. Remaining budget: ${remainingBudget}`);
                break;
            }
        }

        itinerary.push({ day: day + 1, places: dayPlan });
    }

    console.log('Generated Itinerary:', JSON.stringify(itinerary, null, 2));
    return itinerary;
};


export default generateItinerary;
