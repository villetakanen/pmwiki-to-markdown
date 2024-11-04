import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			formats: ["cjs"],
			fileName: "index",
		},
		rollupOptions: {
			external: ["commander", "fs"],
			output: {
				banner: "#!/usr/bin/env node",
			},
		},
	},
});
