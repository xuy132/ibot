// brain.js - 核心思考（以后主要在这里进化）
const Brain = {
  async process(text) {
    const original = text.trim();
    const lower = original.toLowerCase();

    if (lower.includes('清除token') || lower.includes('清除 token')) {
      GitHub.clearToken();
      return { type: 'text', content: 'Token 已清除。' };
    }

    // 明确学习指令
    let topic = null;
    const patterns = [
      /^(学习|学|研究|阅读|了解|爬取|抓取)[：:\s]*(.+)$/i,
      /^(.+?)\s*(学习|研究)$/i
    ];
    for (const p of patterns) {
      const m = original.match(p);
      if (m) {
        topic = (m[2] || m[1]).trim().replace(/^[：:]\s*/, '');
        break;
      }
    }
    if (topic && topic.length > 1) {
      return await this.learnAndAnswer(topic, true);
    }

    // 天气
    const weatherKeys = ['天气', '气温', '温度', '下雨', '雨', '冷不冷', '热不热', '多少度'];
    if (weatherKeys.some(k => original.includes(k))) {
      let place = original.replace(/今天|今日|明天|现在|的|天气|气温|温度|怎么样|如何|多少度|冷不冷|热不热|[？?。]/g, '').trim();
      if (!place || place.length < 2) place = '上饶';
      const result = await Sensors.getWeather(place);
      return { type: 'text', content: result };
    }

    // 状态
    if (['状态', '进度', '进化', '你怎么进化', '你是谁', '介绍'].some(k => lower.includes(k))) {
      const cfg = GitHub.loadConfig();
      return {
        type: 'text',
        content: `我是 ibot。\n当前能力：\n• 直接提问 → 自动从维基百科学习并回答\n• 学习 主题 → 强制学习并写入仓库\n• 查天气\n• GitHub 写入：${cfg.token ? '已连接 ' + cfg.repo : '未设置 Token'}\n\n目标：问什么就学什么，并记住。`
      };
    }

    if (['你好', '您好', 'hello', 'hi', '嗨'].some(g => lower.includes(g))) {
      return { type: 'text', content: '你好。直接问我任何问题，我会尝试学习并回答。也可以说「学习 主题」。' };
    }

    // 核心：任何其他输入都当作问题，尝试学习并回答
    return await this.learnAndAnswer(original, false);
  },

  // 学习 + 回答
  async learnAndAnswer(topic, forceSave) {
    const wiki = await Sensors.getWikipedia(topic);

    if (!wiki || !wiki.extract) {
      return {
        type: 'text',
        content: `关于「${topic}」，我暂时没有找到可靠信息。\n你可以换个更具体的关键词再试，或者用「学习 主题」强制记录。`
      };
    }

    // 生成回答
    let answer = `**${wiki.title}**`;
    if (wiki.description) answer += `（${wiki.description}）`;
    answer += `\n\n${wiki.extract}`;
    if (wiki.url) answer += `\n\n来源：${wiki.url}`;

    // 自动写入仓库（丰富自己）
    const date = new Date().toISOString().slice(0, 10);
    const safeName = topic.replace(/[\/\\?%*:|"<>：]/g, '_').replace(/\s+/g, '_').slice(0, 40);
    const path = `knowledge/${safeName}.md`;

    const content = `# ${wiki.title}\n\n> ibot 于 ${date} 自动学习\n\n${wiki.extract}\n\n${wiki.url ? '[完整条目](' + wiki.url + ')' : ''}\n\n---\n*自动记录*`;

    try {
      const url = await GitHub.putFile(path, content, `ibot 自动学习：${topic}`);
      answer += `\n\n（已自动写入知识库：${path}）`;
    } catch (err) {
      // 写入失败不影响回答
      if (forceSave) {
        answer += `\n\n写入知识库失败：${err.message}`;
      }
    }

    return { type: 'text', content: answer };
  }
};
