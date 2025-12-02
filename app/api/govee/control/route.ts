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

    // NEW GOVEE API (REQUIRED)
    const url = "https://developer-api.govee.com/v1/devices/control";

    const payload = {
      device,
      model,
      cmd
    };

    console.log("SENDING TO GOVEE:", payload);

    const res = await fetch(url, {
      method: "PUT", // REQUIRED BY NEW GOVEE API
      headers: {
        "Govee-API-Key": process.env.GOVEE_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("GOVEE RAW RESPONSE:", text);

    // Govee sometimes returns empty body → handle that
    if (!text || text.trim() === "") {
      console.error("ERROR: Empty response from Govee");
      return NextResponse.json(
        { error: "Empty response from Govee" },
        { status: 502 }
      );
    }

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
