/* scripts/build-win.js
   Factory Brain v2 - Windows build
   - Local: build normally
   - CI (GitHub Actions): force publish = never (avoid GH_TOKEN requirement)
*/

const path = require("path");

async function main() {
  let builder;
  let Platform;

  try {
    ({ build: builder, Platform } = require("electron-builder"));
  } catch (e) {
    console.error("electron-builder is not installed. Run npm install first.");
    process.exit(1);
  }

  const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;

  const config = {
    // Keep your existing config file if you already have electron-builder.json
    // This override only ensures publish behavior is safe on CI.
    directories: {
      output: "dist",
    },

    win: {
      target: [
        { target: "nsis", arch: ["x64"] },
        { target: "zip", arch: ["x64"] },
      ],
    },
  };

  const options = {
    targets: Platform.WINDOWS.createTarget(),
    // 🔒 Critical: prevent publish in CI
    publish: isCI ? "never" : undefined,
    config,
  };

  console.log(`[build-win] CI=${isCI} publish=${isCI ? "never" : "default"}`);
  await builder(options);
  console.log("[build-win] done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
