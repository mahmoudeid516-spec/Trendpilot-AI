import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeProductInsertRow } from "./productPayload";

type Row = Record<string, unknown>;

function sanitizeRowForTable(table: string, row: Row): Row {
  if (table === "products") {
    return sanitizeProductInsertRow(row);
  }

  return { ...row };
}

function extractMissingColumn(error: { message?: string; details?: string; hint?: string }): string | null {
  const combined = [error.message, error.details, error.hint]
    .filter(Boolean)
    .join(" ");

  const patterns = [
    /column\s+['"]?([a-zA-Z0-9_]+)['"]?\s+does not exist/i,
    /Could not find the ['"]([a-zA-Z0-9_]+)['"] column/i,
  ];

  for (const pattern of patterns) {
    const match = combined.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function schemaMismatchError(params: {
  operation: "insert" | "upsert";
  table: string;
  missingColumn: string;
  row: Row;
  sourceError: unknown;
}): Error {
  const { operation, table, missingColumn, row, sourceError } = params;
  const availableKeys = Object.keys(row).sort().join(", ");
  const sourceMessage = sourceError instanceof Error
    ? sourceError.message
    : String(sourceError);

  return new Error(
    `Schema mismatch detected during ${operation} on ${table}: missing column ${missingColumn}. ` +
      `Payload keys: [${availableKeys}]. Source error: ${sourceMessage}`
  );
}

function removeUnsupportedColumn(row: Row, column: string): Row {
  const nextRow = { ...row };
  delete nextRow[column];
  return nextRow;
}

export async function upsertWithCompatibility(
  client: SupabaseClient,
  table: string,
  row: Row,
  onConflict = "id"
): Promise<{ error: unknown | null; usedRow: Row }> {
  let currentRow = sanitizeRowForTable(table, row);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { error } = await client
      .from(table)
      .upsert(currentRow, { onConflict });

    if (!error) {
      return { error: null, usedRow: currentRow };
    }

    const missingColumn = extractMissingColumn(error);

    if (missingColumn && Object.prototype.hasOwnProperty.call(currentRow, missingColumn)) {
      currentRow = removeUnsupportedColumn(currentRow, missingColumn);
      continue;
    }

    return { error, usedRow: currentRow };
  }

  return {
    error: schemaMismatchError({
      operation: "upsert",
      table,
      missingColumn: "<retry-limit-reached>",
      row: currentRow,
      sourceError: "Exceeded compatibility retries while removing unsupported columns.",
    }),
    usedRow: currentRow,
  };
}

export async function insertWithCompatibility(
  client: SupabaseClient,
  table: string,
  row: Row
): Promise<{ error: unknown | null; usedRow: Row }> {
  let currentRow = sanitizeRowForTable(table, row);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { error } = await client
      .from(table)
      .insert(currentRow);

    if (!error) {
      return { error: null, usedRow: currentRow };
    }

    const missingColumn = extractMissingColumn(error);

    if (missingColumn && Object.prototype.hasOwnProperty.call(currentRow, missingColumn)) {
      currentRow = removeUnsupportedColumn(currentRow, missingColumn);
      continue;
    }

    return { error, usedRow: currentRow };
  }

  return {
    error: schemaMismatchError({
      operation: "insert",
      table,
      missingColumn: "<retry-limit-reached>",
      row: currentRow,
      sourceError: "Exceeded compatibility retries while removing unsupported columns.",
    }),
    usedRow: currentRow,
  };
}