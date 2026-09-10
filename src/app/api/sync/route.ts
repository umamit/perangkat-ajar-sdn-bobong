import { handleSyncGet } from "./syncGet";
import { handleSyncPost } from "./syncPost";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleSyncGet(request);
}

export async function POST(request: Request) {
  return handleSyncPost(request);
}
