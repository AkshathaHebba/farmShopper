//core modules
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify') //slugify is a function which is used to identify the slug
//our modules
const replaceTemplate = require('./modules/replaceTemplate');
///////////////////////
//FILES
//Blocking synchronus way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// const textOut = `This is what we know about avocado ${textIn}`
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File written!!')

//non-blocking asynchronus way
// fs.readFile('./txt/start.txt','utf-8',(err,data) =>{
//     console.log(data);
// })
// console.log('Will read file!');
/////////////////\

//SERVER

//It is only ever excecuted once we start the program - sync excecution usage
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj = JSON.parse(data)


//creating the server
const server = http.createServer((req,res) =>{
const {query, pathname} = url.parse(req.url,true)
    //overview
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200,{'content-type':'text/html'})
        const cardsHtml = dataobj.map(el =>{
           return replaceTemplate(tempCard,el);
        }).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)
    }//api
    else if(pathname === '/api'){
           res.writeHead(200,{'content-type':'application/json'})
           res.end(data)
    }
    //product page
    else if(pathname === '/product'){
        res.writeHead(200,{'Content-type': 'text.html'});
        const product = dataobj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    }
    //not found
    else{
        res.writeHead(404,{
            'content-type':'text/html',
            'myOwnHeader':'Hi am header'
        }); //we can send header of object type here
        res.end('<h1>not found!!</h1>')
    }
})
//listening to the server
server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to request on port 8000')
})