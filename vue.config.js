module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // 将/api替换为以下路径
                // target: 'https://autumnfish.cn/',
                target: 'http://localhost:3000/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                //删除替换后的路径中的'api'
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}


// 详情请见:https://blog.csdn.net/qq_43681948/article/details/93594689
