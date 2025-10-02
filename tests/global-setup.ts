import { FullConfig, webkit } from "@playwright/test";
import { authenticateUser } from "./auth-setup";

async function globalSetup(config: FullConfig) {
  const browser = await webkit.launch();
  const page = await browser.newPage();

  try {
    await authenticateUser(page);

    await page.context().storageState({ path: "tests/auth-state.json" });

    console.log("Global authentication setup completed");
  } catch (error) {
    console.error("Global authentication setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
