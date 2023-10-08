import { z } from "zod";

export type FileServiceUploadResult = {
  url: string;
  fileKey: string;
};

export type PageConfig = {
  limit: number;
  offset: number;
};
