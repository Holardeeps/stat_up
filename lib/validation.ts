import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, { message: "Too short: expected title to have at least 3 characters." }).max(100),
  description: z.string().min(20, { message: "Too small: expected string to have at least 20 characters." }).max(500),
  category: z.string().min(3, { message: "Too short: expected string to have at least 3 characters." }).max(20),
  link: z
    .string()
    .url({ message: "Invalid URL"})
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    },
  {
    message: ": URL must point to a valid image..."
  }),
  pitch: z.string().min(10),
});