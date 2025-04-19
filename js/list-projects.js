// 这个文件提供一个模拟的项目列表API响应
// 在实际的服务器环境中，你可以使用list-projects.php来动态获取Projects目录中的文件
// 或者在构建时生成这个文件

// 默认样本项目列表
const projectsList = [
    {
        file: "snake-game.html",
        name: "snake-game",
        title: "唯美贪吃蛇"
    },
    {
        file: "tetris-game.html",
        name: "tetris-game",
        title: "唯美俄罗斯方块"
    }
];

// 模拟API响应
async function fetchProjects() {
    // 在实际应用中，这里会调用fetch API获取后端数据
    // 但现在我们直接返回模拟数据
    return new Promise((resolve) => {
        // 添加一点延迟以模拟网络请求
        setTimeout(() => {
            resolve(projectsList);
        }, 300);
    });
}