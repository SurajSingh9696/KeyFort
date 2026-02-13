import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";
import bcrypt from "bcryptjs";

// POST change user password
export async function POST(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) });

    if (!user) {
      return apiError.notFound("User");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return apiError.badRequest("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    // Log activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: new ObjectId(session.user.id),
        action: "CHANGE_PASSWORD",
        description: "Master password changed successfully",
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging - don't block password change
    }

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    return handleApiError(error, {
      operation: "change-password",
      userId: session?.user?.id,
    });
  }
}
