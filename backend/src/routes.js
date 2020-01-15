const { Router } = require('express');
const DevController = require('./controllers/DevController');

const routes = Router();

routes.get('/devs', DevController.home);
routes.get('/devs/search', DevController.search);
routes.post('/devs', DevController.store);
routes.put('/devs/:github', DevController.update);
routes.delete('/devs/:github', DevController.destroy);

module.exports = routes;