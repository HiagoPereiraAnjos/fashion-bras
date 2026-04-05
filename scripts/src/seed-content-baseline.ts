import { seedBaselineContent } from "../../artifacts/api-server/src/repositories/content/contentRepository";

const force = process.argv.includes("--force");

async function run() {
  const snapshot = await seedBaselineContent({ force });

  console.log(
    `[seed] content baseline persisted: stores=${snapshot.stores.length}, blogPosts=${snapshot.blogPosts.length}, partners=${snapshot.partners.length}`,
  );
}

run().catch((error) => {
  console.error("[seed] failed to persist content baseline", error);
  process.exit(1);
});
