#!/bin/sh

# 读取版本号
version=$(cat VERSION)
echo "Building Go application version: $version"

# 设置输出目录
output_dir="build"
output_file="$output_dir/nine-one-api-$version"

# 创建输出目录
mkdir -p $output_dir

# 删除输出目录中的历史文件
echo "Cleaning up old build files..."
rm -rf $output_dir/*

# 安装依赖
echo "Downloading Go modules..."
go mod download

# 构建 Go 应用
echo "Building Go application..."
CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags "-s -w -extldflags '-static'" -o $output_file

# 打印构建结果
if [ $? -eq 0 ]; then
    echo "Build successful: $output_file"
else
    echo "Build failed"
    exit 1
fi