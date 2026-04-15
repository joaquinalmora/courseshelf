import { NextResponse } from "next/server";

export function buildErrorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ message }, { status });
}

export function parseId(value: string): number | null {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}
