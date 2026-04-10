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

  const sourceData = {
    doviz: {
      USD: {
        alis: '43.4960',
        satis: '43.5028',
        degisim: '+0.20',
        oran: '+0.0870',
        yon: 'moneyUp',
        kur: 'TRY',
        sembol: '₺'
      },
      EUR: {
        alis: '51.6362',
        satis: '51.6483',
        degisim: '-0.96',
        oran: '-0.4958',
        yon: 'moneyDown',
        kur: 'TRY',
        sembol: '₺'
      }
    },
    altin: {
      GA: {
        alis: '4300.12',
        satis: '4312.45',
        degisim: '+0.20',
        oran: '+0.0870',
        yon: 'moneyUp',
        kur: 'TRY',
        sembol: '₺'
      },
      C: {
        alis: '7050.00',
        satis: '7125.00',
        degisim: '-0.10',
        oran: '-0.0210',
        yon: 'moneyDown',
        kur: 'TRY',
        sembol: '₺'
      }
    }
  };

  const selectedList = sourceData[normalizedList];

  if (!selectedList) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz list parametresi. Desteklenen değerler: doviz, altin'
    });
  }

  let filteredData = selectedList;

  if (sembol) {
    const symbols = String(sembol)
      .split(',')
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);

    filteredData = {};

    for (const code of symbols) {
      if (selectedList[code]) {
        filteredData[code] = selectedList[code];
      }
    }
  }

  return res.status(200).json({
    success: true,
    list: normalizedList,
    count: Object.keys(filteredData).length,
    remaining: 938,
    data: filteredData
  });
}