import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOVEE_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { device, model, cmd } = await req.json();

    const res = await fetch(
      "https://openapi.api.govee.com/router/api/v1/device/control",
      {
        method: "POST",
        headers: {
          "Govee-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device, model, cmd }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
