/** @type {import('next-sitemap').IConfig} */ 
module.exports = { 
  siteUrl: 'https://cryptoglobalive.com', 
  generateRobotsTxt: true, 
  robotsTxtOptions: { 
    policies: [ 
      { 
        userAgent: '*', 
        allow: '/', 
      }, 
    ], 
  }, 
}; 
