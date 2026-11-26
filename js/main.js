// main.js - 界面连接
(function () {
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const statusText = document.getElementById('statusText');
  const settingsPanel = document.getElementById('settings');
  const tokenInput = document.getElementById('tokenInput');
  const repoInput = document.getElementById('repoInput');

  function now() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }

  function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = 'msg ' + type;
    if (type !== 'system' && type !== 'thinking') {
      const t = document.createElement('div');
      t.className = 'time';
      t.textContent = (type === 'user' ? '你' : 'ibot') + '  ' + now();
      div.appendChild(t);
    }
    const content = document.createElement('div');
    content.textContent = text;
    div.appendChild(content);
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }

  function updateStatus() {
    const cfg = GitHub.loadConfig();
    if (cfg.token) {
      statusText.textContent = '· 已连接 · ' + cfg.repo;
      statusText.style.color = '#81c784';
    } else {
      statusText.textContent = '· 未连接 GitHub';
      statusText.style.color = '#888';
    }
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    const thinking = addMsg('思考并学习中…', 'thinking');
    try {
      const result = await Brain.process(text);
      thinking.remove();
      addMsg(result.content, 'bot');
    } catch (e) {
      thinking.remove();
      addMsg('出错：' + e.message, 'error');
    }
  }

  sendBtn.onclick = send;
  input.onkeydown = e => { if (e.key === 'Enter') send(); };

  document.getElementById('btnSettings').onclick = () => {
    settingsPanel.classList.toggle('show');
    const cfg = GitHub.loadConfig();
    tokenInput.value = cfg.token;
    repoInput.value = cfg.repo;
  };

  document.getElementById('btnSave').onclick = () => {
    GitHub.saveConfig(tokenInput.value.trim(), repoInput.value.trim());
    settingsPanel.classList.remove('show');
    updateStatus();
    addMsg('配置已保存。', 'system');
  };

  document.getElementById('btnClear').onclick = () => {
    GitHub.clearToken();
    tokenInput.value = '';
    settingsPanel.classList.remove('show');
    updateStatus();
    addMsg('Token 已清除。', 'system');
  };

  updateStatus();
  addMsg('ibot 已启动。\n\n直接提问任何问题，我会尝试从网络学习并回答，同时把学到的内容写入仓库。\n也可以用「学习 主题」或「天气 地点」。', 'system');
  input.focus();
})();
