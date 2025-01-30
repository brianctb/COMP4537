//Code is assisted with ChatGBT

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { MESSAGE } = require('./lang/en/en.js');
const date = require('./modules/utils.js');

class Routes {
  constructor() {
    this.routes = new Map();
  }

  addRoute(path, handler) {
    const regex = new RegExp(path.replace('*', '(.*)')); 
    this.routes.set(regex, handler); 
  }

  getHandler(urlPath) {
    for (const [regex, handler] of this.routes) {
      const match = urlPath.match(regex);
      if (match) {
        return { handler, params: match.slice(1) };
      }
    }
    return null; 
  }
}

class RouteHandler {
  greet = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const name = parsedUrl.query.name || "Guest";
    const currentDate = date.getDate();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<p style="color: blue;">${MESSAGE.GREET(name, currentDate)}</p>`);
    res.end();
  };

  writeFile = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const text = parsedUrl.query.text || "";
    const filePath = path.join(__dirname, 'file.txt');
    fs.appendFile(filePath, text + '\n', (err) => { 
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error appending to file');
        console.error(err);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Text appended to file successfully');
    });
  };

  readFile = (req, res, fileName) => {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`${fileName} not found`);
        console.error(err);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  };
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
      const routeHandler = this.routes.getHandler(parsedUrl.pathname);

      if (routeHandler) {
        const { handler, params } = routeHandler;
        handler(req, res, ...params); 
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
apiServer.addRoute('/COMP4537/labs/3/writeFile/', new RouteHandler().writeFile);
apiServer.addRoute('/COMP4537/labs/3/readFile/(.*)', new RouteHandler().readFile);
apiServer.start();
