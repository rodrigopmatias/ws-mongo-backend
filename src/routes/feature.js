import restFactory from '../helpers/restful';

export default (app) => {
  app.use('/features', restFactory(app, app.controllers.FeatureController, ''));
};
