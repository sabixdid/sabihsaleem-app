import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("CONTROL REQUEST BODY:", body);

    const { device, model, cmd } = body;

    if (!process.env.GOVEE_API_KEY) {
      console.error("ERROR: Missing GOVEE_API_KEY");
      return NextResponse.json(
        { error: "Missing GOVEE_API_KEY" },
        { status: 500 }
      );
    }

    if (!device || !model || !cmd) {
      console.error("ERROR: Missing fields", { device, model, cmd });
      return NextResponse.json(
        { error: "Missing fields", device, model, cmd },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://openapi.api.govee.com/router/api/v1/device/control",
      {
        method: "POST",
        headers: {
          "Govee-API-Key": process.env.GOVEE_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device, model, cmd }),
      }
    );

    const text = await res.text();
    console.log("GOVEE RAW RESPONSE:", text);

    // Try parsing JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch (e) {
      console.error("JSON PARSE ERROR:", e, text);
      return NextResponse.json(
        { error: "Invalid JSON from Govee", raw: text },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Server crashed", detail: String(err) },
      { status: 500 }
    );
  }
}
