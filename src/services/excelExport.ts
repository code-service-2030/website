import ExcelJS from "exceljs";

export const exportRequestsToExcel = async (requests: any[], staffList: any[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Service Requests");

    // Define Columns with exact headers and widths
    worksheet.columns = [
      { header: "الرقم / Request ID", key: "id", width: 20 },
      { header: "الاسم / Customer Name", key: "name", width: 24 },
      { header: "رمز الدولة / Country Code", key: "countryCode", width: 15 },
      { header: "رقم الجوال / Phone Number", key: "phone", width: 18 },
      { header: "البريد / Email", key: "email", width: 26 },
      { header: "الخدمات / Requested Services", key: "services", width: 38 },
      { header: "التصنيف / Category", key: "category", width: 18 },
      { header: "الحالة / Status", key: "status", width: 15 },
      { header: "الموظف المسؤول / Assigned Staff", key: "assignedStaff", width: 24 },
      { header: "حالة الدفع / Payment Status", key: "paymentStatus", width: 16 },
      { header: "تاريخ الطلب / Date", key: "date", width: 16 },
      { header: "الوقت / Time", key: "time", width: 14 },
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

    // Add Data Rows
    requests.forEach(req => {
      // Resolve assigned staff
      const staff = staffList.find(s => s.id === req.assignedStaffId);
      const staffName = staff ? staff.fullName : "Unassigned / غير معين";

      // Format Date & Time
      const dt = new Date(req.timestamp || Date.now());
      const dateStr = isNaN(dt.getTime()) ? "" : dt.toISOString().split("T")[0];
      const timeStr = isNaN(dt.getTime()) ? "" : dt.toTimeString().split(" ")[0];

      // Services text lists
      const servicesStr = req.services && Array.isArray(req.services)
        ? req.services.map((s: any) => `${s.titleAr || s.titleEn} (x${s.quantity || 1})`).join(" | ")
        : "";

      // Categories text lists
      const categoriesStr = req.services && Array.isArray(req.services)
        ? req.services.map((s: any) => s.categoryId || "General").filter((v: any, i: any, a: any) => a.indexOf(v) === i).join(", ")
        : "General";

      worksheet.addRow({
        id: req.id,
        name: req.customerName,
        countryCode: req.customerCountryCode || "+966",
        phone: req.customerPhone,
        email: req.customerEmail || "",
        services: servicesStr,
        category: categoriesStr,
        status: req.status ? req.status.toUpperCase() : "PENDING",
        assignedStaff: staffName,
        paymentStatus: req.paymentStatus ? req.paymentStatus.toUpperCase() : "UNPAID",
        date: dateStr,
        time: timeStr,
        notes: req.generalNotes || ""
      });
    });

    // Style Data Rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      
      row.font = { name: "Calibri", size: 10 };
      row.alignment = { vertical: "middle", horizontal: "left" };
      row.height = 22;

      // Apply Zebra striping
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
