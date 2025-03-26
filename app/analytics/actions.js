// app/analytics/actions.js
"use server";

import { revalidatePath } from "next/cache";

export async function refreshAnalytics() {
  revalidatePath("/analytics");
}