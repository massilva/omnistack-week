module.exports = {
    makePoint (longitude, latitude) {
        return {
            type: 'Point',
            coordinates: [longitude, latitude],
        }
    },
    parseStringToArray (arrayAsString) {
        return arrayAsString.split(',').map((string) => string.trim());
    }
}