const puppeteer = require('puppeteer');

async function searchGoogleDorks(dorks) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const vulnerableSites = [];
  let urlCount = 0;
  
  for (const dork of dorks) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(dork)}`;
    
    await page.goto(url);
    
    const searchResults = await page.evaluate(() => {
      const results = Array.from(document.querySelectorAll('.g'));
      return results.map(result => ({
        título: result.querySelector('h3')?.innerText || '',
          url: result.querySelector('a')?.href || '',
      }));
    });
    
    for (const result of searchResults) {
      vulnerableSites.push(result);
      urlCount++;
    }
  }
  
  await browser.close();
  
  return { urls: vulnerableSites, count: urlCount };
}

//uso
const dorks = ['inurl:"/admin" intitle:"adminlogin"',
];

searchGoogleDorks(dorks)
  .then(({ urls, count }) => {
    console.log('URLs vulneráveis encontradas:');
    console.log(urls);
    console.log('Total de URLs capturadas:', count);
  })
  .catch(error => {
    console.error('Ocorreu um erro:', error);
  });
