import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Invalid color format"),
});

// GET all categories for current user
export async function GET(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const categoriesCollection = await getCollection("categories");
    const vaultItemsCollection = await getCollection("vault_items");

    const categories = await categoriesCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ name: 1 })
      .toArray();

    // Add count of vault items for each category
    const enrichedCategories = await Promise.all(
      categories.map(async (category) => {
        const count = await vaultItemsCollection.countDocuments({
          categoryId: category._id,
        });
        return { ...category, _count: { vaultItems: count } };
      })
    );

    return NextResponse.json(enrichedCategories);
  } catch (error) {
    return handleApiError(error, {
      operation: "get-categories",
      userId: session?.user?.id,
    });
  }
}

// POST create new category
export async function POST(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const body = await req.json();
    const data = categorySchema.parse(body);

    const categoriesCollection = await getCollection("categories");

    const newCategory = {
      ...data,
      userId: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await categoriesCollection.insertOne(newCategory);
    const category = { ...newCategory, _id: result.insertedId };

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      operation: "create-category",
      userId: session?.user?.id,
    });
  }
}
