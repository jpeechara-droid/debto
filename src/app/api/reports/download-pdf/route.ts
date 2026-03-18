import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest credit report
    const report = await prisma.creditReport.findFirst({
      where: { userId: session.userId },
      orderBy: { fetchedAt: "desc" },
      select: { pdfBase64: true, fetchedAt: true },
    });

    if (!report?.pdfBase64) {
      return NextResponse.json(
        { error: "No PDF report available" },
        { status: 404 }
      );
    }

    // Convert base64 to buffer and return as PDF
    const pdfBuffer = Buffer.from(report.pdfBase64, "base64");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="debto-credit-report-${new Date(report.fetchedAt).toISOString().split("T")[0]}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("PDF download error:", error);
    return NextResponse.json(
      { error: "Failed to download report" },
      { status: 500 }
    );
  }
}
