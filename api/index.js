export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  const { action, query, id, limit = 50 } = req.query;

  try {
    // Helper function to make API calls
    const makeRequest = async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    };

    // Search podcasts
    if (action === 'search' && query) {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=${limit}`;
      const data = await makeRequest(url);
      return res.status(200).json({
        success: true,
        results: data.results || [],
        count: data.resultCount || 0
      });
    }
    
    // Get podcast details
    if (action === 'podcast' && id) {
      const url = `https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode&limit=200`;
      const data = await makeRequest(url);
      return res.status(200).json({
        success: true,
        podcast: data.results?.[0] || null,
        recent_episodes: data.results?.slice(1, 11) || []
      });
    }

    // Get all episodes
    if (action === 'episodes' && id) {
      const url = `https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode&limit=200`;
      const data = await makeRequest(url);
      return res.status(200).json({
        success: true,
        podcast: data.results?.[0] || null,
        episodes: data.results?.slice(1) || [],
        total: (data.results?.length || 1) - 1
      });
    }
    
    // Help message
    return res.status(200).json({ 
      success: false,
      message: 'Podcast Aggregator API - Usage examples:',
      examples: {
        search: '/api?action=search&query=crime&limit=10',
        podcast: '/api?action=podcast&id=1380008439',
        episodes: '/api?action=episodes&id=1380008439'
      }
    });
    
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
