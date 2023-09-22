import { SingleRelay } from "@/app/pocket";
const ChainPattern = /[0-9a-fA-F]{4}/;

export async function OPTIONS() {
  return new Response('', {status: 200});
}

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const chain = url.pathname.slice(11);
    if (!chain.match(ChainPattern)) {
      return new Response('', {status: 404});
    }
    const body = await request.json();
    const resp = await SingleRelay('testnet', chain, body);
    return new Response(resp, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
  catch (e) {
    return new Response(JSON.stringify({
      error: e.message,
    }), {status: 500});
  }
}
