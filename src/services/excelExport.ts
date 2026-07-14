import ExcelJS from "exceljs";

const getCategoryLabel = (catId: string): string => {
  const mapping: Record<string, string> = {
    business: "Business Services / خدمات الأعمال",
    absher: "Government Services (Absher) / خدمات أبشر",
    hr: "HR & Recruitment / الموارد البشرية",
    qiwa: "Qiwa Platform / منصة قوى",
    student: "Student Services / خدمات الطلاب",
    printing: "Printing & Translation / الطباعة والترجمة",
    general: "General / عام"
  };
  return mapping[catId.toLowerCase()] || catId;
};

export const exportRequestsToExcel = async (requests: any[], staffList: any[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Service Requests");

    // Define 14 columns requested by the user
    worksheet.columns = [
      { header: "رقم الطلب / Request ID", key: "id", width: 20 },
      { header: "اسم العميل / Customer Name", key: "name", width: 24 },
      { header: "الدولة / Country", key: "country", width: 18 },
      { header: "رمز الدولة / Country Code", key: "countryCode", width: 15 },
      { header: "رقم الجوال / Phone Number", key: "phone", width: 18 },
      { header: "البريد الإلكتروني / Email", key: "email", width: 26 },
      { header: "التصنيف / Category", key: "category", width: 28 },
      { header: "الخدمة المطلوبة / Requested Service", key: "requestedService", width: 32 },
      { header: "حالة الدفع / Payment Status", key: "paymentStatus", width: 16 },
      { header: "الموظف المسؤول / Assigned Staff", key: "assignedStaff", width: 24 },
      { header: "الحالة / Status", key: "status", width: 15 },
      { header: "تاريخ الطلب / Request Date", key: "date", width: 16 },
      { header: "وقت الطلب / Request Time", key: "time", width: 14 },
      { header: "ملاحظات العميل / Client Notes", key: "notes", width: 32 }
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" } // Tailwind Indigo-600 color
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 28;

    // Add Data Rows (One row per requested service in each order)
    requests.forEach(req => {
      // Resolve assigned staff
      const staff = staffList.find(s => s.id === req.assignedStaffId);
      const staffName = staff ? staff.fullName : "Unassigned / غير معين";

      // Format Date & Time
      const dt = new Date(req.timestamp || Date.now());
      const dateStr = isNaN(dt.getTime()) ? "" : dt.toISOString().split("T")[0];
      const timeStr = isNaN(dt.getTime()) ? "" : dt.toTimeString().split(" ")[0];

      const services = req.services && Array.isArray(req.services) ? req.services : [];

      if (services.length === 0) {
        // If no services are associated, output a blank service row to retain the request itself
        worksheet.addRow({
          id: req.id,
          name: req.customerName,
          country: req.customerCountry || "Saudi Arabia / المملكة العربية السعودية",
          countryCode: req.customerCountryCode || "+966",
          phone: req.customerPhone,
          email: req.customerEmail || "",
          category: "General / عام",
          requestedService: "No Service Selected",
          paymentStatus: req.paymentStatus ? req.paymentStatus.toUpperCase() : "UNPAID",
          assignedStaff: staffName,
          status: req.status ? req.status.toUpperCase() : "PENDING",
          date: dateStr,
          time: timeStr,
          notes: req.generalNotes || ""
        });
      } else {
        // Output one row per service item
        services.forEach((s: any) => {
          worksheet.addRow({
            id: req.id,
            name: req.customerName,
            country: req.customerCountry || "Saudi Arabia / المملكة العربية السعودية",
            countryCode: req.customerCountryCode || "+966",
            phone: req.customerPhone,
            email: req.customerEmail || "",
            category: getCategoryLabel(s.categoryId || "general"),
            requestedService: `${s.titleAr || s.titleEn} (x${s.quantity || 1})`,
            paymentStatus: req.paymentStatus ? req.paymentStatus.toUpperCase() : "UNPAID",
            assignedStaff: staffName,
            status: req.status ? req.status.toUpperCase() : "PENDING",
            date: dateStr,
            time: timeStr,
            notes: req.generalNotes || ""
          });
        });
      }
    });

    // Style Data Rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      
      row.font = { name: "Calibri", size: 10 };
      row.alignment = { vertical: "middle", horizontal: "left" };
      row.height = 22;

      // Apply Zebra striping based on row number
      if (rowNumber % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" } // Tailwind Gray-50
        };
      }

      // Add borders and custom cell alignments
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } }, // Tailwind Gray-200
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } }
        };
      });
    });

    // Enable Auto Filter across all columns
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length }
    };

    // Freeze First Row (header) so it stays visible during scrolling
    worksheet.views = [
      { state: "frozen", ySplit: 1 }
    ];

    // Write Workbook to Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create Blob and trigger download in client browser
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `requests_${Date.now()}.xlsx`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate Excel file:", error);
    alert("Error generating Excel export. Please check console logs.");
  }
};
