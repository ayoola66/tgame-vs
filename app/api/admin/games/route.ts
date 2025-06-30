import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { GameType } from "@prisma/client";

// Helper function to handle image upload
async function saveImage(formData: FormData): Promise<string | null> {
  const image = formData.get("image") as File;
  if (!image) return null;

  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = uuidv4();
    const extension = image.name.split(".").pop();
    const filename = `${uniqueId}.${extension}`;

    // Save to public/uploads directory
    const path = join(process.cwd(), "public/uploads", filename);
    await writeFile(path, buffer);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const games = await prisma.game.findMany({
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            cardNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(games);
  } catch (error: any) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageUrl = await saveImage(formData);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as GameType;
    const isActive = formData.get("isActive") === "true";
    const isPremium = formData.get("isPremium") === "true";
    const categoriesRaw = formData.get("nestedCategories");
    const categories = categoriesRaw ? JSON.parse(categoriesRaw as string) : [];

    const game = await prisma.game.create({
      data: {
        name,
        description,
        type,
        imageUrl: imageUrl || "",
        isActive,
        isPremium,
        ...(type === "NESTED" && {
          categories: {
            create: categories.map((name: string, index: number) => ({
              name,
              cardNumber: index + 1,
              isActive: true,
            })),
          },
        }),
      },
      include: {
        _count: true,
        questions: true,
        gameScores: true,
        categories: true,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const gameId = formData.get("id") as string;
    const imageUrl = await saveImage(formData);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as GameType;
    const isActive = formData.get("isActive") === "true";
    const isPremium = formData.get("isPremium") === "true";
    const categoriesRaw = formData.get("nestedCategories");
    const categories = categoriesRaw ? JSON.parse(categoriesRaw as string) : [];

    // Delete existing categories
    await prisma.category.deleteMany({
      where: {
        game: {
          id: gameId,
        },
      },
    });

    const game = await prisma.game.update({
      where: { id: gameId },
      data: {
        name,
        description,
        type,
        imageUrl: imageUrl || undefined, // Only update if new image is provided
        isActive,
        isPremium,
        ...(type === "NESTED" && {
          categories: {
            create: categories.map((name: string, index: number) => ({
              name,
              cardNumber: index + 1,
              isActive: true,
            })),
          },
        }),
      },
      include: {
        _count: true,
        questions: true,
        gameScores: true,
        categories: true,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("id");

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Delete categories first
    await prisma.category.deleteMany({
      where: {
        game: {
          id: gameId,
        },
      },
    });

    // Then delete the game
    await prisma.game.delete({
      where: { id: gameId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
