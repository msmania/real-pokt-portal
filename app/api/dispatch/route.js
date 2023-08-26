import { DispatchRequest } from "@/app/pocket";

export async function POST(request) {
  try {
    const body = await request.json();
    const resp = await DispatchRequest(
      body.network,
      body.height,
      body.chainId,
    );
    delete resp.session.header.applicationPubKey;
    return Response.json(resp.session);
  }
  catch (e) {
    return Response.json(e);
  }
}
