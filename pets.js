#! /usr/bin/env node

let fs = require("fs");
let option = process.argv[2];

switch (option) {
  case "read":
    let index = process.argv[3];
    fs.readFile("pets.json", "utf8", (error, data) => {
      let pets = JSON.parse(data);
      if (index !== undefined) {
        if (pets[index] !== undefined) {
          console.log(pets[index]);
        } else {
          console.log("Usage: node pets.js read INDEX");
        }
      } else {
        console.log(pets);
      }
    });
    break;
  case "create":
    let createAge = Number.parseInt(process.argv[3]);
    let createKind = process.argv[4];
    let createName = process.argv[5];
    if (
      createAge === undefined ||
      createKind === undefined ||
      createName === undefined
    ) {
      console.log("Usage: node pets.js create AGE KIND NAME");
    } else {
      let obj = {
        age: createAge,
        kind: createKind,
        name: createName,
      };
      fs.readFile("pets.json", "utf8", (error, data) => {
        let pets = JSON.parse(data);
        pets.push(obj);
        fs.writeFile("pets.json", `${JSON.stringify(pets)}`, (error) => {});
        console.log(obj);
      });
    }
    break;
  case "update":
    let indexToUpdate = process.argv[3];
    let updateAge = Number.parseInt(process.argv[4]);
    let updateKind = process.argv[5];
    let updateName = process.argv[6];
    if (
      indexToUpdate === undefined ||
      updateAge === undefined ||
      updateKind === undefined ||
      updateName === undefined
    ) {
      console.log("Usage: node pets.js update INDEX AGE KIND NAME");
    } else {
      fs.readFile("pets.json", "utf8", (error, data) => {
        let pets = JSON.parse(data);
        pets[indexToUpdate].age = updateAge;
        pets[indexToUpdate].kind = updateKind;
        pets[indexToUpdate].name = updateName;
        JSON.stringify(pets);
        fs.writeFile("pets.json", `${JSON.stringify(pets)}`, (error) => {});
        console.log(pets[indexToUpdate]);
      });
    }
    break;
  case "destroy":
    let indexToDestroy = process.argv[3];
    fs.readFile("pets.json", "utf8", (error, data) => {
      let pets = JSON.parse(data);
      if (indexToDestroy !== undefined && pets[indexToDestroy] !== undefined) {
        console.log(pets[indexToDestroy]);
        pets.splice(indexToDestroy, 1);
        fs.writeFile("pets.json", `${JSON.stringify(pets)}`, (error) => {});
      } else {
        console.log("Usage: node pets.js destroy INDEX");
      }
    });
    break;
  default:
    console.error("Usage: node pets.js [read | create | update | destroy]");
}
