import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const question = await request.json();
    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: {
        text: question.text,
        options: question.options,
        correctOption: question.correctOption,
        cardNumber: question.cardNumber,
        isActive: question.isActive,
      },
      include: {
        game: true,
        category: true,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("[QUESTION_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
