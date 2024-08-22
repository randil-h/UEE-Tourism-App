import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../../firebaseConfig";

export const fetchImageURL = async (imagePath) => {
        const imageRef = ref(storage, imagePath);
        const url = await getDownloadURL(imageRef);
        return url;

}