const cheerio = require('cheerio');
const axios = require('axios');

exports.getCompetitorPricing = functions.https.onCall(async (data) => {
  const { projectType, location } = data;
  
  // Scrape HomeAdvisor, Angi, local contractor sites
  const sources = [
    `https://www.homeadvisor.com/${projectType}/${location}`,
    `https://www.angi.com/${projectType}/${location}`
  ];

  let competitorData = [];
  
  for (const url of sources) {
    try {
      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);
      
      // Extract average pricing from public listings
      const prices = $('.pricing-info').map((i, el) => ({
        contractor: $(el).find('.name').text(),
        price: parseFloat($(el).find('.amount').text().replace(/[^0-9]/g, '')),
        rating: parseFloat($(el).find('.rating').text())
      })).get();
      
      competitorData.push(...prices);
    } catch (e) {
      console.log(`Error scraping ${url}`);
    }
  }

  return {
    averageMarketPrice: competitorData.reduce((a, b) => a + b.price, 0) / competitorData.length,
    priceRange: {
      min: Math.min(...competitorData.map(c => c.price)),
      max: Math.max(...competitorData.map(c => c.price))
    },
    topRatedCompetitors: competitorData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
  };
});
