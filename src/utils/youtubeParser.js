export const parseYouTubeHistory = (jsonData) => {
  return jsonData
    .filter((item) => item.title && item.titleUrl)
    .map((item, index) => {
      const title = item.title.replace("Watched ", "");
      const channelName = item.subtitles ? item.subtitles[0].name : "Unknown";
      
      // Hashing the channel name to group creators together
      let hash = 0;
      for (let i = 0; i < channelName.length; i++) {
        hash = channelName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const channelHash = Math.abs(hash);

      // Spherical distribution for a "Galaxy" look
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
        color: ["#00d4ff", "#ff0055", "#9d00ff", "#00ff99", "#ffcc00"][channelHash % 5]
      };
    });
};