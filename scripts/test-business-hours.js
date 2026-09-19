/**
 * Comprehensive Automated Test Suite for Centralized Business Hours.
 * Tests 15+ precise time boundaries in Asia/Riyadh timezone.
 */

const { 
  businessHours, 
  checkOfficeStatus, 
  getRiyadhTime, 
  getBusinessHoursText 
} = require('../src/data/businessHours');

console.log("===============================================================");
console.log("STARTING BUSINESS HOURS TIME BOUNDARY AUTOMATED TEST SUITE");
console.log("===============================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition, description, details = "") {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    if (details) console.error(`     Details: ${details}`);
    failedCount++;
  }
}

// Helper to construct a Date object representing a specific day and time in Riyadh (UTC+3)
// 2026-09-20 is Sunday, 2026-09-21 is Monday, 2026-09-24 is Thursday, 2026-09-25 is Friday, 2026-09-26 is Saturday.
function makeRiyadhDate(year, month, day, hour, minute) {
  // Riyadh is UTC+3, so UTC hour = hour - 3
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour - 3, minute, 0));
  return utcDate;
}

// ─────────────────────────────────────────────
// Group 1: Shift 1 Boundaries (Sunday: 09:30 - 13:00)
// ─────────────────────────────────────────────
console.log("▶ GROUP 1: Morning Shift 1 Boundaries (09:30 AM - 01:00 PM)");

// 09:29 AM on Sunday -> CLOSED (Before shift 1)
const t0929 = makeRiyadhDate(2026, 9, 20, 9, 29);
const st0929 = checkOfficeStatus(t0929, 'ar');
assert(!st0929.isOpen && st0929.statusKey === 'closed', "Sunday 09:29 AM is CLOSED");

// 09:30 AM on Sunday -> OPEN (Shift 1 start)
const t0930 = makeRiyadhDate(2026, 9, 20, 9, 30);
const st0930 = checkOfficeStatus(t0930, 'ar');
assert(st0930.isOpen && st0930.statusKey === 'open', "Sunday 09:30 AM is OPEN (Shift 1 Start)");

// 11:15 AM on Sunday -> OPEN (Mid Shift 1)
const t1115 = makeRiyadhDate(2026, 9, 20, 11, 15);
const st1115 = checkOfficeStatus(t1115, 'ar');
assert(st1115.isOpen && st1115.statusKey === 'open', "Sunday 11:15 AM is OPEN (Mid Shift 1)");

// 12:59 PM on Sunday -> OPEN (Shift 1 last minute)
const t1259 = makeRiyadhDate(2026, 9, 20, 12, 59);
const st1259 = checkOfficeStatus(t1259, 'ar');
assert(st1259.isOpen && st1259.statusKey === 'open', "Sunday 12:59 PM is OPEN (Shift 1 End Boundary)");

// ─────────────────────────────────────────────
// Group 2: Midday Break Boundaries (13:00 - 16:00)
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 2: Midday Break Boundaries (01:00 PM - 04:00 PM = Closed)");

// 13:00 PM on Sunday -> CLOSED / BREAK (Break Start)
const t1300 = makeRiyadhDate(2026, 9, 20, 13, 0);
const st1300 = checkOfficeStatus(t1300, 'ar');
assert(!st1300.isOpen && st1300.statusKey === 'break', "Sunday 01:00 PM is CLOSED (Break Starts)");

// 14:30 PM on Sunday -> CLOSED / BREAK (Mid Break)
const t1430 = makeRiyadhDate(2026, 9, 20, 14, 30);
const st1430 = checkOfficeStatus(t1430, 'ar');
assert(!st1430.isOpen && st1430.statusKey === 'break', "Sunday 02:30 PM is CLOSED (Mid Break)");

// 15:59 PM on Sunday -> CLOSED / BREAK (Break End Boundary)
const t1559 = makeRiyadhDate(2026, 9, 20, 15, 59);
const st1559 = checkOfficeStatus(t1559, 'ar');
assert(!st1559.isOpen && st1559.statusKey === 'break', "Sunday 03:59 PM is CLOSED (Break End Boundary)");

