"use server";
import { revalidatePath } from "next/cache";

export const revalidateStorePath = (path: string) => {
  revalidatePath(`/store/[storeId]${path}`);
};
