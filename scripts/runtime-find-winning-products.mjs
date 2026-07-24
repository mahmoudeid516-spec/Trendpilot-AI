import { chromium } from "playwright";

function now() {
  return new Date().toISOString();
}

async function run() {
  const baseUrl = process.env.E2E_BASE_URL || "http://localhost:3000";
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--disable-gpu"],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  let supabaseWriteRequest = null;
  let productSearchResponse = null;

  page.on("console", (msg) => {
    const text = msg.text();
    logs.push(`[console:${msg.type()}] ${text}`);
  });

  page.on("pageerror", (err) => {
    logs.push(`[pageerror] ${String(err)}`);
  });

  page.on("crash", () => {
    logs.push("[pagecrash] Page crashed");
  });

  page.on("request", (req) => {
    const url = req.url();
    if (
      url.includes("/rest/v1/products") &&
      (req.method() === "POST" || req.method() === "PATCH" || req.method() === "PUT")
    ) {
      supabaseWriteRequest = {
        time: now(),
        method: req.method(),
        url,
        postData: req.postData(),
        headers: req.headers(),
      };
    }
  });

  page.on("response", async (res) => {
    const url = res.url();
    if (url.includes("/api/product-search") && res.request().method() === "POST") {
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }
      productSearchResponse = {
        status: res.status(),
        url,
        body,
      };
    }
  });

  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });

  const currentUrl = page.url();

  const ensureDashboard = async () => {
    if (page.url().includes("/dashboard")) {
      return;
    }

    // Try to create a user session via register/login flow if redirected.
    const email = `e2e_${Date.now()}@example.com`;
    const password = "Trendpilot!123";

    await page.goto(`${baseUrl}/register`, { waitUntil: "domcontentloaded" });

    if ((await page.locator('input[placeholder="Full Name"]').count()) > 0) {
      await page.fill('input[placeholder="Full Name"]', "E2E User");
      await page.fill('input[placeholder="Email"]', email);
      await page.fill('input[placeholder="Password"]', password);
      await page.click('button:has-text("Register")');
      await page.waitForTimeout(1500);
    }

    await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });

    if ((await page.locator('input[placeholder="Email"]').count()) > 0) {
      await page.fill('input[placeholder="Email"]', email);
      await page.fill('input[placeholder="Password"]', password);
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(2000);
    }

    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "domcontentloaded" });
  };

  await ensureDashboard();

  const onDashboard = page.url().includes("/dashboard");
  const searchInput = page.locator('input[placeholder="Search products..."]');
  const findButton = page.locator('button:has-text("Find Winning Products")');

  let clicked = false;

  if (onDashboard && (await searchInput.count()) > 0 && (await findButton.count()) > 0) {
    await searchInput.fill("wireless earbuds");
    await Promise.allSettled([
      page.waitForResponse(
        (res) => res.url().includes("/api/product-search") && res.request().method() === "POST",
        { timeout: 20000 }
      ),
      findButton.click(),
    ]);
    clicked = true;

    // Give time for products render and Supabase write calls to complete.
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
  }

  const rowCount = await page.locator("table tbody tr").count();
  const noResultsVisible = await page.locator('text=No products found yet').count();

  const output = {
    startedAt: now(),
    baseUrl,
    firstUrl: currentUrl,
    finalUrl: page.url(),
    onDashboard,
    clickedFindWinningProducts: clicked,
    productSearchResponse,
    productsTableRowCount: rowCount,
    noResultsVisible,
    supabaseWriteRequest,
    logTail: logs.slice(-50),
  };

  console.log(JSON.stringify(output, null, 2));

  await browser.close();
}

run().catch((error) => {
  console.error("RUNTIME_E2E_FAILED", error);
  process.exit(1);
});
