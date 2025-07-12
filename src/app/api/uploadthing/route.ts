import { createUploadthing, type FileRouter, createRouteHandler } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .onUploadComplete(async ({ file }) => {
      // Optionally do something with the file info here
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Correct handler for Next.js App Router (UploadThing v6+)
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
