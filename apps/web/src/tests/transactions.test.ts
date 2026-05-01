import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRecipientInitials,
  buildTransactionsWhere,
  parseTransactionsQuery,
} from "../app/api/transactions/route";

test("parseTransactionsQuery defaults and clamps values", () => {
  const params = new URLSearchParams({ page: "-5", limit: "9999" });
  const parsed = parseTransactionsQuery(params);

  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, 100);
  assert.equal(parsed.status, "");
  assert.equal(parsed.railType, "");
  assert.equal(parsed.searchQuery, "");
});

test("parseTransactionsQuery reads all filters from query string", () => {
  const params = new URLSearchParams({
    page: "3",
    limit: "25",
    status: "COMPLETED",
    railType: "MPESA",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    searchQuery: "ngozi",
  });
  const parsed = parseTransactionsQuery(params);

  assert.equal(parsed.page, 3);
  assert.equal(parsed.limit, 25);
  assert.equal(parsed.status, "COMPLETED");
  assert.equal(parsed.railType, "MPESA");
  assert.equal(parsed.startDate, "2026-04-01");
  assert.equal(parsed.endDate, "2026-04-30");
  assert.equal(parsed.searchQuery, "ngozi");
});

test("buildTransactionsWhere scopes to sender and omits ALL filters", () => {
  const where = buildTransactionsWhere("user_123", {
    page: 1,
    limit: 10,
    status: "ALL",
    railType: "ALL",
    startDate: "",
    endDate: "",
    searchQuery: "",
  });

  assert.equal(where.senderId, "user_123");
  assert.equal("status" in where, false);
  assert.equal("railType" in where, false);
  assert.equal("createdAt" in where, false);
  assert.equal("recipient" in where, false);
});

test("buildTransactionsWhere includes all active filters", () => {
  const where = buildTransactionsWhere("user_abc", {
    page: 2,
    limit: 10,
    status: "COMPLETED",
    railType: "GCASH",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    searchQuery: "mama",
  });

  assert.equal(where.senderId, "user_abc");
  assert.equal(where.status, "COMPLETED");
  assert.equal(where.railType, "GCASH");
  assert.ok(where.createdAt);
  assert.ok(where.createdAt.gte instanceof Date);
  assert.ok(where.createdAt.lte instanceof Date);
  assert.deepEqual(where.recipient, {
    name: { contains: "mama", mode: "insensitive" },
  });
});

test("buildRecipientInitials returns first two initials for multi-word names", () => {
  assert.equal(buildRecipientInitials("Mama Ngozi"), "MN");
});

test("buildRecipientInitials returns first letter for single-word names", () => {
  assert.equal(buildRecipientInitials("Ngozi"), "N");
});
