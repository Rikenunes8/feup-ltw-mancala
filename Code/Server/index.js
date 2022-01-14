const http    = require('http');
const path    = require('path');
const url     = require('url');
const fs      = require('fs');
const conf    = require('./conf.js');
const ranking = require('./ranking.js');
const register = require('./resgister.js'); 


const headers = {
  plain: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'        
  },
  sse: {    
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Connection': 'keep-alive'
  }
};

function doPostRequest(request, response) {
  const pathname = url.parse(request.url).pathname;

  switch(pathname) {
    case '/ranking':
      ranking.get(request, response);
      break;
    case '/register':
      register.get(request, response);
      break;
    default:
      response.writeHead(404);
      response.end();
    break;
  }

}


const server = http.createServer( (request, response) => {
  let answer = {};

  switch(request.method) {
    case 'POST':
      answer = doPostRequest(request, response);
      break;
    default:
      response.writeHead(500); // 501 Not Implemented
      response.end();    
  }
});

server.listen(conf.port);