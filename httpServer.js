const fs = require('fs');
const http = require('http');
const petRegExp = /^\/pets\/(.*)$/;
const port = 8000;

const server = http.createServer((req, res) => {
    console.log('incoming response');
    fs.readFile('pets.json', 'utf8', (error, data) => {
        pets = JSON.parse(data);
        // console.log(petRegExp.test(req.url))
        // console.log(req.url)
        let index = req.url.split('/')
        if (error) {
            console.error(error)
        } else if (req.method === 'GET' && index[1] === 'pets' && index[2] === undefined || (index[2] >= 0 && index[2] <pets.length)) {
            for (let i = 0; i < pets.length; i++) {
                if (req.url === '/pets') {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(data);
                    res.end();
                    break;
                } else if (req.url === `/pets/${i}`) {
                    let currentPet = JSON.stringify(pets[i]);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(currentPet);
                    res.end();
                    break;
                } 
            }
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('Not Found');
        }
    })
})

server.listen(port, (error)  => {
    if (error) {
        console.error(error);
    } else {
        console.log(`Server is running on ${port}`);
    }
})