<?php
// 允许跨域请求
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 只允许POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "仅支持POST方法"));
    exit;
}

// 获取提交的数据
$data = json_decode(file_get_contents("php://input"), true);

// 验证数据
if (
    !isset($data['pageName']) || 
    !isset($data['comment']) || 
    !isset($data['comment']['content']) || 
    !isset($data['comment']['rating'])
) {
    http_response_code(400);
    echo json_encode(array("message" => "提交的数据不完整"));
    exit;
}

// 获取评论数据
$pageName = $data['pageName'];
$comment = $data['comment'];

// 读取现有评论
$commentsFile = "../data/comments.json";
$existingComments = array();

if (file_exists($commentsFile)) {
    $jsonContent = file_get_contents($commentsFile);
    $existingComments = json_decode($jsonContent, true);
    
    if ($existingComments === null) {
        $existingComments = array();
    }
}

// 确保页面名称存在
if (!isset($existingComments[$pageName])) {
    $existingComments[$pageName] = array();
}

// 添加新评论
array_unshift($existingComments[$pageName], $comment);

// 保存更新后的评论
if (file_put_contents($commentsFile, json_encode($existingComments, JSON_PRETTY_PRINT))) {
    http_response_code(201);
    echo json_encode(array(
        "message" => "评论保存成功",
        "comment" => $comment
    ));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "评论保存失败"));
}
?> 