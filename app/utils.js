export function GetJsonFetcher(cacheMode) {
  return async (url, payload) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: cacheMode,
    });

    try {
      const body = await res.text();
      try {
        return JSON.parse(body);
      }
      catch (e) {
        return {
          message: `Non-JSON response: '${body}'`,
        };
      }
    }
    catch (e) {
      return {
        message: `Failed to get the response: '${e.message}'`,
      };
    }
  }
}

export function UrlForDisplay(urlStr) {
  const url = new URL(urlStr);
  const chunks = url.hostname.split('.');
  if (chunks.length <= 2 || chunks[0].length <= 16) {
    return url.hostname;
  }

  const prefix = chunks[0].slice(0, 6);
  const suffix = chunks[0].slice(-6);
  chunks[0] = `${prefix}...${suffix}`;
  return chunks.join('.');
}

export function SortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(SortObjectKeys);
  }

  const sortedObj = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sortedObj[key] = SortObjectKeys(obj[key]);
  }

  return sortedObj;
}

export function GetTextAreaHeight(content, min, max) {
  let lines = content.split('\n').length * 1.5;
  if (lines < min) {
    lines = min;
  }
  if (lines > max) {
    lines = max;
  }
  return `${lines}rem`;
}

export function SortBy(arr, fetcher) {
  arr.sort((a, b) => {
    const v1 = fetcher(a);
    const v2 = fetcher(b);
    return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
  });
}