import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";

// GET user settings
export async function GET(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const settingsCollection = await getCollection("user_settings");

    let settings = await settingsCollection.findOne({
      userId: new ObjectId(session.user.id),
    });

    // Create default settings if not exists
    if (!settings) {
      const defaultSettings = {
        userId: new ObjectId(session.user.id),
        theme: "system",
        autoLockMinutes: 15,
        defaultView: "grid",
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await settingsCollection.insertOne(defaultSettings);
      settings = { ...defaultSettings, _id: result.insertedId };
    }

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error, {
      operation: "get-settings",
      userId: session?.user?.id,
    });
  }
}

// PUT update user settings
export async function PUT(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const body = await req.json();

    const settingsCollection = await getCollection("user_settings");

    const result = await settingsCollection.updateOne(
      { userId: new ObjectId(session.user.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    const settings = await settingsCollection.findOne({
      userId: new ObjectId(session.user.id),
    });

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error, {
      operation: "update-settings",
      userId: session?.user?.id,
    });
  }
}
