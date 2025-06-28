// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import * as path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: "src",
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@/assets/*": "@/assets/*",
//       "components/*": "components/*",
//       "@ui/*": "components/common/ui/*",
//       "@pages/*": "pages/*",
//       "@api/*": "api/*",
//       "@utils/*": "utils/*",
//       "redux/utils/*": "redux/utils/*",
//       "redux/slices/*": "redux/slices/*",
//     },
//   },
//   test: {
//     globals: true,
//     environment: "jsdom",
//     setupFiles: "./src/setupTests.ts",
//     css: true,
//     reporters: ["verbose"],
//     coverage: {
//       reporter: ["text", "json", "html"],
//       include: ["src/**/*"],
//       exclude: [],
//     },
//   },
// });

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_BASE_URL": JSON.stringify(env.REACT_APP_BASE_URL),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@ui": path.resolve(__dirname, "./src/components/common/ui/*"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@redux/utils": path.resolve(__dirname, "./src/redux/utils"),
        "@redux/slices": path.resolve(__dirname, "./src/redux/slices"),
      },
    },
    plugins: [react()],
  };
});
