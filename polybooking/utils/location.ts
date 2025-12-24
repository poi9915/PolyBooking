import * as Location from "expo-location";
import { encode, decode, expand } from "pluscodes";

export async function getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
    });

    return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
    };
}

// Kiểm tra short code
function isShortCode(code: string) {
    return code.length < 8 || !code.includes("+");
}

// Haversine chuẩn
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function haversineWithPlusCode(
    currentLat: number,
    currentLng: number,
    rawPlusCode: string
) {
    const token = rawPlusCode.trim().split(/\s+/)[0];

    let fullCode: string = token;

    // Nếu là short code → expand()
    if (isShortCode(token)) {
        const expanded = expand(token, {
            latitude: currentLat,
            longitude: currentLng,
        });

        if (expanded === null) {
            throw new Error(`Invalid short Plus Code: ${token}`);
        }

        fullCode = expanded;
    }

    // Decode code
    const decoded = decode(fullCode);

    if (decoded === null) {
        throw new Error(`Invalid Plus Code: ${fullCode}`);
    }

    const targetLat = decoded.latitude;
    const targetLng = decoded.longitude;

    return haversine(currentLat, currentLng, targetLat, targetLng);
}
