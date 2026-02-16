export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  const { action, query, id, limit = 50 } = req.query;

  try {
    // Search podcasts
    if (action === 'search' && query) {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=${limit}`
      );
      const data = await response.json();
      return res.json({
        success: true,
        results: data.results,
        count: data.resultCount
      });
    }
    
    // Get podcast details
    if (action === 'podcast' && id) {
      const response = await fetch(
        `https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode&limit=200`
      );
      const data = await response.json();
      return res.json({
        success: true,
        podcast: data.results[0],
        recent_episodes: data.results.slice(1, 11)
      });
    }

    // Get all episodes
    if (action === 'episodes' && id) {
      const response = await fetch(
        `https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode&limit=200`
      );
      const data = await response.json();
      return res.json({
        success: true,
        podcast: data.results[0],
        episodes: data.results.slice(1),
        total: data.results.length - 1
      });
    }
    
    // Help message
    return res.json({ 
      success: false,
      message: 'Podcast Aggregator API - Usage examples:',
      examples: {
        search: '/api?action=search&query=crime&limit=10',
