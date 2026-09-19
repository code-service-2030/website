/**
 * Centralized Business Hours Configuration for Code Services.
 *
 * Schedule Specification:
 * - Days: Sunday to Thursday (الأحد – الخميس)
 * - Weekend: Friday & Saturday (الجمعة والسبت مغلق)
 * - Shift 1 (Morning): 09:30 AM → 01:00 PM (09:30 → 13:00)
 * - Midday Break:      01:00 PM → 04:00 PM (13:00 → 16:00 = Closed)
 * - Shift 2 (Evening): 04:00 PM → 11:00 PM (16:00 → 23:00)
 */

export interface Shift {
  start: string; // "09:30" (24-hour format)
  end: string;   // "13:00"
  startMinutes: number; // minutes from midnight: 9 * 60 + 30 = 570
  endMinutes: number;   // 13 * 60 = 780
  labelAr: string; // "9:30 ص – 1:00 م"
  labelEn: string; // "9:30 AM – 1:00 PM"
  labelUr: string; // "صبح 9:30 تا دوپہر 1:00"
}

export interface BusinessHoursConfig {
  timezone: string; // "Asia/Riyadh" (UTC+3)
  workingDays: number[]; // [0, 1, 2, 3, 4] where 0 = Sunday, 4 = Thursday
  shifts: Shift[];
  labels: {
    ar: {
      days: string;
      shift1: string;
      shift2: string;
      breakTime: string;
      weekend: string;
      summary: string;
      openNow: string;
      closedNow: string;
      lunchBreak: string;
    };
    en: {
      days: string;
      shift1: string;
      shift2: string;
      breakTime: string;
      weekend: string;
      summary: string;
      openNow: string;
      closedNow: string;
      lunchBreak: string;
    };
    ur: {
      days: string;
      shift1: string;
      shift2: string;
      breakTime: string;
      weekend: string;
      summary: string;
      openNow: string;
      closedNow: string;
      lunchBreak: string;
    };
  };
}

export const businessHours: BusinessHoursConfig = {
  timezone: "Asia/Riyadh",
  workingDays: [0, 1, 2, 3, 4], // Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4
  shifts: [
    {
      start: "09:30",
      end: "13:00",
      startMinutes: 9 * 60 + 30, // 570
      endMinutes: 13 * 60,       // 780
      labelAr: "9:30 ص – 1:00 م",
      labelEn: "9:30 AM – 1:00 PM",
      labelUr: "صبح 9:30 تا دوپہر 1:00"
    },
    {
      start: "16:00",
      end: "23:00",
      startMinutes: 16 * 60,      // 960
      endMinutes: 23 * 60,        // 1380
      labelAr: "4:00 م – 11:00 م",
      labelEn: "4:00 PM – 11:00 PM",
      labelUr: "شام 4:00 تا رات 11:00"
    }
  ],
  labels: {
    ar: {
      days: "الأحد – الخميس",
      shift1: "9:30 ص – 1:00 م",
      shift2: "4:00 م – 11:00 م",
      breakTime: "1:00 م – 4:00 م (مغلق)",
      weekend: "الجمعة والسبت (مغلق)",
      summary: "الأحد – الخميس (فترتان): 9:30 ص – 1:00 م | 4:00 م – 11:00 م",
      openNow: "مفتوح الآن",
      closedNow: "مغلق الآن",
      lunchBreak: "فترة راحة (يفتح 4:00 م)"
    },
    en: {
      days: "Sun – Thu",
      shift1: "9:30 AM – 1:00 PM",
      shift2: "4:00 PM – 11:00 PM",
      breakTime: "1:00 PM – 4:00 PM (Closed)",
      weekend: "Fri & Sat (Closed)",
      summary: "Sun – Thu (Two Shifts): 9:30 AM – 1:00 PM | 4:00 PM – 11:00 PM",
      openNow: "Open Now",
      closedNow: "Closed Now",
      lunchBreak: "Break Time (Opens 4:00 PM)"
    },
    ur: {
      days: "اتوار تا جمعرات",
      shift1: "صبح 9:30 تا دوپہر 1:00",
      shift2: "شام 4:00 تا رات 11:00",
      breakTime: "دوپہر 1:00 تا 4:00 (بند)",
      weekend: "جمعہ اور ہفتہ (بند)",
      summary: "اتوار تا جمعرات: صبح 9:30 تا دوپہر 1:00 | شام 4:00 تا رات 11:00",
      openNow: "ابھی کھلا ہے",
      closedNow: "ابھی بند ہے",
      lunchBreak: "وقفہ (4:00 شام کھلے گا)"
    }
  }
};

