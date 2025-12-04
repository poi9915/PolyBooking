import AsyncStorage from "@react-native-async-storage/async-storage";
//notification storage
export const setNotificationPref = async (value: boolean) => {
    try {
        await AsyncStorage.setItem('notificationPref', value ? 'true' : 'false')
    } catch (err) {
        console.log("Bug in setNotificationPref", err);
    }
}
export const getNotificationPref = async () => {
    try {
        const value = await AsyncStorage.getItem('notificationPref')
        if (value === null) {
            await AsyncStorage.setItem('notificationPref', 'true')
            return true
        } else {
            return JSON.parse(value)
        }
        return value === 'true '
    } catch (err) {
        console.log("Bug in setNotificationPref", err);
    }
}
/// theme storage (true = dark , false = light )
export const setThemePref = async (value: boolean) => {
    try {
        await AsyncStorage.setItem('themePref', value ? 'true' : 'false')
    } catch (err) {
        console.log("Bug in themePref", err);
    }
}
export const getThemePref = async () => {
    try {
        const value = await AsyncStorage.getItem('themePref')
        if (value === null) {
            await AsyncStorage.setItem('themePref', 'false')
            return false
        } else {
            return JSON.parse(value)
        }
        return value === 'true '
    } catch (err) {
        console.log("Bug in themePref", err);
    }
}