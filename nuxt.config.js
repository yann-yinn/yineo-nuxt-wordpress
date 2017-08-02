/**
 * Generate routes like ""/posts/xxxxx" so that nuxtjs can generate them
 */
const wordpressApiBaseUrl = 'https://public-api.wordpress.com/wp/v2/sites/yannboisselier.wordpress.com'
const axios = require('axios')

// @FIXME seulement 100 articles maxixum
// @FIXME ajouter les tags à la génération
function generateRoutes() {
  const promises = []
  // posts. 100 is the max we can process with wp api
  promises.push(axios.get(wordpressApiBaseUrl + '/posts?per_page=' + 100).then(result => {
    let slugs = []
    result.data.map(post => slugs.push('/blog/' + post.slug))
    return slugs
  }))

  return Promise.all(promises).then(function(result) {
    // we merge slugs arrays returned by each promise on a single big flat array
    return [].concat.apply([], result);
  })
}

module.exports = {
  cache: true,
  plugins: ['~plugins/app'],
  env: {
    siteBaseUrl: '"http://yineo.fr',
    wordpressApiBaseUrl: wordpressApiBaseUrl
  },

  router: {
    middleware: ['redirect-old-uris']
  },

  /*
  ** Generate dynamic routes
  */
  generate: {
    routes: generateRoutes
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: "robots", content: "noindex" },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'YINEO - développeur freelance full stack à Nantes' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/bulma-0.5.0.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/app.css' },
    ],
    script: [
      //  {  type: 'text/javascript', src: '/js/highlight.pack.js' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios'],
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 1000, // 1KO
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1000, // 1 KO
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
