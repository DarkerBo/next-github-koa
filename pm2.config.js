module.exports = {
  apps: [
    {
      name: 'next-github-koa',
      script: './server.js', // 启动文件
      instances: 1, // 启动应用程序数目
      autorestart: true, // 是否自动启动
      watch: false, // 是否监听
      max_memory_restart: '1G', // 程序超过指定内存就重新启动
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}