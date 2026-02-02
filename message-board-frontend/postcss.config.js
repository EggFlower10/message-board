// postcss.config.js
export default {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 75,
            propList: ['*'],
            selectorBlackList: ['van-']
        }
    }
}