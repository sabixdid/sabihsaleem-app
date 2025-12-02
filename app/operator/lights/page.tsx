"use client";

import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function OperatorLights() {
  const [devices, setDevices] = useState<any[]>([]);
  const [brightness, setBrightness] = useState<Record<string, number>>({});
  const [colors, setColors] = useState<Record<string, string>>({});

  function isControllable(dev: any) {
    const bad = ["SameModeGroup", "BaseGroup", "Group", "Bulbs others"];
    return !bad.includes(dev.sku) && !bad.includes(dev.deviceName);
  }

  function getModel(dev: any) {
    if (dev.sku && /^H\d+/.test(dev.sku)) return dev.sku;
    if (dev.model) return dev.model;
    if (dev.type?.includes("light")) return dev.sku;
    return dev.sku;
  }

  useEffect(() => {
    fetch("/api/govee/devices")
      .then((r) => r.json())
      .then((d) => {
        const arr = (d.data || []).filter(isControllable);

        setDevices(arr);

        const b: Record<string, number> = {};
        const c: Record<string, string> = {};

        arr.forEach((dev: any) => {
          b[dev.device] = 50;
          c[dev.device] = "#ffffff";
        });

        setBrightness(b);
        setColors(c);
      });
  }, []);

  async function sendCommand(device: string, model: string, cmd: any) {
    await fetch("/api/govee/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device, model, cmd }),
    });
  }

  let debounceBrightness: NodeJS.Timeout;
  let debounceColor: NodeJS.Timeout;

  function sendBrightness(device: string, model: string, value: number) {
    clearTimeout(debounceBrightness);
    debounceBrightness = setTimeout(() => {
      sendCommand(device, model, {
        name: "brightness",
        value: value,
      });
    }, 150);
  }

  function sendColor(device: string, model: string, hex: string) {
    clearTimeout(debounceColor);
    debounceColor = setTimeout(() => {
      const rgb = parseInt(hex.replace("#", ""), 16);
      sendCommand(device, model, {
        name: "color",
        value: {
          r: (rgb >> 16) & 255,
          g: (rgb >> 8) & 255,
          b: rgb & 255,
        },
      });
    }, 120);
  }

  const presets: Record<string, string> = {
    OperatorWhite: "#ffffff",
    SabitxRed: "#ff2a2a",
    VaultBlue: "#0091ff",
    QuantumPurple: "#8b00ff",
    NightWarm: "#ffb86c",
    ChillMint: "#00ffa3",
    FocusWhite: "#f2f2ff",
  };

  return (
    <div className="px-4 py-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Operator • Lights</h1>

      <div className="space-y-6 pb-20">
        {devices.map((dev) => {
          const model = getModel(dev);

          return (
            <div key={dev.device} className="p-4 bg-zinc-900 rounded-xl shadow">
              <h2 className="text-lg font-semibold">{dev.deviceName}</h2>
              <p className="text-sm text-zinc-400">Model: {model}</p>
              <p className="text-xs text-zinc-500 break-all mb-2">{dev.device}</p>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() =>
                    sendCommand(dev.device, model, {
                      name: "turn",
                      value: "on",
                    })
                  }
                  className="px-3 py-1 bg-green-600 rounded-md"
                >
                  ON
                </button>
                <button
                  onClick={() =>
                    sendCommand(dev.device, model, {
                      name: "turn",
                      value: "off",
                    })
                  }
                  className="px-3 py-1 bg-red-600 rounded-md"
                >
                  OFF
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(presets).map(([name, hex]) => (
                  <button
                    key={name}
                    style={{ backgroundColor: hex }}
                    className="w-8 h-8 rounded-full border border-white/20"
                    onClick={() => {
                      setColors((prev) => ({ ...prev, [dev.device]: hex }));
                      sendColor(dev.device, model, hex);
                    }}
                  />
                ))}
              </div>

              <div className="mt-2 mb-4">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={brightness[dev.device] ?? 50}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setBrightness((prev) => ({ ...prev, [dev.device]: v }));
                    sendBrightness(dev.device, model, v);
                  }}
                  className="w-full"
                />
                <p className="text-xs text-zinc-400">
                  Brightness: {brightness[dev.device] ?? 50}%
                </p>
              </div>

              <div className="mt-4">
                <HexColorPicker
                  color={colors[dev.device]}
                  onChange={(hex) => {
                    setColors((prev) => ({ ...prev, [dev.device]: hex }));
                    sendColor(dev.device, model, hex);
                  }}
                />
                <p className="text-xs text-zinc-400 mt-1">
                  Color: {colors[dev.device]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
