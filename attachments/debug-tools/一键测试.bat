@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🧪 英语单词卡片 - 一键测试工具
echo ========================================
echo.

:menu
echo 请选择测试方式：
echo.
echo [1] 🚀 启动本地服务器 (推荐)
echo [2] 🔍 直接打开调试页面
echo [3] 📖 打开测试中心
echo [4] 🏠 直接打开主页面
echo [5] 📱 查看移动端测试地址
echo [6] ❌ 退出
echo.
set /p choice=请输入选择 (1-6): 

if "%choice%"=="1" goto server
if "%choice%"=="2" goto debug
if "%choice%"=="3" goto testcenter
if "%choice%"=="4" goto direct
if "%choice%"=="5" goto mobile
if "%choice%"=="6" goto exit
echo 无效选择，请重新输入
goto menu

:server
echo.
echo 🚀 正在启动本地服务器...
echo.
echo 检查Python环境...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ 找到Python，启动服务器...
    echo.
    echo 🌐 服务器地址: http://localhost:8000
    echo 📱 手机访问: http://你的电脑IP:8000
    echo.
    echo 💡 提示：
    echo   - 主页面: http://localhost:8000
    echo   - 测试中心: http://localhost:8000/attachments/debug-tools/simple-server.html
    echo   - 调试页面: http://localhost:8000/attachments/debug-tools/debug-detail.html
    echo.
    echo 按 Ctrl+C 停止服务器
    echo.
    cd ../..
    python -m http.server 8000
    goto end
) else (
    echo ❌ 未找到Python，尝试Node.js...
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ 找到Node.js，启动服务器...
        cd ../..
        npx http-server -p 8000
        goto end
    ) else (
        echo ❌ 未找到Python或Node.js
        echo.
        echo 📥 请安装以下任一工具：
        echo   - Python: https://python.org
        echo   - Node.js: https://nodejs.org
        echo.
        echo 💡 推荐使用 VS Code + Live Server 插件
        echo.
        pause
        goto menu
    )
)

:debug
echo.
echo 🔍 打开调试页面...
start debug-detail.html
echo ✅ 已打开调试页面
echo.
echo 💡 在调试页面中可以：
echo   - 查看数据加载状态
echo   - 测试Process单词详情
echo   - 检查所有功能模块
echo.
pause
goto menu

:testcenter
echo.
echo 📖 打开测试中心...
start simple-server.html
echo ✅ 已打开测试中心
echo.
echo 💡 在测试中心可以：
echo   - 查看所有测试链接
echo   - 了解VS Code Live Server使用方法
echo   - 获取问题解决方案
echo.
pause
goto menu

:direct
echo.
echo 🏠 直接打开主页面...
start ../../index.html
echo ✅ 已打开主页面
echo.
echo 💡 测试步骤：
echo   1. 确认显示6个单词卡片
echo   2. 测试搜索功能
echo   3. 点击Process卡片测试详情页
echo.
echo ⚠️  注意：直接打开可能有CORS限制
echo    建议使用VS Code Live Server或本地服务器
echo.
pause
goto menu

:mobile
echo.
echo 📱 移动端测试指南
echo.
echo 🔧 使用VS Code Live Server:
echo   1. 安装VS Code和Live Server插件
echo   2. 用VS Code打开项目文件夹
echo   3. 右键index.html → "Open with Live Server"
echo   4. 查看控制台显示的局域网地址
echo   5. 在手机浏览器中访问该地址
echo.
echo 🔧 使用Python服务器:
echo   1. 选择选项1启动服务器
echo   2. 查看你的电脑IP地址 (ipconfig)
echo   3. 在手机浏览器中访问 http://你的IP:8000
echo.
echo 💡 确保手机和电脑在同一WiFi网络下
echo.
pause
goto menu

:exit
echo.
echo 👋 感谢使用！
echo.
echo 🚀 推荐开发流程：
echo   1. 使用VS Code + Live Server进行开发
echo   2. 在本地充分测试所有功能
echo   3. 清理attachments文件夹
echo   4. 部署到GitHub Pages
echo.
goto end

:end
echo.
echo 🎯 测试完成！
echo.
echo 📚 如需帮助，请查看：
echo   - attachments/README.md - 项目说明
echo   - attachments/测试指南.md - 详细测试步骤
echo   - attachments/部署指南.md - 部署方法
echo.
pause