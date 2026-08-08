import { NextResponse } from "next/server";
import { findAssetByFilename } from "@/lib/releases";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/download/[channel]/[asset]">,
) {
  const { channel, asset } = await params;

  if (channel !== "release" && channel !== "dev") {
    return new NextResponse("Not found", { status: 404 });
  }

  const found = findAssetByFilename(channel, asset);
  if (!found) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(found.url, 307);
}
