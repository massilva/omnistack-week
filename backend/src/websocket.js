const socketIO = require('socket.io');
const utils = require('./utils/utils');

//Redis
const connections = [];
let io;

exports.setupWebsocket = (server) => {
    io = socketIO(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: utils.parseStringToArray(techs),
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return utils.getDistanceFromLatLonInKm(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item));
    });
};

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
};