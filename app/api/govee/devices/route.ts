import { NextResponse } from "next/server";

const API_KEY = process.env.GOVEE_API_KEY!;

export async function GET() {
  try {
    const res = await fetch(
      "https://openapi.api.govee.com/router/api/v1/user/devices",
      {
        headers: {
          "Govee-API-Key": API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch devices" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
