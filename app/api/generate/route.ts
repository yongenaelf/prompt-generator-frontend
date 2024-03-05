export async function POST(req: Request) {
  const _data = await req.json();
  const res = await fetch(process.env.BACKEND_API + "/batch-generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: _data }),
  });

  const data = await res.json();

  return Response.json(data);
}
