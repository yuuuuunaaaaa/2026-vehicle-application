/**
 * Google Sheets 초기 헤더 설정 스크립트
 * 실행: npx tsx scripts/setup-sheets.ts
 *
 * 사전 준비:
 * 1. .env.local에 GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_JSON 입력
 * 2. Google Sheets에서 Service Account 이메일에 편집자 권한 부여
 * 3. 'members' 시트, 'applications' 시트 수동 생성 필요
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

async function main() {
  // members 시트에 샘플 데이터 추가 (필요시 수정)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "members!A1:B1",
    valueInputOption: "RAW",
    requestBody: {
      values: [["zone", "name"]],
    },
  });

  // applications 시트 헤더
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: "applications!A1:D1",
    valueInputOption: "RAW",
    requestBody: {
      values: [["zone", "name", "date", "updated_at"]],
    },
  });

  console.log("시트 헤더 설정 완료");
}

main().catch(console.error);
