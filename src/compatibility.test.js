import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getUrl, getUrlWs } from "./helper/getUrl";
import { miladi_be_shamsi } from "./helper/shamsi";
import { shamsi_be_miladi } from "./helper/miladi";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("Vite migration compatibility", () => {
  it("keeps Persian document metadata and public icons", () => {
    const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
    expect(html).toContain('<html lang="fa" dir="rtl">');
    expect(html).toContain('href="/logo.png"');
    expect(html).toContain('href="/manifest.json"');
    expect(fs.existsSync(path.join(root, "public/logo.png"))).toBe(true);
    expect(fs.existsSync(path.join(root, "public/manifest.json"))).toBe(true);
  });

  it("retains exact public and misspelled dashboard route patterns", () => {
    const app = fs.readFileSync(path.join(root, "src/App.js"), "utf8");
    const paths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
    ["/login", "/signup", "/confirm-phone", "/send-otp", "/check-otp", "/FAQ",
      "/panel/my-coures", "/panel/new-coures", "/panel/coures", "/panel/course/quizes/:id",
      "/panel/live", "/panel/payments", "/panel/quiz/start/:id"]
      .forEach((route) => expect(paths).toContain(route));
  });

  it("preserves the configured API client origin", async () => {
    await import("./api/axios");
    const axios = (await import("axios")).default;
    expect(axios.defaults.baseURL).toBe("https://api.srvschool.ir/");
  });

  it("preserves legacy browser and websocket origins", () => {
    expect(getUrl()).toBe("https://daarolquran.com/");
    expect(getUrlWs()).toBe("wss://127.0.0.1:5000/");
    window.history.replaceState({}, "", "/");
    Object.defineProperty(window, "location", { value: new URL("https://school.example/") });
    expect(getUrl()).toBe("https://school.example/");
    expect(getUrlWs()).toBe("wss://school.example/");
  });

  it("preserves representative Jalali conversions", () => {
    expect(shamsi_be_miladi(1403, 1, 1)).toBe("2024-3-20");
    expect(miladi_be_shamsi("2024-03-20")).toBe("1403/1/1");
  });
});
