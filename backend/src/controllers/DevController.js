const axios = require('axios');
const Dev = require('../models/Dev');
const utils = require('../utils/utils');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async home (request, response) {
        const allDevs = await Dev.find();
        return response.json(allDevs);
    },
    async store (request, response) {
        const { github, techs, latitude, longitude } = request.body;
        let dev = await Dev.findOne({ github });
        if (!dev) {
            const techsArray = utils.parseStringToArray(techs);
            const responseAPI = await axios.get(`https://api.github.com/users/${github}`);
            const { name = login, avatar_url, bio } = responseAPI.data;
            const location = utils.makePoint(longitude, latitude);

            dev = await Dev.create({
                name,
                github,
                bio,
                avatar_url,
                techs: techsArray, 
                location
            });

            const sendSocketMessageTo = findConnections({ latitude, longitude }, techsArray);
            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }
        return response.json(dev);
    },
    async search (request, response) {
        const { latitude, longitude, techs } = request.query;
        const techsArray = utils.parseStringToArray(techs);
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: utils.makePoint(longitude, latitude),
                    $maxDistance: 10000,
                }
            }
        });
        return response.json({ devs: devs });
    },
    async update (request, response) {
        const { github } = request.params;
        const dev = await Dev.findOne({ github });

        if (dev) {
            const { techs, latitude, longitude } = request.body;
            await Dev.update({ github: github }, {
                techs: utils.parseStringToArray(techs), 
                location: utils.makePoint(longitude, latitude)
            });
        }

        return response.json({
            message: `${github} updated!`
        });
    },
    async destroy (request, response) {
        const { github } = request.params;

        await Dev.deleteOne({ github: github });

        return response.json({
            message: `${github} deleted!`
        });
    }
}