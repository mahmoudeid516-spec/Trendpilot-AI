import { NextResponse } from "next/server";
import { openai } from "../../../lib/openai";

export async function POST(req: Request) {
  try {
    console.log("OPENAI KEY:", !!process.env.OPENAI_API_KEY);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Say only: OK"
    });

    return NextResponse.json({
      success: true,
      output: response.output_text,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        message: err.message,
        type: err.type,
        code: err.code,
        status: err.status,
      },
      {
        status: 500,
      }
    );
  }
}