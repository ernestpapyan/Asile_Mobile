import {BASE_API_URL} from "./config";

export function sanitizeProfileInfo(role, data, uid) {
    return role === 'User' ? {
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.image,
        mobile: data.mobile,
        dob: data.dob,
        address: data.address,
        latitude: data.lat,
        longitude: data.lang,
        accountType: data.acc_type,
        status: data.status,
        avgRating: data.avgRating,
        fcmId: data.fcm_id,
        firebaseId: uid
    } : {
        id: data.id,
        username: data.username,
        surname: data.surname,
        email: data.email,
        password: data.password,
        image: data.image,
        mobile: data.mobile,
        services: data.services,
        description: data.description,
        address: data.address,
        latitude: data.lat,
        longitude: data.lang,
        invoice: data.invoice,
        status: data.status,
        fcmId: data.fcm_id,
        accountType: data.account_type,
        firebaseId: uid,
        avgRating: data.avgRating
    };
}

export function normalizeImageUrl(imageUrl) {
    if (!imageUrl) return 'https://via.placeholder.com/150/000000/FFFFFF/?text=No%20Image';
    let result = imageUrl;
    if (imageUrl.indexOf('api/uploads') > -1 && imageUrl.indexOf('firebasestorage') > -1) result = imageUrl.replace(BASE_API_URL + "api/uploads/employee/", '');
    return result.indexOf('http://') > -1 || result.indexOf('https://') > -1 ? result : BASE_API_URL + "api/uploads/employee/" + result;
}

export function normalizeFirebaseTime(time) {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay() || c.getMonth() !== d.getMonth() || c.getFullYear() !== d.getFullYear()) {
        result = d.getDate() + '/' + (d.getMonth() + 1) + "/" + d.getFullYear() + ', ' + result;
    }
    return result;
}

export function getDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") {
            dist = dist * 1.609344
        }
        if (unit === "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}
