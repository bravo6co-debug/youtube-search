// Vercel Serverless Function for YouTube Videos API
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
    const { channelId, maxResults = 5 } = req.query;

    // 채널 ID 유효성 검사
    if (!channelId) {
      return res.status(400).json({ error: '채널 ID가 필요합니다.' });
    }

    // 환경 변수에서 API 키 가져오기
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
    }

    // 채널의 최근 동영상 검색
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${API_KEY}`;

    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube Search API Error:', errorData);

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
    const videoIds = searchData.items.map(item => item.id.videoId);

    if (videoIds.length === 0) {
      return res.status(200).json({ videos: [] });
    }

    // 동영상 상세 정보 (길이, 업로드 날짜)
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${API_KEY}`;

    const videosResponse = await fetch(videosUrl);

    if (!videosResponse.ok) {
      const errorData = await videosResponse.json();
      console.error('YouTube Videos API Error:', errorData);

      // 비디오 정보를 못 가져와도 기본 정보는 반환
      const videos = searchData.items.map(item => ({
        id: item.id.videoId,
        duration: 'PT0S',
        publishedAt: item.snippet.publishedAt
      }));

      return res.status(200).json({ videos: videos });
    }

    const videosData = await videosResponse.json();

    // 동영상 정보 반환
    const videos = videosData.items.map(video => ({
      id: video.id,
      duration: video.contentDetails.duration,
      publishedAt: video.snippet.publishedAt
    }));

    return res.status(200).json({ videos: videos });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
}