// ─────────────────────────────────────────────
// Group 3: Shift 2 Boundaries (16:00 - 23:00)
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 3: Evening Shift 2 Boundaries (04:00 PM - 11:00 PM)");

// 16:00 PM on Sunday -> OPEN (Shift 2 Start)
const t1600 = makeRiyadhDate(2026, 9, 20, 16, 0);
const st1600 = checkOfficeStatus(t1600, 'ar');
assert(st1600.isOpen && st1600.statusKey === 'open', "Sunday 04:00 PM is OPEN (Shift 2 Start)");

// 20:00 PM on Wednesday -> OPEN (Mid Shift 2)
const t2000 = makeRiyadhDate(2026, 9, 23, 20, 0);
const st2000 = checkOfficeStatus(t2000, 'ar');
assert(st2000.isOpen && st2000.statusKey === 'open', "Wednesday 08:00 PM is OPEN (Evening Shift)");

// 22:59 PM on Thursday -> OPEN (Shift 2 Last Minute)
const t2259 = makeRiyadhDate(2026, 9, 24, 22, 59);
const st2259 = checkOfficeStatus(t2259, 'ar');
assert(st2259.isOpen && st2259.statusKey === 'open', "Thursday 10:59 PM is OPEN (Shift 2 End Boundary)");

// 23:00 PM on Thursday -> CLOSED (Night Closed)
const t2300 = makeRiyadhDate(2026, 9, 24, 23, 0);
const st2300 = checkOfficeStatus(t2300, 'ar');
assert(!st2300.isOpen && st2300.statusKey === 'closed', "Thursday 11:00 PM is CLOSED");

// 02:00 AM on Monday -> CLOSED (Late Night)
const t0200 = makeRiyadhDate(2026, 9, 21, 2, 0);
const st0200 = checkOfficeStatus(t0200, 'ar');
assert(!st0200.isOpen && st0200.statusKey === 'closed', "Monday 02:00 AM is CLOSED");

// ─────────────────────────────────────────────
// Group 4: Weekend (Friday & Saturday)
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 4: Weekend (Friday & Saturday = Closed all day)");

// Friday 10:00 AM -> WEEKEND CLOSED
const tFriMorning = makeRiyadhDate(2026, 9, 25, 10, 0);
const stFriMorning = checkOfficeStatus(tFriMorning, 'ar');
assert(!stFriMorning.isOpen && stFriMorning.statusKey === 'weekend', "Friday 10:00 AM is CLOSED (Weekend)");

// Friday 18:00 PM -> WEEKEND CLOSED
const tFriEvening = makeRiyadhDate(2026, 9, 25, 18, 0);
const stFriEvening = checkOfficeStatus(tFriEvening, 'ar');
assert(!stFriEvening.isOpen && stFriEvening.statusKey === 'weekend', "Friday 06:00 PM is CLOSED (Weekend)");

// Saturday 11:00 AM -> WEEKEND CLOSED
const tSatMorning = makeRiyadhDate(2026, 9, 26, 11, 0);
const stSatMorning = checkOfficeStatus(tSatMorning, 'ar');
assert(!stSatMorning.isOpen && stSatMorning.statusKey === 'weekend', "Saturday 11:00 AM is CLOSED (Weekend)");

// ─────────────────────────────────────────────
// Group 5: Localized Labels & Formatting
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 5: Localized Text & Labels");

const arText = getBusinessHoursText('ar');
assert(arText.days === "الأحد – الخميس", "Arabic working days label");
assert(arText.shift1 === "9:30 ص – 1:00 م", "Arabic shift 1 label");
assert(arText.shift2 === "4:00 م – 11:00 م", "Arabic shift 2 label");

const enText = getBusinessHoursText('en');
assert(enText.days === "Sun – Thu", "English working days label");
assert(enText.shift1 === "9:30 AM – 1:00 PM", "English shift 1 label");
assert(enText.shift2 === "4:00 PM – 11:00 PM", "English shift 2 label");

console.log("\n===============================================================");
console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED out of ${passedCount + failedCount} TOTAL`);
console.log("===============================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL BUSINESS HOURS TESTS PASSED WITH 100% SUCCESS!\n");
}
