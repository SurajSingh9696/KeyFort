import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";

// DELETE user account and all related data
export async function DELETE(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const userId = new ObjectId(session.user.id);

    // Delete all user's vault items
    const vaultCollection = await getCollection("vault_items");
    await vaultCollection.deleteMany({ userId });

    // Delete all user's categories
    const categoriesCollection = await getCollection("categories");
    await categoriesCollection.deleteMany({ userId });

    // Delete all user's activity logs
    const activityCollection = await getCollection("activity_logs");
    await activityCollection.deleteMany({ userId });

    // Delete all user's accounts/sessions
    const accountsCollection = await getCollection("accounts");
    await accountsCollection.deleteMany({ userId });

    const sessionsCollection = await getCollection("sessions");
    await sessionsCollection.deleteMany({ userId });

    // Delete user
    const usersCollection = await getCollection("users");
    const result = await usersCollection.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return apiError.notFound("User");
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    return handleApiError(error, {
      operation: "delete-account",
      userId: session?.user?.id,
    });
  }
}
