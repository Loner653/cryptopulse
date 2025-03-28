module.exports = {
    siteUrl: 'https://cryptoglobalive.com',
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