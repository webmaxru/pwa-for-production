const {copyWorkboxLibraries} = require('workbox-build')

copyWorkboxLibraries('dist/pwa-for-production')
  .then((dir) => {
    console.log(`Successfully copied workbox libraries to ${dir} folder`)
  })
  .catch((err) => {
    console.error(`Error copying libraries: ${err}`)
  })
