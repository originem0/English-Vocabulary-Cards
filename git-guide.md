# 📚 Git 使用指南 - 从零开始

## 🎯 适用人群
初学者，第一次使用 Git 和 GitHub 的开发者

## 📋 目录
1. [Git 基础概念](#git-基础概念)
2. [安装和配置](#安装和配置)
3. [创建仓库](#创建仓库)
4. [基本操作流程](#基本操作流程)
5. [常用命令速查](#常用命令速查)
6. [实际操作示例](#实际操作示例)
7. [常见问题解决](#常见问题解决)

---

## 🔍 Git 基础概念

### 什么是 Git？
Git 是一个分布式版本控制系统，帮助你：
- 📝 跟踪代码变化
- 🔄 回退到之前的版本
- 👥 与他人协作开发
- 🌿 管理不同的开发分支

### 核心概念
- **仓库 (Repository)**：存放项目的地方
- **提交 (Commit)**：保存一次代码变更
- **分支 (Branch)**：独立的开发线
- **远程仓库 (Remote)**：托管在网上的仓库（如 GitHub）

---

## ⚙️ 安装和配置

### 1. 安装 Git
- **Windows**: 下载 [Git for Windows](https://git-scm.com/download/win)
- **Mac**: `brew install git` 或下载安装包
- **Linux**: `sudo apt install git` (Ubuntu) 或 `sudo yum install git` (CentOS)

### 2. 首次配置
```bash
# 设置用户名和邮箱（必须）
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱@example.com"

# 查看配置
git config --list
```

---

## 🏗️ 创建仓库

### 方式一：本地创建新仓库
```bash
# 进入项目文件夹
cd /path/to/your/project

# 初始化 Git 仓库
git init

# 查看状态
git status
```

### 方式二：克隆远程仓库
```bash
# 从 GitHub 克隆仓库
git clone https://github.com/用户名/仓库名.git

# 进入克隆的文件夹
cd 仓库名
```

---

## 🔄 基本操作流程

### 标准工作流程：
```
修改文件 → 添加到暂存区 → 提交 → 推送到远程仓库
```

### 1. 查看状态
```bash
# 查看当前状态
git status

# 查看文件差异
git diff
```

### 2. 添加文件到暂存区
```bash
# 添加单个文件
git add filename.txt

# 添加所有修改的文件
git add .

# 添加特定类型的文件
git add *.js
```

### 3. 提交更改
```bash
# 提交并添加描述信息
git commit -m "描述你做了什么修改"

# 修改上一次提交的信息
git commit --amend -m "新的提交信息"
```

### 4. 推送到远程仓库
```bash
# 第一次推送（设置上游分支）
git push -u origin main

# 后续推送
git push
```

---

## 📖 常用命令速查

### 🔍 查看信息
```bash
git status          # 查看当前状态
git log             # 查看提交历史
git log --oneline   # 简洁的提交历史
git diff            # 查看未暂存的修改
git diff --staged   # 查看已暂存的修改
```

### 📁 文件操作
```bash
git add .           # 添加所有修改
git add filename    # 添加特定文件
git rm filename     # 删除文件
git mv old new      # 重命名文件
```

### 💾 提交操作
```bash
git commit -m "信息"     # 提交修改
git commit -am "信息"    # 添加并提交（仅限已跟踪文件）
git reset HEAD filename  # 取消暂存文件
git checkout filename    # 撤销文件修改
```

### 🌐 远程操作
```bash
git remote -v                    # 查看远程仓库
git remote add origin URL       # 添加远程仓库
git push origin main            # 推送到远程仓库
git pull origin main            # 从远程仓库拉取更新
git fetch                       # 获取远程更新（不合并）
```

### 🌿 分支操作
```bash
git branch              # 查看本地分支
git branch -a           # 查看所有分支
git branch new-feature  # 创建新分支
git checkout main       # 切换到 main 分支
git checkout -b feature # 创建并切换到新分支
git merge feature       # 合并分支
git branch -d feature   # 删除分支
```

---

## 🚀 实际操作示例

### 场景：上传你的 English-Vocabulary-Cards 项目

#### 步骤 1：在 GitHub 创建仓库
1. 登录 GitHub
2. 点击 "New repository"
3. 输入仓库名：`English-Vocabulary-Cards`
4. 选择 "Public" 或 "Private"
5. 点击 "Create repository"

#### 步骤 2：本地初始化和上传
```bash
# 1. 进入项目文件夹
cd English-Vocabulary-Cards

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件
git add .

# 4. 首次提交
git commit -m "Initial commit: English Vocabulary Cards project"

# 5. 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/English-Vocabulary-Cards.git

# 6. 推送到 GitHub
git push -u origin main
```

#### 步骤 3：后续更新流程
```bash
# 1. 修改文件后，查看状态
git status

# 2. 添加修改的文件
git add .

# 3. 提交修改
git commit -m "Fix: 修复详情页面内容无法显示的问题"

# 4. 推送到远程仓库
git push
```

---

## ❗ 常见问题解决

### 1. 推送被拒绝
```bash
# 错误信息：Updates were rejected because the remote contains work...
# 解决方案：先拉取远程更新
git pull origin main
# 然后再推送
git push
```

### 2. 合并冲突
```bash
# 当出现冲突时，编辑冲突文件，然后：
git add .
git commit -m "Resolve merge conflict"
```

### 3. 撤销操作
```bash
# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃修改）
git reset --hard HEAD~1

# 撤销文件修改
git checkout -- filename
```

### 4. 忘记添加 .gitignore
```bash
# 创建 .gitignore 文件
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore

# 移除已跟踪的文件
git rm -r --cached node_modules/
git commit -m "Add .gitignore and remove node_modules"
```

---

## 📝 .gitignore 文件示例

创建 `.gitignore` 文件来忽略不需要版本控制的文件：

```gitignore
# 依赖文件
node_modules/
npm-debug.log*

# 系统文件
.DS_Store
Thumbs.db

# 编辑器文件
.vscode/
.idea/
*.swp
*.swo

# 日志文件
*.log

# 临时文件
tmp/
temp/
*.tmp

# 环境配置
.env
.env.local
```

---

## 🎯 最佳实践

### 1. 提交信息规范
```bash
# 好的提交信息
git commit -m "Fix: 修复详情页面加载问题"
git commit -m "Add: 新增单词搜索功能"
git commit -m "Update: 优化页面样式"

# 避免的提交信息
git commit -m "修改"
git commit -m "update"
git commit -m "fix bug"
```

### 2. 提交频率
- ✅ 每完成一个小功能就提交
- ✅ 修复一个 bug 就提交
- ❌ 不要积累太多修改才提交

### 3. 分支管理
```bash
# 为新功能创建分支
git checkout -b feature/search-function

# 开发完成后合并
git checkout main
git merge feature/search-function
git branch -d feature/search-function
```

---

## 🔗 有用的资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 帮助文档](https://docs.github.com/)
- [Git 可视化学习](https://learngitbranching.js.org/)
- [Git 命令速查表](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 🎉 总结

记住这个基本流程：
1. `git add .` - 添加修改
2. `git commit -m "描述"` - 提交修改
3. `git push` - 推送到远程仓库

随着使用经验的增加，你会逐渐掌握更高级的 Git 功能。开始时不要担心犯错，Git 的强大之处就在于几乎所有操作都可以撤销！

**现在就开始你的 Git 之旅吧！** 🚀