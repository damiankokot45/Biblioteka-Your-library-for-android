const https = require('https');

https.get('https://www.googleapis.com/books/v1/volumes?q=isbn:9788328381254', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log('GB:', data.substring(0, 200)); });
});

https.get('https://data.bn.org.pl/api/bibs.json?isbn=9788328381254', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log('BN:', data.substring(0, 200)); });
});
