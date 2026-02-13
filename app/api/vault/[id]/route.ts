import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCollection, ObjectId, serializeDoc } from "@/lib/mongodb";
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

// GET single vault item
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    const { id } = await params;
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const vaultItemsCollection = await getCollection("vault_items");
    const categoriesCollection = await getCollection("categories");

    const vaultItem = await vaultItemsCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

    if (!vaultItem) {
      return apiError.notFound("Vault item");
    }

    // Get category if exists
    const category = vaultItem.categoryId
      ? await categoriesCollection.findOne({ _id: vaultItem.categoryId })
      : null;

    const enrichedItem = serializeDoc(vaultItem);
    enrichedItem.category = category;

    // Log activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: new ObjectId(session.user.id),
        action: "ACCESS_ITEM",
        description: `Accessed password for ${vaultItem.title}`,
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging
    }

    return NextResponse.json(enrichedItem);
  } catch (error) {
    const { id } = await params;
    return handleApiError(error, {
      operation: "get-vault-item",
      userId: session?.user?.id,
      resource: id,
    });
  }
}

// PUT update vault item
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    const { id } = await params;
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = vaultItemSchema.parse(body);

    const vaultItemsCollection = await getCollection("vault_items");
    const categoriesCollection = await getCollection("categories");

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Validate and convert categoryId if provided
    if (data.categoryId && data.categoryId !== "") {
      if (!ObjectId.isValid(data.categoryId)) {
        return apiError.badRequest("Invalid category ID format");
      }
      updateData.categoryId = new ObjectId(data.categoryId);
    } else {
      updateData.categoryId = null;
    }

    const result = await vaultItemsCollection.updateOne(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(session.user.id),
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return apiError.notFound("Vault item");
    }

    const updated = await vaultItemsCollection.findOne({ _id: new ObjectId(id) });
    const category = updated?.categoryId
      ? await categoriesCollection.findOne({ _id: updated.categoryId })
      : null;

    // Log activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: new ObjectId(session.user.id),
        action: "UPDATE_ITEM",
        description: `Updated password for ${data.title}`,
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging
    }

    const updatedItem = serializeDoc(updated);
    updatedItem.category = category;
    return NextResponse.json(updatedItem);
  } catch (error) {
    const { id } = await params;
    return handleApiError(error, {
      operation: "update-vault-item",
      userId: session?.user?.id,
      resource: id,
    });
  }
}

// DELETE vault item
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    const { id } = await params;
    
    // Validate id parameter
    if (!id || id === "undefined" || id === "null") {
      return apiError.badRequest("Invalid item ID");
    }
    
    if (!ObjectId.isValid(id)) {
      return apiError.badRequest("Invalid item ID format");
    }
    
    session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiError.unauthorized();
    }

    const vaultItemsCollection = await getCollection("vault_items");

    const vaultItem = await vaultItemsCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

    if (!vaultItem) {
      return apiError.notFound("Vault item");
    }

    await vaultItemsCollection.deleteOne({ _id: new ObjectId(id) });

    // Log activity
    try {
      const activityCollection = await getCollection("activity_logs");
      await activityCollection.insertOne({
        userId: new ObjectId(session.user.id),
        action: "DELETE_ITEM",
        description: `Deleted password for ${vaultItem.title}`,
        createdAt: new Date(),
      });
    } catch (error) {
      // Silently fail activity logging
    }

    return NextResponse.json({ message: "Vault item deleted successfully" });
  } catch (error) {
    const { id } = await params;
    return handleApiError(error, {
      operation: "delete-vault-item",
      userId: session?.user?.id,
      resource: id,
    });
  }
}
