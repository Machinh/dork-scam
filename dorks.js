const puppeteer = require('puppeteer');

async function searchGoogleDorks(dorks) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const vulnerableSites = [];
  
  for (const dork of dorks) {
    const searchQuery = `site:${dork}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    
    await page.goto(url);
    
    const searchResults = await page.evaluate(() => {
      const results = Array.from(document.querySelectorAll('.g'));
      return results.map(result => ({
        título: result.querySelector('h3')?.innerText || '',
        url: result.querySelector('a')?.href || '',
        descrição: result.querySelector('.st')?.innerText || ''
      }));
    });
    
    for (const result of searchResults) {
      vulnerableSites.push(result);
    }
  }
  
  await browser.close();
  
  return vulnerableSites;
}

// Exemplo de uso
const dorks = ['inurl:/admin" intitle:"adminlogin', 'inurl:robots.txt', 'inurl:uploadimage.php'];
searchGoogleDorks(dorks)
  .then(results => {
    console.log('vulneráveis encontrados:');
    console.log(results);
  })
  .catch(error => {
    console.error('Ocorreu um erro:', error);
  });
