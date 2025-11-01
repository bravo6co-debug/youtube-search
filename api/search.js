// Vercel Serverless Function for YouTube API
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, maxResults = 50 } = req.query;

    // 검색어 유효성 검사
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: '검색어를 입력해주세요.' });
    }

    // 환경 변수에서 API 키 가져오기
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
    }

    // YouTube Data API v3 호출 - 채널 검색
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&maxResults=${maxResults}&key=${API_KEY}`;

    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube API Error:', errorData);

      if (searchResponse.status === 403) {
        return res.status(403).json({
          error: 'API 키가 유효하지 않거나 할당량이 초과되었습니다.',
          details: errorData.error?.message
        });
      }

      return res.status(searchResponse.status).json({
        error: 'YouTube API 호출 실패',
        details: errorData.error?.message
      });
    }

    const searchData = await searchResponse.json();
    const channelIds = searchData.items.map(item => item.id.channelId);

    if (channelIds.length === 0) {
      return res.status(200).json({
        totalResults: 0,
        channels: []
      });
    }

    // 채널 통계 정보 가져오기
    const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds.join(',')}&key=${API_KEY}`;

    const channelsResponse = await fetch(channelsUrl);

    if (!channelsResponse.ok) {
      const errorData = await channelsResponse.json();
      console.error('YouTube Channels API Error:', errorData);

      // 통계를 가져오지 못해도 기본 검색 결과는 반환
      const channels = searchData.items.map(item => ({
        channelId: item.id.channelId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        subscriberCount: '0',
        viewCount: '0',
        videoCount: '0'
      }));

      return res.status(200).json({
        totalResults: searchData.pageInfo.totalResults,
        channels: channels
      });
    }

    const channelsData = await channelsResponse.json();

    // 채널 정보와 통계 결합
    const channels = channelsData.items.map(channel => ({
      channelId: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url,
      publishedAt: channel.snippet.publishedAt,
      subscriberCount: channel.statistics.subscriberCount || '0',
      viewCount: channel.statistics.viewCount || '0',
      videoCount: channel.statistics.videoCount || '0'
    }));

    return res.status(200).json({
      totalResults: searchData.pageInfo.totalResults,
      channels: channels
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
