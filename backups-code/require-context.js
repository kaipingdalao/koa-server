let requireContexta = require('require-context');
const files = requireContexta('/Users/tanhongda/Documents/dev/vue/vite/cms_blog/server/modules/article/controllers', true, /\.js$/)
console.log('=========controller')
const requireContext = files
const requireAll = context => context.keys().map(context)

console.log(requireContext)
console.log(requireAll(requireContext))
requireAll(requireContext).forEach(item => {
    console.log(item)
})
