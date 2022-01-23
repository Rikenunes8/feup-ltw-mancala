const http      = require('http');
const url       = require('url');
const conf      = require('./conf.js');
const ranking   = require('./ranking.js');
const register  = require('./register.js');
const join      = require('./join.js'); 
const leave     = require('./leave.js');
const notify    = require('./notify.js');
const update    = require('./update.js');
const model     = require('./model.js');

const {endResponse, endResponseWithError, setHeaders} = require('./utils.js');


function doPostRequest(request, response) {
  const pathname = url.parse(request.url).pathname;

  switch(pathname) {
    case '/ranking':
      ranking.getTop10(request, response);
      break;
    case '/register':
      register.login(request, response);
      break;
    case '/join':
      join.join(request, response);
      break;
    case '/notify':
      notify.notify(request, response);
      break;
    case '/leave':
      leave.leave(request, response);
      break;
    default:
      endResponseWithError(response, 404, "Unknown POST request");
    break;
  }
}
function doGetRequest(request, response) {
  const pathname = url.parse(request.url).pathname;
  const query = url.parse(request.url, true).query;
  
  switch(pathname) {
    case '/update':
      update.remember(response, query.game, query.nick);
      request.on('close', () => update.forget(query.game, query.nick));
      setImmediate(() => update.update(query.game));
      break;
    default:
      endResponseWithError(response, 404, "Unknown GET request");
    break;
  }
}

const server = http.createServer( (request, response) => {
  switch(request.method) {
    case 'POST':
      doPostRequest(request, response);
      break;
    case 'GET':
      doGetRequest(request, response);
      break;
    default:
      response.writeHead(500); // 501 Not Implemented
      response.end();    
  }
});

server.listen(conf.port);