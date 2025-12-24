import { useEffect, useState } from "react";
import { getCurrentLocation, haversineWithPlusCode } from "../utils/location";

export function usePlusCodeDistance(plusCode: string | null, precalculatedDistance?: number) {
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If distance is already provided, use it directly
        if (precalculatedDistance !== undefined) {
            setDistanceKm(precalculatedDistance);
            setLoading(false);
            return;
        }

        // Otherwise, calculate it
        if (!plusCode) {
            setDistanceKm(null);
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const loc = await getCurrentLocation();
                const km = haversineWithPlusCode(loc.lat, loc.lng, plusCode);
                setDistanceKm(km);
            } catch (err) {
                console.log("Distance calc error:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [plusCode, precalculatedDistance]);

    // Format for display
    let distanceText = null;
    if (distanceKm != null) {
        if (distanceKm < 1) {
            distanceText = `${Math.round(distanceKm * 1000)} m`;
        } else {
            distanceText = `${distanceKm.toFixed(1)} km`;
        }
    }

    return { distanceKm, distanceText, loading };
}
