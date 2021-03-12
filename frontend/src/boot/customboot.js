// import something here

import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs

// import pao from 'components/pao.vue'

import wings from 'wings4'


// const wings = require('wings4').default
// let app = wings('http://localhost:3030')
 

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app, router, Vue }) => {
  // something to do
  
  Vue.prototype.$dbCon = wings('http://localhost:3030')

  Vue.prototype.$pdfMake = pdfMake

  Vue.use(Chartkick.use(Chart))

}