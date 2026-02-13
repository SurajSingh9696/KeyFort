import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";

// PUT update user avatar
export async function PUT(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const body = await req.json();
    const { avatar } = body;

    if (!avatar) {
      return apiError.badRequest("Avatar is required");
    }

    // Validate avatar path (should be one of the predefined avatars)
    const validAvatars = [
      "/avatars/avatar-1.svg",
      "/avatars/avatar-2.svg",
      "/avatars/avatar-3.svg",
      "/avatars/avatar-4.svg",
      "/avatars/avatar-5.svg",
      "/avatars/avatar-6.svg",
      "/avatars/avatar-7.svg",
      "/avatars/avatar-8.svg",
      "/avatars/avatar-9.svg",
    ];

    if (!validAvatars.includes(avatar)) {
      return apiError.badRequest("Invalid avatar selection");
    }

    const usersCollection = await getCollection("users");

    // Update user's avatar/image
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { image: avatar, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return apiError.notFound("User");
    }

    // Log activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: new ObjectId(session.user.id),
        action: "UPDATE_AVATAR",
        description: "Profile avatar updated",
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging
    }

    return NextResponse.json({ message: "Avatar updated successfully", avatar });
  } catch (error) {
    return handleApiError(error, {
      operation: "update-avatar",
      userId: session?.user?.id,
    });
  }
}
