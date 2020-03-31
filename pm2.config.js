module.exports = {
  apps: [
    {
      name: 'API Gateway', // 应用名称
      script: './dist/server.js', // 启动文件地址
      cwd: './', // 当前工作路径
      watch: [
        // 监控变化的目录，一旦变化，自动重启
        'src',
        'dist',
      ],
      ignore_watch: [
        // 忽视这些目录的变化
        'node_modules',
        'log',
        'public',
      ],
      node_args: '--harmony', // 向上兼容
      env: {
        NODE_ENV: 'development', 
      },
      env_production: {
        NODE_ENV: 'production',
      },
      out_file: './log/out.log', // 普通日志路径
      error_file: './log/err.log', // 错误日志路径
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
}