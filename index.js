const fs = require('fs');
const http = require('http');
const url = require('url');
const relpaceTemplate = require('./modules/replaceTemplate');

const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const templateProduct= fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const objData = JSON.parse(data);

const server = http.createServer((request, response) => {
	const { query, pathname } = url.parse(request.url, true);
	
	if (pathname === '/' || pathname === '/overview') {

		response.writeHead(200, { 'Content-type' : 'text/html' });
		const cardsHtml = objData.map(element => relpaceTemplate(templateCard, element)).join('');
		const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
		response.end(output);

	} else if (pathname === '/product') {

		response.writeHead(200, { 'Content-type' : 'text/html' });
		const product = objData[query.id];
		const output = relpaceTemplate(templateProduct, product);

		response.end(output);

	} else if (pathname === '/api') {

        response.writeHead(200, { 'Content-type' : 'application/json' });
		response.end(data);
		
	} else {

		response.writeHead(404, { 'Content-type': 'text/html' });
		response.end('<h1>Page not found</h1>');

	}
});
server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000');
});
