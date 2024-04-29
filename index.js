const http = require("http");

const routes = [
  {
    path: "*",
    middleware: [
      (req, res, next) => {
        console.log(req);
        res.json({ message: "ok" });
      },
    ],
  },
];

const handleRequest = async (req, res) => {
  res.json = (body) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    body = JSON.stringify(body);
    res.send(body)
  };


  res.send = (body) => {
    res.done=true
    res.end(body);
  };

  res.sendFile = () => {};

  for (const route of routes) {
    const regexp = new RegExp(
      "^" + route.path.replace(/\*/, "(?:.*)") + "(?:/?$)",
      "i"
    );
    const matches = req.url.match(regexp);
    if (!matches) {
      continue;
    }
    for (const middleware of route.middleware) {
      await new Promise((resolve, reject) => {
        middleware(req, res, () => {
          if (next) reject();
          else resolve();
        });
      });
      if(res.done)break
    }
    if(res.done)break
  }

};
const server = http.createServer(handleRequest).listen(3000, () => {
  console.log(server.address());
});
