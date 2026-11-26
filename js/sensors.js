// sensors.js - 网络感知
const Sensors = {
  async getWeather(place) {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=zh&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      if (!geoData.results?.length) return `找不到地点「${place}」`;
      const loc = geoData.results[0];
      const name = loc.name + (loc.admin1 ? ' · ' + loc.admin1 : '');

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Shanghai`;
      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();
      const cur = wData.current;

      const map = {0:'晴朗',1:'主要晴朗',2:'局部多云',3:'阴天',45:'有雾',61:'小雨',63:'中雨',65:'大雨',71:'小雪',80:'小阵雨',95:'雷暴'};
      const desc = map[cur.weather_code] || '未知';

      return `${name}\n气温 ${cur.temperature_2m}°C\n湿度 ${cur.relative_humidity_2m}%\n风速 ${cur.wind_speed_10m} km/h\n状况：${desc}`;
    } catch (e) {
      return '天气查询失败：' + e.message;
    }
  },

  async getWikipedia(topic) {
    try {
      let url = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
      let res = await fetch(url);
      let data = await res.json();

      if (!data.extract) {
        url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
        res = await fetch(url);
        data = await res.json();
      }

      if (data.extract) {
        return {
          title: data.title || topic,
          extract: data.extract,
          description: data.description || '',
          url: data.content_urls?.desktop?.page || ''
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
};
