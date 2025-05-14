import { BASE_URL } from './constant';
export function isValidBase64(str) {
    if (!str || typeof str !== 'string') return false;
    try {
        return btoa(atob(str)) === str; // Round-trip check
    } catch (err) {
        return false;
    }
}

export const getPlayerIconSrc = (IconId) =>
    IconId
        ? `${BASE_URL}/icon/icon-image/${IconId}`
        : '/logo.png';