import { z } from "zod";

export type FileServiceUploadResult = {
  url: string;
  fileKey: string;
};

export type PageConfig = {
  limit: number;
  offset: number;
};

export const listFilterDTO = z.object({
  rows: z.string().optional(),
  first: z.string().optional(),
  filters: z.any().optional(),
  collection_id: z.any().optional(),
});

export type ListFilter = z.infer<typeof listFilterDTO>;
