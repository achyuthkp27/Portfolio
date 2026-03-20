const fs = require('fs');
const https = require('https');

const RSS_URL = 'https://medium.com/feed/@kpachyuthz';
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

https.get(API_URL, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.status === 'ok') {
        const posts = json.items.map(item => ({
          title: item.title,
          pubDate: item.pubDate,
          link: item.link,
          guid: item.guid,
          author: item.author,
          thumbnail: item.thumbnail,
          description: item.description,
          content: item.content,
          categories: item.categories
        }));
        
        // Ensure public/data directory exists
        if (!fs.existsSync('./public/data')) {
          fs.mkdirSync('./public/data', { recursive: true });
        }
        
        fs.writeFileSync('./public/data/blog.json', JSON.stringify(posts, null, 2));
        console.log('Blog data updated successfully.');
      } else {
        console.error('Failed to fetch RSS data:', json.status, json.message);
        process.exit(1);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
  process.exit(1);
});
