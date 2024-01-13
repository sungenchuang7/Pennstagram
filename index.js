const webapp = require('./server');

const port =  process.env.PORT || 8080;
webapp.listen(port, () => {
  /* eslint-disable no-console */
  console.log('Server running on port', port);
});
