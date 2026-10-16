
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const maxDuration = 35;

export async function POST(req: NextRequest) {
  try {
    // 1. Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini API key missing. Please check your .env.local file.",
        },
        { status: 500 }
      );
    }

    // 2. Read and validate search filters
    const body = await req.json();

    const city = String(body.city ?? "").trim();
    const locality = String(body.locality ?? "").trim();
    const gender = String(body.gender ?? "").trim();

    const maxRent =
      body.maxRent === undefined ||
      body.maxRent === null ||
      body.maxRent === ""
        ? 0
        : Number(body.maxRent);

    if (!city || city.length > 100 || locality.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid city and locality.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(maxRent) ||
      maxRent < 0 ||
      maxRent > 10000000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid maximum rent.",
        },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });

    // 4. Search the web for PG listings
    const prompt = `
Find publicly listed PG, hostel and co-living properties.

City: ${city}
Locality: ${locality || "Any locality in this city"}
Maximum monthly rent: ${
      maxRent > 0 ? `INR ${maxRent}` : "Not specified"
    }
Gender preference: ${gender || "Any"}

Use Google Search to find relevant property listing pages.

Return a concise report. Include the property name, locality,
published monthly rent, listing URL, gender preference and
availability only when supported by the source.

Never invent names, prices, URLs, addresses, reviews or availability.
Mark unavailable information as "Not stated".
Do not claim a room is currently available unless the source says so.
Prefer original listing pages and clearly identify uncertain details.
`;

    console.log("[PG Discovery] Starting Gemini search:", {
      city,
      locality,
    });

    // 5. Call Gemini with a 30-second timeout
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        abortSignal: AbortSignal.timeout(30000),
      },
    });

    console.log("[PG Discovery] Gemini response received");

    // 6. Extract source links from Google Search grounding
    const metadata = response.candidates?.[0]?.groundingMetadata;

    const sourceMap = new Map<
      string,
      { title: string; url: string }
    >();

    for (const chunk of metadata?.groundingChunks ?? []) {
      const webSource = chunk.web;

      if (webSource?.uri) {
        sourceMap.set(webSource.uri, {
          title: webSource.title || "Web source",
          url: webSource.uri,
        });
      }
    }

    const sources = Array.from(sourceMap.values());

    // 7. Return results
    return NextResponse.json({
      success: true,
      city,
      locality,
      filters: {
        maxRent: maxRent || null,
        gender: gender || null,
      },
      summary: response.text || "No search results were returned.",
      sources,
      searchedAt: new Date().toISOString(),
      note:
        "Web-discovered results are not independently verified. " +
        "Confirm rent and availability with the original source.",
    });
  } catch (error) {
    console.error("[PG Discovery] Request failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError");

    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Gemini search timed out after 30 seconds. Please try again."
          : "Unable to search PG listings. Check the API key, model, quota and server logs.",
        details:
          process.env.NODE_ENV === "development"
            ? errorMessage
            : undefined,
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
