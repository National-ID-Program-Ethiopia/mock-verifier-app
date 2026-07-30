import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadPartnerApiKey(root: string): string | undefined {
  const fromEnv = process.env.PARTNER_VERIFY_API_KEY;
  if (fromEnv) return fromEnv.trim();

  const file = resolve(root, ".env.partner.local");
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, "utf8")
    .split("\n")
    .find((l) => l.startsWith("PARTNER_VERIFY_API_KEY="));
  if (!line) return undefined;
  return line.slice("PARTNER_VERIFY_API_KEY=".length).trim();
}

export default defineConfig(({ mode }) => {
  const root = resolve(__dirname);
  loadEnv(mode, root, "");
  const partnerApiKey = loadPartnerApiKey(root);

  return {
    plugins: [react()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: 5180,
      strictPort: true,
      proxy: {
        "/v2/verify": {
          target: "https://verify.pass.fayda.et",
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: "",
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (partnerApiKey) {
                proxyReq.setHeader(
                  "Authorization",
                  `Bearer ${partnerApiKey}`
                );
              }
            });
          },
        },
      },
    },
  };
});
