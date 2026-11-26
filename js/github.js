// github.js - 与 GitHub 交互
const GitHub = {
  loadConfig() {
    return {
      token: localStorage.getItem('ibot_token') || '',
      repo: localStorage.getItem('ibot_repo') || 'xuy132/ibot'
    };
  },
  saveConfig(token, repo) {
    if (token !== undefined) localStorage.setItem('ibot_token', token);
    if (repo !== undefined) localStorage.setItem('ibot_repo', repo);
  },
  clearToken() {
    localStorage.removeItem('ibot_token');
  },
  async putFile(path, content, message) {
    const cfg = this.loadConfig();
    if (!cfg.token) throw new Error('未设置 Token');
    const [owner, repoName] = cfg.repo.split('/');
    if (!owner || !repoName) throw new Error('仓库格式错误');

    let sha = null;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, {
        headers: { 'Authorization': `Bearer ${cfg.token}`, 'Accept': 'application/vnd.github+json' }
      });
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
      }
    } catch (e) {}

    const body = {
      message: message || `ibot: ${path}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: 'main'
    };
    if (sha) body.sha = sha;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cfg.token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub ${res.status}`);
    }
    const result = await res.json();
    return result.content?.html_url || `https://github.com/${owner}/${repoName}/blob/main/${path}`;
  }
};