/**
 * Get current time details in Saudi Arabia (Asia/Riyadh, UTC+3)
 */
export function getRiyadhTime(date: Date = new Date()): { dayOfWeek: number; currentMinutes: number; timeString: string } {
  // Format into Riyadh timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Riyadh",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  let hour = 0;
  let minute = 0;
  let weekdayStr = "";

  for (const part of parts) {
    if (part.type === "hour") hour = parseInt(part.value, 10);
    if (part.type === "minute") minute = parseInt(part.value, 10);
    if (part.type === "weekday") weekdayStr = part.value;
  }

  // Map weekday to 0-6 (Sun = 0, Mon = 1, ... Sat = 6)
  const daysMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };

  const dayOfWeek = daysMap[weekdayStr] ?? date.getUTCDay();
  const currentMinutes = hour * 60 + minute;
  const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return { dayOfWeek, currentMinutes, timeString };
}

export interface OfficeStatus {
  isOpen: boolean;
  statusKey: "open" | "break" | "closed" | "weekend";
  currentShift: Shift | null;
  nextShiftTime: string | null;
  localizedStatus: string;
  summary: string;
}

/**
 * Determines whether Code Services office is currently open.
 * @param date Optional test date
 * @param locale Language ('ar', 'en', 'ur')
 */
export function checkOfficeStatus(date: Date = new Date(), locale: "ar" | "en" | "ur" = "ar"): OfficeStatus {
  const { dayOfWeek, currentMinutes } = getRiyadhTime(date);
  const labels = businessHours.labels[locale] || businessHours.labels.ar;

  // Check if today is a working day (Sunday to Thursday)
  if (!businessHours.workingDays.includes(dayOfWeek)) {
    return {
      isOpen: false,
      statusKey: "weekend",
      currentShift: null,
      nextShiftTime: "Sunday 09:30 AM",
      localizedStatus: labels.weekend,
      summary: labels.summary
    };
  }

  // Shift 1: 09:30 (570) to 13:00 (780)
  const shift1 = businessHours.shifts[0];
  if (currentMinutes >= shift1.startMinutes && currentMinutes < shift1.endMinutes) {
    return {
      isOpen: true,
      statusKey: "open",
      currentShift: shift1,
      nextShiftTime: shift1.end,
      localizedStatus: labels.openNow,
      summary: labels.summary
    };
  }

  // Break Time: 13:00 (780) to 16:00 (960)
  const shift2 = businessHours.shifts[1];
  if (currentMinutes >= shift1.endMinutes && currentMinutes < shift2.startMinutes) {
    return {
      isOpen: false,
      statusKey: "break",
      currentShift: null,
      nextShiftTime: shift2.start,
      localizedStatus: labels.lunchBreak,
      summary: labels.summary
    };
  }

  // Shift 2: 16:00 (960) to 23:00 (1380)
  if (currentMinutes >= shift2.startMinutes && currentMinutes < shift2.endMinutes) {
    return {
      isOpen: true,
      statusKey: "open",
      currentShift: shift2,
      nextShiftTime: shift2.end,
      localizedStatus: labels.openNow,
      summary: labels.summary
    };
  }

  // Before 09:30 or After 23:00
  return {
    isOpen: false,
    statusKey: "closed",
    currentShift: null,
    nextShiftTime: "09:30",
    localizedStatus: labels.closedNow,
    summary: labels.summary
  };
}

/**
 * Returns clean formatted business hours for any component.
 */
export function getBusinessHoursText(locale: "ar" | "en" | "ur" = "ar"): {
  days: string;
  shift1: string;
  shift2: string;
  breakTime: string;
  summary: string;
  weekend: string;
} {
  return businessHours.labels[locale] || businessHours.labels.ar;
}
