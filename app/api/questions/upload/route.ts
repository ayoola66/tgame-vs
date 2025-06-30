import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { GameType } from "@prisma/client";

interface QuestionRecord {
  Text: string;
  Option1: string;
  Option2: string;
  Option3: string;
  Option4: string;
  CorrectOption: string;
  CardNumber?: string; // Optional for NESTED games
}

// Helper function to parse correct option
const parseCorrectOption = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }

  // Handle "Option1" to "Option4" format
  if (typeof value === "string" && value.startsWith("Option")) {
    const num = parseInt(value.replace("Option", ""));
    if (!isNaN(num) && num >= 1 && num <= 4) {
      return num;
    }
  }

  // Try parsing as number
  const num = parseInt(value as string);
  if (!isNaN(num)) {
    return num;
  }

  throw new Error(
    "Correct option must be a number between 1-4 or 'Option1' to 'Option4'"
  );
};

// Validate question data
const validateQuestion = (
  text: string,
  options: string[],
  correctOption: string | number
) => {
  if (!text || text.trim().length === 0) {
    throw new Error("Question text is required");
  }
  if (!options || options.length !== 4) {
    throw new Error("Four options are required");
  }

  const parsedOption = parseCorrectOption(correctOption);
  if (parsedOption < 1 || parsedOption > 4) {
    throw new Error(
      "Correct option must be between 1 and 4 (indicating Option1, Option2, Option3, or Option4)"
    );
  }
};

// Process CSV file for STRAIGHT games
const processCsvFile = async (
  fileContent: string,
  gameId: string
): Promise<any[]> => {
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as QuestionRecord[];

  const questions = [];
  for (const record of records) {
    const text = record.Text?.trim();
    const options = [
      record.Option1?.trim(),
      record.Option2?.trim(),
      record.Option3?.trim(),
      record.Option4?.trim(),
    ];
    const correctOption = record.CorrectOption;
    const cardNumber = parseInt(record.CardNumber || "1");

    validateQuestion(text, options, correctOption);

    if (cardNumber < 1 || cardNumber > 5) {
      throw new Error("Card number must be between 1 and 5");
    }

    questions.push({
      text,
      options,
      correctOption: parseCorrectOption(correctOption) - 1, // Convert from 1-based to 0-based
      cardNumber,
      gameId,
    });
  }

  return questions;
};

// Process XLSX file for NESTED games
const processXlsxFile = async (
  buffer: Buffer,
  gameId: string,
  categories: any[]
): Promise<any[]> => {
  const workbook = XLSX.read(buffer);
  const questions = [];

  // Process each sheet (category)
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const sheetName = `${i + 1}`;
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(
        `Sheet "${sheetName}" not found. Please ensure your Excel file has sheets named "1", "2", "3", "4", and "5"`
      );
    }

    const records = XLSX.utils.sheet_to_json(sheet) as QuestionRecord[];

    for (const record of records) {
      const text = record.Text?.trim();
      const options = [
        record.Option1?.trim(),
        record.Option2?.trim(),
        record.Option3?.trim(),
        record.Option4?.trim(),
      ];
      const correctOption = record.CorrectOption;

      validateQuestion(text, options, correctOption);

      questions.push({
        text,
        options,
        correctOption: parseCorrectOption(correctOption) - 1, // Convert from 1-based to 0-based
        cardNumber: category.cardNumber,
        gameId,
        categoryId: category.id,
      });
    }
  }

  return questions;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const gameId = formData.get("gameId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Get game type
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        categories: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const fileContent = await file.text();
    let questions;

    if (game.type === GameType.STRAIGHT) {
      if (!file.name.endsWith(".csv")) {
        return NextResponse.json(
          { error: "STRAIGHT games require CSV file" },
          { status: 400 }
        );
      }
      questions = await processCsvFile(fileContent, gameId);
    } else {
      if (!file.name.endsWith(".xlsx")) {
        return NextResponse.json(
          { error: "NESTED games require XLSX file" },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      questions = await processXlsxFile(buffer, gameId, game.categories);
    }

    // Create questions in database
    await prisma.question.createMany({
      data: questions,
    });

    return NextResponse.json({
      message: "Questions uploaded successfully",
      count: questions.length,
    });
  } catch (error: any) {
    console.error("Error uploading questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload questions" },
      { status: 500 }
    );
  }
}
