// jsdom: ^26.0.0
// @sinonjs/fake-timers: ^14.0.0
const { JSDOM } = require("jsdom");
const FakeTimers = require("@sinonjs/fake-timers");

(async function () {
  const dom = await JSDOM.fromFile("index.html", {
    resources: "usable",
    runScripts: "dangerously",
  });
  const window = dom.window;
  const { document } = window;
  const clock = FakeTimers.withGlobal(dom.window).install(); // Use fake timer to control the time. (The actual timer doesn't work after using this fake timer)
  await new Promise((resolve) => setTimeout(resolve, 100)); // Add delay to wait for the document to load
  const button = document.getElementById("button");
  const out = document.getElementById("out");
  console.log(out.textContent);
  clock.tick(20000);
  button.click();
  console.log(document.querySelector("div").textContent);
  window.close(); // Close the window to terminate the app
})();
