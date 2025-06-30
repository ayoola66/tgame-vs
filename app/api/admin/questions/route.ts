import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET /api/admin/questions - List questions
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const gameId = searchParams.get("gameId");
    const categoryId = searchParams.get("categoryId");

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: Prisma.QuestionWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { text: { contains: search, mode: "insensitive" } },
                { options: { has: search } },
              ],
            }
          : {},
        gameId ? { gameId } : {},
        categoryId ? { categoryId } : {},
      ],
    };

    // Get total count for pagination
    const total = await prisma.question.count({ where });

    // Get questions with pagination
    const questions = await prisma.question.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        game: true,
        category: true,
      },
    });

    return NextResponse.json({
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[QUESTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionData = await req.json();
    const {
      gameId,
      categoryId,
      text,
      options,
      correctOption,
      cardNumber,
      isActive,
    } = questionData;

    // Validate required fields
    if (
      !gameId ||
      !text ||
      !options ||
      correctOption === undefined ||
      !cardNumber
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate options array
    if (
      !Array.isArray(options) ||
      options.length !== 4 ||
      options.some((opt) => !opt)
    ) {
      return NextResponse.json(
        { error: "Options must be an array of 4 non-empty strings" },
        { status: 400 }
      );
    }

    // Validate correctOption
    if (correctOption < 0 || correctOption >= options.length) {
      return NextResponse.json(
        { error: "Invalid correct option index" },
        { status: 400 }
      );
    }

    // Validate cardNumber
    if (cardNumber < 1 || cardNumber > 5) {
      return NextResponse.json(
        { error: "Card number must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get the game to verify it exists and check its type
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // For nested games, validate category
    if (game.type === "NESTED") {
      if (!categoryId) {
        return NextResponse.json(
          { error: "Category is required for nested games" },
          { status: 400 }
        );
      }

      // First check if the category exists
      const categoryExists = await prisma.category.findFirst({
        where: { id: categoryId },
        select: { id: true, cardNumber: true },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      // Then verify it belongs to the game
      const categoryBelongsToGame = await prisma.category.findFirst({
        where: {
          id: categoryId,
          gameId: gameId,
        },
      });

      if (!categoryBelongsToGame) {
        return NextResponse.json(
          { error: "Category does not belong to this game" },
          { status: 400 }
        );
      }

      if (categoryExists.cardNumber !== cardNumber) {
        return NextResponse.json(
          { error: "Card number must match category's card number" },
          { status: 400 }
        );
      }
    }

    // Create the question
    const question = await prisma.question.create({
      data: {
        text,
        options: options as string[],
        correctOption,
        cardNumber,
        isActive: isActive ?? true,
        game: {
          connect: { id: gameId },
        },
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionData = await req.json();
    const { id, options, ...data } = questionData;

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...data,
        ...(options && { options: options as string[] }),
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/questions/[id] - Delete a question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Question deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
