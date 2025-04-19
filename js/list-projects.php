<?php
// 设置响应头为JSON
header('Content-Type: application/json');

// Projects目录路径
$projectsDir = '../Projects/';

// 获取所有HTML文件
$htmlFiles = glob($projectsDir . '*.html');

$projects = [];

foreach ($htmlFiles as $file) {
    // 获取文件名
    $filename = basename($file);
    
    // 获取文件内容，提取标题
    $content = file_get_contents($file);
    
    // 尝试从HTML中提取标题
    preg_match('/<title>(.*?)<\/title>/i', $content, $matches);
    $title = isset($matches[1]) ? $matches[1] : pathinfo($filename, PATHINFO_FILENAME);
    
    // 如果标题中包含分隔符，只取前半部分
    if (strpos($title, '|') !== false) {
        $title = trim(explode('|', $title)[0]);
    }
    
    // 将项目信息添加到数组
    $projects[] = [
        'file' => $filename,
        'name' => pathinfo($filename, PATHINFO_FILENAME),
        'title' => $title
    ];
}

// 输出JSON格式的项目列表
echo json_encode($projects);