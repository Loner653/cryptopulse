/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://cryptoglobalive.com', // Your live domain
    generateRobotsTxt: true, // Automatically generates robots.txt
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    },
  };