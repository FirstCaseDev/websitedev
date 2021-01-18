var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;
var cors_proxy = require('cors-anywhere');

// Initialize app on port 3000
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    // requireHeader: ['origin', 'x-requested-with'],
    // removeHeaders: ['cookie', 'cookie2']
  })
  .listen(port, () =>
    console.log('Running CORS Anywhere on ' + host + ':' + port)
  );
