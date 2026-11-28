# ibot – 纯网页个人智能体

> **ibot** 是一款可以直接在浏览器里运行的个人智能助手。  
> 无需后端服务器，所有交互都在前端完成，支持 **OpenAI GPT‑4o / GPT‑3.5** 等大模型。  
> 你可以把它嵌入自己的网页、博客或聊天工具，让访客随时提问。

---

## 📦 目录

| 章节 | 内容 |
|------|------|
| 🔧 运行环境 | 浏览器 + 可选 Node / Python 服务器 |
| 🚀 快速开始 | 直接打开、配置 API Key、运行 |
| 🛠️ 技术栈 | HTML5 + CSS3 + JavaScript + Web Components |
| 📦 安装 | 纯前端或本地服务器两种方式 |
| ⚙️ 配置 | API Key、模型、对话历史 |
| 📚 使用 | 交互方式、命令列表 |
| 🤝 贡献 | 如何提交 PR |
| 📄 许可证 | MIT |
| 📞 联系 | 作者信息 |

---

## 🔧 运行环境

- **浏览器**：Chrome / Edge / Firefox / Safari（建议 80+ 版本）
- **可选**：如果你想在本地搭建一个简易 HTTP 服务器（例如 `python -m http.server` 或 `node server.js`），请先安装 Node 或 Python。

> **注意**：所有大模型调用均通过 OpenAI API 进行，需自行申请并配置 `OPENAI_API_KEY`。

---

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/xuy132/ibot.git
cd ibot

# 2. 直接在浏览器打开 index.html
#    （推荐使用本地 HTTP 服务器，避免 CORS）
#    Python 3.x
python -m http.server 8000
#    Node (如果你有安装 http-server)
npx http-server -p 8000

# 3. 在浏览器中访问 http://localhost:8000
```

> 只要你打开 `index.html`，ibot 就会自动加载并等待你的提问。

---

## 🛠️ 技术栈

| 组件 | 说明 |
|------|------|
| **HTML5** | 页面结构 |
| **CSS3** | 响应式布局，支持暗黑模式 |
| **JavaScript** | 业务逻辑、与 OpenAI API 通信 |
| **Web Components** | 自定义 `<ibot-chat>` 组件，易于复用 |
| **Fetch API** | 与 OpenAI REST 接口交互 |
| **LocalStorage** | 存储对话历史，支持“继续对话”功能 |
| **ESLint / Prettier** | 代码规范（可选） |

---

## 📦 安装

### 1️⃣ 纯前端（最简）

```bash
# 
