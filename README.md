# 📚 English-WordGist
## 词汇精研 & 视觉通意

一个美观、模块化的英语单词学习网站，旨在通过“词汇精研”和“视觉通意”帮助用户深度理解和记忆英语单词。

### ✨ 功能特点

- 🎨 **精美设计**: 采用现代化的卡片式设计，视觉效果佳
- 📱 **响应式布局**: 完美适配手机、平板和桌面设备
- 🔀 **随机学习**: 支持随机排序，增加学习趣味性
- 🔍 **搜索功能**: 支持按单词、中文释义搜索
- 📊 **难度筛选**: 按初级、中级、高级筛选单词
- 📖 **详细信息**: 每个单词都有详细的学习页面
- 🎯 **记忆技巧**: 提供独特的记忆方法和技巧
- 💡 **同义反义词**: 扩展词汇量的学习
- ⚡ **模块化架构**: 易于扩展和维护
- 🌐 **免费托管**: 完全免费，托管在 GitHub Pages

### 📁 项目结构

```
English-WordGist/
├── index.html              # 主页面
├── word-detail.html        # 单词详情页面
├── css/                    # 样式文件夹
│   ├── main.css           # 主页面样式
│   └── detail.css         # 详情页面样式
├── js/                     # JavaScript文件夹
│   ├── main.js            # 主页面逻辑
│   └── detail.js          # 详情页面逻辑
├── data/                   # 数据文件夹
│   ├── vocabulary.json    # 基础词汇数据
│   └── word-details.json  # 详细学习数据
├── README.md              # 项目说明
└── _config.yml           # GitHub Pages配置
```

### 🚀 在线访问

访问网站: [https://yourusername.github.io/English-WordGist](https://yourusername.github.io/English-WordGist)

### 📋 包含的单词

目前包含以下高频英语单词：
- **Process** - 过程，程序
- **Achieve** - 实现，达到
- **Analyze** - 分析，解析
- **Creative** - 创造性的，有创意的
- **Efficient** - 高效的，有效率的
- **Implement** - 实施，执行

### 🛠️ 如何部署到 GitHub Pages

1. **Fork 或下载此项目**
2. **上传到您的 GitHub 仓库**
3. **启用 GitHub Pages**:
   - 进入仓库设置 (Settings)
   - 滚动到 "Pages" 部分
   - 选择 "Deploy from a branch"
   - 选择 "main" 分支和 "/ (root)" 文件夹
   - 点击 "Save"
4. **等待部署完成** (通常需要几分钟)
5. **访问您的网站**: `https://yourusername.github.io/English-WordGist`

### 🎯 使用方法

1. **浏览单词**: 在主页面查看所有单词卡片
2. **搜索单词**: 使用搜索框查找特定单词
3. **筛选难度**: 选择不同难度级别的单词
4. **查看详情**: 点击任意卡片查看详细信息
5. **随机学习**: 使用"随机排序"功能打乱学习顺序
6. **键盘快捷键**: Ctrl+R 随机排序，Ctrl+F 搜索

### 🔧 如何添加新单词

#### 1. 添加基础信息到 `data/vocabulary.json`

```json
{
  "word": "Example",
  "pronunciation": "/ɪɡˈzɑːmpl/",
  "definition": "例子，示例",
  "example": "This is a good example of modern design.",
  "chinese": "例子，示例",
  "level": "intermediate",
  "category": "general",
  "frequency": "high",
  "tags": ["education", "communication"]
}
```

#### 2. 添加详细信息到 `data/word-details.json`

```json
"Example": {
  "word": "Example",
  "pronunciation": "/ɪɡˈzɑːmpl/",
  "definition": "用来说明或证明某事的典型案例",
  "etymology": {
    "breakdown": "ex- (out) + -ample (sample)",
    "explanation": "词源解释..."
  },
  "visualDemo": {
    "steps": ["📝", "👁️", "💡", "✅"],
    "description": "视觉描述..."
  },
  "memoryStory": "记忆故事...",
  "examples": [
    { "type": "名词", "sentence": "This is a perfect example." }
  ],
  "synonyms": ["instance", "case", "sample"],
  "antonyms": ["exception", "anomaly"],
  "phrases": [
    { "phrase": "for example", "meaning": "例如" }
  ]
}
```

### 📊 数据结构说明

#### vocabulary.json 字段说明
- `word`: 单词
- `pronunciation`: 音标
- `definition`: 中文定义
- `example`: 例句
- `chinese`: 中文释义
- `level`: 难度级别 (beginner/intermediate/advanced)
- `category`: 分类 (general/academic/business等)
- `frequency`: 使用频率 (high/medium/low)
- `tags`: 标签数组

#### word-details.json 字段说明
- `etymology`: 词根词源信息
- `visualDemo`: 视觉演示数据
- `memoryStory`: 记忆故事
- `examples`: 例句数组
- `synonyms`: 同义词数组
- `antonyms`: 反义词数组
- `phrases`: 常用短语数组

### 🎨 自定义样式

#### 修改主题颜色
在 `css/main.css` 或 `css/detail.css` 中修改：
```css
/* 主要渐变色 */
background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);

/* 卡片头部颜色 */
.card-header {
    background: linear-gradient(135deg, #your-color3 0%, #your-color4 100%);
}
```

#### 添加新的动画效果
在CSS文件中添加新的 `@keyframes` 规则。

### 🚀 扩展功能建议

- [ ] **语音播放**: 添加单词发音功能
- [ ] **学习进度**: 跟踪学习进度和复习计划
- [ ] **测试模式**: 添加单词测试和练习
- [ ] **收藏功能**: 收藏重点学习的单词
- [ ] **分类管理**: 按主题分类管理单词
- [ ] **导入导出**: 支持词汇表的导入导出
- [ ] **离线功能**: 支持离线使用
- [ ] **多语言**: 支持其他语言学习

### 🔍 故障排除

#### 常见问题

1. **单词详情页面显示"加载失败"**
   - 检查 `data/` 文件夹中的JSON文件是否存在
   - 确认JSON格式是否正确
   - 检查网络连接

2. **样式显示异常**
   - 确认CSS文件路径正确
   - 检查浏览器控制台是否有错误

3. **搜索功能不工作**
   - 确认JavaScript文件加载正常
   - 检查浏览器控制台错误信息

### 📈 性能优化

- 使用JSON文件存储数据，加载速度快
- CSS和JS文件分离，便于缓存
- 响应式图片和字体优化
- 懒加载和按需加载机制

### 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 📄 许可证

MIT License - 可自由使用和修改

### 🙏 致谢

感谢所有为英语学习资源做出贡献的开发者和教育工作者。

---

**开始您的英语学习之旅吧！** 🚀

### 📞 技术支持

如果遇到问题，可以：
- 查看项目的 Issues 页面
- 创建新的 Issue 描述问题
- 参考 GitHub Pages 官方文档