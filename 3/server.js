const http = require('http');
const url = require('url');
const { MESSAGE } = require('./lang/en/en.js');
const date = require('./modules/utils.js')

class Routes {
  constructor() {
    this.routes = {};
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  getHandler(path) {
    return this.routes[path] || null; 
  }
}

class RouteHandler {
  greet = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const name = parsedUrl.query.name|| "Guest";
    const currentDate = date.getDate()
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<p style="color: blue;">${MESSAGE.GREET(name, currentDate)}</p>`);
    res.end();
  }
}

class ApiServer {
  constructor(port) {
    this.port = port || 8080; 
    this.routes = new Routes(); 
  }

  addRoute(path, handler) {
    this.routes.addRoute(path, handler); 
  }

  start() {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const routeHandler = this.routes.getHandler(parsedUrl.pathname); // Get route handler from Routes class
      if (routeHandler) {
        routeHandler(req, res); 
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
      }
    });
    server.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}

const apiServer = new ApiServer(8080);
apiServer.addRoute('/COMP4537/labs/3/getDate/', new RouteHandler().greet);
apiServer.start();