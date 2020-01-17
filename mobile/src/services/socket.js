import socketio from 'socket.io-client';
import Constants from '../constants';

const socket = socketio(Constants.API_ADDRESS, {
    autoConnect: false,
});

function subscribleToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
    socket.io.opts.query = {
        latitude,
        longitude,
        techs
    };
    socket.connect();
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribleToNewDevs,
}