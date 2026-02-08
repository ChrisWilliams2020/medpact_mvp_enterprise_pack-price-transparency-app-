import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import formidable from "formidable";
// @ts-expect-error: no types for csv-parse/sync
import { parse as parseCSV } from "csv-parse/sync";
import * as XLSX from "xlsx";
// @ts-expect-error: no types for mammoth
import mammoth from "mammoth";
import fs from "fs/promises";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseFile(file: formidable.File): Promise<any[]> {
  const ext = file.originalFilename?.split(".").pop()?.toLowerCase();
  const buffer = await fs.readFile(file.filepath);
  if (ext === "csv") {
    const records = parseCSV(buffer.toString(), { columns: true });
    return records.map((r: any) => ({ name: r.name, email: r.email, phone: r.phone }));
  }
  if (ext === "xlsx" || ext === "xls") {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    return data.map((r: any) => ({ name: r.name, email: r.email, phone: r.phone }));
  }
  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return parseManual(result.value);
  }
  if (ext === "txt" || ext === "doc") {
    return parseManual(buffer.toString());
  }
  throw new Error("Unsupported file type");
}

function parseManual(text: string): any[] {
  // Each line: Name, Email, Phone
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [name, email, phone] = line.split(/,|\t|;/).map(s => s.trim());
      return { name, email, phone };
    });
}

export async function POST(req: NextRequest) {
  try {
    let employees: any[] = [];
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = formidable({ multiples: false });
      const data: any = await new Promise((resolve, reject) => {
        form.parse(req as any, (err: any, fields: any, files: any) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });
      const file = data.files.file;
      if (!file) throw new Error("No file uploaded");
      employees = await parseFile(file);
    } else {
      const body = await req.json();
      if (body.manual) {
        employees = parseManual(body.manual);
      } else if (body.employees) {
        employees = body.employees;
      }
    }
    if (!employees.length) throw new Error("No employees found");
    const created = await Promise.all(
      employees.map((emp: any) =>
        prisma.employee.upsert({
          where: { email: emp.email },
          update: { name: emp.name, phone: emp.phone },
          create: { name: emp.name, email: emp.email, phone: emp.phone },
        })
      )
    );
    return NextResponse.json({ success: true, count: created.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) });
  }
}
