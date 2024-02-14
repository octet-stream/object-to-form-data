/* eslint-disable import/no-extraneous-dependencies */

import {defineConfig} from "tsup"

export default defineConfig({
  entry: {
    "object-to-form-data": "src/index.ts"
  },
  outDir: "lib",
  format: ["esm", "cjs"],
  dts: true,
  splitting: false
})
