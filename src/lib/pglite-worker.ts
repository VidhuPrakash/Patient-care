import { PGlite } from "@electric-sql/pglite";
import { worker } from "@electric-sql/pglite/worker";

worker({
/**
 * Initializes the PGlite database instance with the specified data directory.
 *
 * @returns A promise that resolves to a new PGlite instance configured to use
 *          IndexedDB with the specified data directory.
 */

  async init() {
    return new PGlite({ dataDir: "idb://patient-registration-app" });
  },
});
