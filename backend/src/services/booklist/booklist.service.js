// Initializes the `booklist` service on path `/booklist`
const { Booklist } = require('./booklist.class');
const createModel = require('../../models/booklist.model');
const hooks = require('./booklist.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/booklist', new Booklist(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('booklist');

  // sservice.publish('create',() => app.channel('anonymous','authenticated'));
  // service.publish('created', () => app.channel('anonymous'))

  service.publish(() => app.channel('anonymous'));

  service.hooks(hooks);
};
