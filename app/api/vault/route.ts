import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId, serializeDoc, serializeDocs } from "@/lib/mongodb";
import { handleApiError, apiError } from "@/lib/error-handler";
import { z } from "zod";

const vaultItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().optional().nullable(),
  encryptedPassword: z.string().min(1, "Password is required"),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  categoryId: z.union([z.string(), z.null(), z.undefined(), z.literal("")]).optional().nullable(),
  isFavorite: z.boolean().optional(),
});

// GET all vault items for current user
export async function GET(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isFavorite = searchParams.get("isFavorite");

    const filter: any = { userId: new ObjectId(session.user.id) };

    if (categoryId) {
      filter.categoryId = new ObjectId(categoryId);
    }

    if (isFavorite === "true") {
      filter.isFavorite = true;
    }

    const vaultItemsCollection = await getCollection("vault_items");
    const categoriesCollection = await getCollection("categories");
    
    const vaultItems = await vaultItemsCollection
      .find(filter)
      .sort({ updatedAt: -1 })
      .toArray();

    // Populate categories
    const enrichedItems = await Promise.all(
      vaultItems.map(async (item) => {
        let enrichedItem = serializeDoc(item);
        
        if (item.categoryId) {
          const category = await categoriesCollection.findOne({ _id: item.categoryId });
          enrichedItem.category = category;
        } else {
          enrichedItem.category = null;
        }
        
        return enrichedItem;
      })
    );

    return NextResponse.json(enrichedItems);
  } catch (error) {
    return handleApiError(error, {
      operation: "get-vault-items",
      userId: session?.user?.id,
    });
  }
}

// POST create new vault item
export async function POST(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const body = await req.json();
    const data = vaultItemSchema.parse(body);

    const vaultItemsCollection = await getCollection("vault_items");
    const categoriesCollection = await getCollection("categories");

    // Validate and convert categoryId if provided
    let categoryObjectId = null;
    if (data.categoryId && data.categoryId !== "") {
      if (!ObjectId.isValid(data.categoryId)) {
        return apiError.badRequest("Invalid category ID format");
      }
      categoryObjectId = new ObjectId(data.categoryId);
    }

    const newItem = {
      ...data,
      userId: new ObjectId(session.user.id),
      categoryId: categoryObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await vaultItemsCollection.insertOne(newItem);
    
    // Get category if exists
    const category = newItem.categoryId
      ? await categoriesCollection.findOne({ _id: newItem.categoryId })
      : null;

    const vaultItem = serializeDoc({ ...newItem, _id: result.insertedId });
    vaultItem.category = category;

    // Log activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: new ObjectId(session.user.id),
        action: "CREATE_ITEM",
        description: `Created password for ${data.title}`,
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging
    }

    return NextResponse.json(vaultItem, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      operation: "create-vault-item",
      userId: session?.user?.id,
    });
  }
}
