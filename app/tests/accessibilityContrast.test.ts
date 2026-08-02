import assert from "node:assert/strict";
import test from "node:test";

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(foreground: string, background: string) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("public brand text combinations meet WCAG 2.1 AA normal-text contrast", () => {
  assert.ok(contrast("#B9964A", "#0D151C") >= 4.5, "gold on ink");
  assert.ok(contrast("#76591F", "#F7F4EC") >= 4.5, "contextual gold on ivory");
  assert.ok(contrast("#76591F", "#F3F1EB") >= 4.5, "contextual gold on mist");
  assert.ok(contrast("#5D6B74", "#F7F4EC") >= 4.5, "muted text on ivory");
  assert.ok(contrast("#5D6B74", "#F3F1EB") >= 4.5, "muted text on mist");
  assert.ok(contrast("#FFFFFF", "#252C33") >= 4.5, "white text on the worst-case photographic scrim");
});
