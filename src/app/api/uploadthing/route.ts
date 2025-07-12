import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

// Correct handler for Next.js App Router (UploadThing v6+)
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
