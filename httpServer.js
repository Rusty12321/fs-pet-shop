const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const port = 3000;

app.use(bodyParser.json());

fs.readFile("pets.json", "utf8", (error, data) => {
  pets = JSON.parse(data);

  app.post("/pets", (req, res) => {
    let { age, kind, name } = req.body;
    if (age === undefined || kind === undefined || name === undefined || isNaN(age)) {
      res.status(400);
      res.type("text/plain");
      res.send("Bad Request");
    } else {
      age = Number.parseInt(age);
      let newPet = { age: age, kind: kind, name: name };
      res.status(200);
      res.type("application/json");
      res.send(newPet);
      pets.push(newPet);
      fs.writeFile("pets.json", `${JSON.stringify(pets)}`, () => {});
    }
  });

  app.get("/pets", (req, res) => {
    res.type("application/json");
    res.send(pets);
  });

  app.get("/pets/:petIndex", (req, res) => {
    let index = req.params.petIndex;
    if (index === undefined || (index >= 0 && index < pets.length)) {
      res.type("application/json");
      res.status(200);
      res.send(pets[index]);
    } else {
      res.type("text/plain");
      res.status(404);
      res.send("Not Found");
    }
  });

  app.get("/*", (req, res) => {
    res.type("text/plain");
    res.sendStatus(404, "Not Found");
  });
});

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
