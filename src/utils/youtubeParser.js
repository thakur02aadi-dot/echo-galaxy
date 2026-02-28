export const parseYouTubeHistory = (jsonData) => {
  if (!Array.isArray(jsonData)) return [];
  return jsonData
    .filter((item) => item.title && item.titleUrl)
    .map((item, index) => {
      const title = item.title.replace("Watched ", "");
      const channelName = item.subtitles ? item.subtitles[0].name : "Unknown";
      
      let hash = 0;
      for (let i = 0; i < channelName.length; i++) {
        hash = channelName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const channelHash = Math.abs(hash);
      const radius = Math.random() * 45 + 5; 
      const theta = channelHash * 0.15; 
      const phi = Math.acos(2 * Math.random() - 1);

      return {
        id: index,
        title,
        channel: channelName,
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        color: ["#00d4ff", "#ff0055", "#9d00ff", "#00ff99", "#ffcc00"][channelHash % 5],
        faded: false
      };
    });
};

export const getTopChannels = (data) => {
  const counts = {};
  data.forEach(item => {
    counts[item.channel] = (counts[item.channel] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
};

export const filterData = (data, query) => {
  if (!query) return data.map(item => ({ ...item, faded: false }));
  const q = query.toLowerCase();
  return data.map(item => ({
    ...item,
    faded: !(item.title.toLowerCase().includes(q) || item.channel.toLowerCase().includes(q))
  }));
};

export const downloadGalaxySnapshot = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.setAttribute('download', 'echo-galaxy.png');
  link.setAttribute('href', canvas.toDataURL('image/png'));
  link.click();
};