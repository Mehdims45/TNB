module.exports = {
  apps: [
    {
      name: 'scrape',
      script: 'npm run scrape',
      cron: '0 * * * *'
    }
  ]
};
