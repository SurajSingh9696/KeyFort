import { NextResponse } from "next/server";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const usersCollection = await getCollection("users");
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return apiError.conflict("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Assign a random default avatar
    const defaultAvatars = [
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
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    // Create user
    const userResult = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      image: randomAvatar,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userId = userResult.insertedId;

    // Create default settings
    try {
      const settingsCollection = await getCollection("user_settings");
      await settingsCollection.insertOne({
        userId: userId,
        theme: "system",
        autoLockMinutes: 15,
        defaultView: "grid",
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      // Silently fail - don't block user creation
    }

    // Create default categories
    try {
      const categoriesCollection = await getCollection("categories");
      const defaultCategories = [
        { name: "Social Media", color: "#3b82f6" },
        { name: "Banking", color: "#10b981" },
        { name: "Work", color: "#f59e0b" },
        { name: "Personal", color: "#8b5cf6" },
      ];

      await categoriesCollection.insertMany(
        defaultCategories.map((cat) => ({
          userId: userId,
          name: cat.name,
          color: cat.color,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    } catch (error) {
      // Silently fail - don't block user creation
    }

    // Log registration activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: userId,
        action: "REGISTER",
        description: "User account created",
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: userId.toString(), email, name },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, {
      operation: "user-registration",
    });
  }
}
