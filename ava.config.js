export default {
  failFast: true,
  workerThreads: false, // Disable to make tsx work
  files: ["src/**/*.test.ts"],
  extensions: {
    ts: "module"
  }
}
