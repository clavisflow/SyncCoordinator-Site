import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function createWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function render(worker, path = "/") {
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders every documentation route", async () => {
  const worker = await createWorker();
  const routes = [
    ["/", "SyncCoordinator"],
    ["/overview/", "SyncCoordinatorとは"],
    ["/architecture/", "Architecture"],
    ["/workflow/", "Workflow"],
    ["/getting-started/", "Getting Started"],
    ["/manual/", "SyncCoordinator 操作マニュアル"],
    ["/en/", "SyncCoordinator"],
    ["/en/overview/", "What is SyncCoordinator?"],
    ["/en/architecture/", "Architecture"],
    ["/en/workflow/", "Workflow"],
    ["/en/getting-started/", "Getting Started"],
    ["/en/manual/", "SyncCoordinator User Guide"],
  ];

  for (const [path, heading] of routes) {
    const response = await render(worker, path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
    assert.match(await response.text(), new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), path);
  }
});

test("keeps the finished site free of starter preview artifacts", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /codex-preview|SkeletonPreview|Your site is taking shape/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview|Starter Project/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
