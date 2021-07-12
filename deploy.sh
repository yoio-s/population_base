#!/usr/bin/env sh
# sudo chmod -R 777 ./test.sh 给予权限
# 当发生错误时中止脚本
set -e
npm run build

docker build -t registry.cn-hangzhou.aliyuncs.com/skylark/population_base:1.0.0 .

docker push registry.cn-hangzhou.aliyuncs.com/skylark/population_base:1.0.0

