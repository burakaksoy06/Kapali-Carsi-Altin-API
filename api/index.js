export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Sadece GET desteklenir'
    });
  }

  const { list, sembol } = req.query;

  if (!list) {
    return res.status(400).json({
      success: false,
      message: 'list parametresi zorunludur'
    });
  }

  const normalizedList = String(list).toLowerCase();

  if (!['doviz', 'altin'].includes(normalizedList)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz list parametresi. Desteklenen değerler: doviz, altin'
    });
  }

  // sembol verilmediyse tümünü çek
  const sembolParam =
    sembol && String(sembol).trim().length > 0
      ? String(sembol).trim().toUpperCase()
      : 'all';

  const apiUrl = new URL('https://api.genelpara.com/json/');
  apiUrl.searchParams.set('list', normalizedList);
  apiUrl.searchParams.set('sembol', sembolParam);

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: 'GenelPara yanıt vermedi',
        statusCode: response.status
      });
    }

    const result = await response.json();

    if (!result?.success || typeof result?.data !== 'object' || result.data === null) {
      return res.status(502).json({
        success: false,
        message: 'GenelPara yanıt formatı beklenenden farklı'
      });
    }

    // GenelPara yapısını aynı sözleşmeyle dön
    return res.status(200).json({
      success: true,
      list: normalizedList,
      count: Object.keys(result.data).length,
      remaining: typeof result.remaining === 'number' ? result.remaining : null,
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Veri alınamadı',
      error: error.message
    });
  }
}