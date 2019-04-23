const {injectManifest} = require('workbox-build')

let workboxConfig = {
  globDirectory: 'dist/pwa-for-production',
  globPatterns: [
    'favicon.ico',
    'index.html',
    '*.css',
    '*.js',
    'assets/**/*'
  ],
  swSrc: 'src/sw-workbox.js',
  swDest: 'dist/pwa-for-production/sw-workbox.js'
}

injectManifest(workboxConfig)
  .then(({count, size}) => {
    console.log(`Generated ${workboxConfig.swDest}, which will precache ${count} files, totaling ${size} bytes.`)
  })
