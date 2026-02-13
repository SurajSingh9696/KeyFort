import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";

// GET activity logs for current user
export async function GET(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const activityCollection = await getCollection("activity_logs");

    const logs = await activityCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    return handleApiError(error, {
      operation: "get-activity-logs",
      userId: session?.user?.id,
    });
  }
}
