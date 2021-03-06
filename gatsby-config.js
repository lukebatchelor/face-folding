module.exports = {
  siteMetadata: {
    title: 'Face Folding',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'face-folding',
        short_name: 'face-folding',
        start_url: '/',
        background_color: '#f1f1f1',
        theme_color: '#ffffff',
        display: 'standalone',
        icon: 'src/images/trumpFoldIcon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
  ],
};
