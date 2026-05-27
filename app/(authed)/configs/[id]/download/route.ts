import { NextResponse } from "next/server";

import { getSavedConfig } from "@/lib/api/account";
import { getApiErrorMessage } from "@/lib/api/client";

function safeFilename(name: string) {
  const cleaned = name.replace(/[^\w .-]/g, "_").replace(/^\.+/, "");
  return cleaned || "config.cfg";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const config = await getSavedConfig(id);

    return new NextResponse(config.payload, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${safeFilename(config.name)}"`,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: getApiErrorMessage(error, "Saved config could not be downloaded."),
      },
      { status: 502 },
    );
  }
}
