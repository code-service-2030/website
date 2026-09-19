export type Language = 'ar' | 'en';

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  visible: boolean;
  order: number;
}

export interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  categoryId: string;
  price?: string;
  docsAr?: string;
  docsEn?: string;
  completionTimeAr?: string;
  completionTimeEn?: string;
  keywords: string[];
  featured: boolean;
  featuredOrder?: number;
  visible: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
  visible: boolean;
  order: number;
}

export interface Announcement {
  id: string;
  textAr: string;
  textEn: string;
  active: boolean;
  bgColor: string;
}


export const defaultCategories: Category[] = [
  {
    "id": "hr-qiwa",
    "nameAr": "💼 خدمات الموارد البشرية وقوى",
    "nameEn": "HR & Qiwa Services",
    "icon": "Activity",
    "order": 10,
    "descAr": "إدارة عقود العمل ورخص العمل وتوطين الوظائف ونقل الكفالة.",
    "descEn": "Manage labor contracts, work permits, Saudization targets, and transfers.",
    "visible": true
  },
  {
    "id": "commerce-business",
    "nameAr": "🏢 خدمات وزارة التجارة ومركز الأعمال",
    "nameEn": "MoC & Business Center Services",
    "icon": "Briefcase",
    "order": 20,
    "descAr": "تأسيس وتجديد وشطب السجلات التجارية وحجز الأسماء والعلامات.",
    "descEn": "Establish, renew, and cancel commercial registers, and reserve trade names.",
    "visible": true
  },
  {
    "id": "municipality-balady",
    "nameAr": "🏛️ خدمات البلدية ومنصة بلدي",
    "nameEn": "Municipal & Balady Services",
    "icon": "Building",
    "order": 30,
    "descAr": "تراخيص المحلات والشهادات الصحية وتصاريح اللوحات وإشغال الأرصفة.",
    "descEn": "Municipal store permits, health certs, signage, and occupancy permits.",
    "visible": true
  },
  {
    "id": "civil-defense",
    "nameAr": "🚨 خدمات الدفاع المدني والسلامة",
    "nameEn": "Civil Defense & Safety Services",
    "icon": "ShieldAlert",
    "order": 40,
    "descAr": "تراخيص السلامة وتقارير المكاتب الهندسية وتوفير أدوات الحريق.",
    "descEn": "Safety licenses, technical engineering reports, and fire tools.",
    "visible": true
  },
  {
    "id": "zatca",
    "nameAr": "💵 خدمات الزكاة والضريبة والجمارك",
    "nameEn": "ZATCA Tax & Customs Services",
    "icon": "Coins",
    "order": 50,
    "descAr": "تقديم الإقرارات الزكوية والضريبة والتسجيل في الفاتورة الإلكترونية.",
    "descEn": "Zakat filings, VAT submissions, and Electronic Invoicing setup.",
    "visible": true
  },
  {
    "id": "gosi",
    "nameAr": "📄 خدمات التأمينات الاجتماعية",
    "nameEn": "GOSI Social Insurance Services",
    "icon": "FileText",
    "order": 60,
    "descAr": "تسجيل الموظفين وتعديل الأجور وحساب مدد وحماية الأجور.",
    "descEn": "Register staff, adjust wages, and manage Mudad wage protection logs.",
    "visible": true
  },
  {
    "id": "absher-passports",
    "nameAr": "👤 خدمات أبشر والجوازات",
    "nameEn": "Absher & Passports Services",
    "icon": "UserCheck",
    "order": 70,
    "descAr": "إصدار الإقامات وتجديدها وتأشيرات الخروج والعودة والنهائي.",
    "descEn": "Issue and renew residency IDs, and process travel visas.",
    "visible": true
  },
  {
    "id": "mofa-visas",
    "nameAr": "✈️ خدمات وزارة الخارجية والتأشيرات",
    "nameEn": "MOFA & Visa Services",
    "icon": "Globe",
    "order": 80,
    "descAr": "طلب الزيارات وتفويض التأشيرات وتصديق الوثائق الرسمية.",
    "descEn": "Inquire visit visas, delegate work visas, and attest certificates.",
    "visible": true
  },
  {
    "id": "najiz-justice",
    "nameAr": "⚖️ خدمات ناجز ووزارة العدل",
    "nameEn": "Najiz & Ministry of Justice Services",
    "icon": "Scale",
    "order": 90,
    "descAr": "إصدار الوكالات وتوثيق الصكوك العقارية وصحائف الدعوى والتنفيذ.",
    "descEn": "Issue digital POAs, property deeds, lawsuits, and execution claims.",
    "visible": true
  },
  {
    "id": "contracts-ops",
    "nameAr": "🏠 خدمات المنشآت والعقود",
    "nameEn": "Establishment Services & Rental Contracts",
    "icon": "Home",
    "order": 100,
    "descAr": "تجهيز عقود النظافة والصيانة والتشغيل وصياغة عقود العمل والخدمات.",
    "descEn": "Draft waste, safety maintenance, operational, and service contracts.",
    "visible": true
  },
  {
    "id": "modon",
    "nameAr": "🏗️ خدمات منصة مدن",
    "nameEn": "MODON Platform Services",
    "icon": "HardHat",
    "order": 110,
    "descAr": "تراخيص البناء وتخصيص الأراضي الصناعية ومواصفات المصانع.",
    "descEn": "MODON industrial land leasing, permits, and factory specs.",
    "visible": true
  },
  {
    "id": "chamber",
    "nameAr": "🏅 خدمات الغرفة التجارية",
    "nameEn": "Chamber of Commerce Services",
    "icon": "Award",
    "order": 120,
    "descAr": "اشتراك الغرفة وتجديده وتصديق خطابات التعريف والرواتب والتفاويض.",
    "descEn": "Renew subscriptions and certify corporate introductory letters.",
    "visible": true
  },
  {
    "id": "transportation",
    "nameAr": "🚛 خدمات النقل",
    "nameEn": "Transport Authority Services",
    "icon": "Truck",
    "order": 130,
    "descAr": "بطاقات التشغيل للشاحنات وتراخيص النقل العام والاعتراض على المخالفات.",
    "descEn": "Operating cards, general logistics licenses, and penalty objections.",
    "visible": true
  },
  {
    "id": "health-insurance",
    "nameAr": "🏥 خدمات التأمين الصحي",
    "nameEn": "Health Insurance Services",
    "icon": "HeartPulse",
    "order": 140,
    "descAr": "الاستعلام عن التأمين وربط الموظفين والعمالة بالبوليصة المعتمدة.",
    "descEn": "Query medical coverage and link workers to active policies.",
    "visible": true
  },
  {
    "id": "traffic-vehicles",
    "nameAr": "🚗 خدمات المركبات والمرور",
    "nameEn": "Traffic & Vehicle Services",
    "icon": "Car",
    "order": 150,
    "descAr": "نقل الملكية وتجديد الاستمارة والاعتراض على المخالفات المرورية وتفاويض القيادة.",
    "descEn": "Vehicle ownership transfers, Istimara renewals, and driving delegations.",
    "visible": true
  },
  {
    "id": "investment-biz",
    "nameAr": "📈 خدمات الاستثمار والأعمال",
    "nameEn": "Business Investment Services",
    "icon": "TrendingUp",
    "order": 160,
    "descAr": "دراسات الجدوى النظامية وتأسيس شركات الاستثمار الخارجي وتجهيز المتطلبات.",
    "descEn": "Feasibility of regulations, foreign business setup, and applications.",
    "visible": true
  }
];

export const defaultServices: ServiceItem[] = [
  {
    "id": "qiwa-open-account",
    "titleAr": "فتح وتفعيل حساب المنشأة",
    "titleEn": "Open and Activate Facility Account",
    "descAr": "فتح حساب منشأة جديد وتفعيله عبر الموارد البشرية ومنصة قوى.",
    "descEn": "Open new facility account and activate it via Qiwa and HR systems.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري للمنشأة، الهوية الوطنية للمالك",
    "docsEn": "Commercial Register, National ID of Owner",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "فتح وتفعيل حساب المنشأة",
      "Open and Activate Facility Account",
      "qiwa-open-account"
    ],
    "featured": false,
    "visible": true,
    "order": 10
  },
  {
    "id": "qiwa-manage-file",
    "titleAr": "إدارة ملف المنشأة",
    "titleEn": "Manage Facility Profile",
    "descAr": "تحديث وإدارة بيانات ومستخدمي وصلاحيات ملف المنشأة.",
    "descEn": "Update and manage profile details, users, and permissions of the facility.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، تفويض رسمي للممثل",
    "docsEn": "Commercial Register, Official delegation document",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إدارة ملف المنشأة",
      "Manage Facility Profile",
      "qiwa-manage-file"
    ],
    "featured": false,
    "visible": true,
    "order": 11
  },
  {
    "id": "qiwa-issue-permits",
    "titleAr": "إصدار رخص العمل",
    "titleEn": "Issue Work Permits",
    "descAr": "تقديم طلبات إصدار رخص العمل وتسهيل معاملات العمالة.",
    "descEn": "Submit requests to issue work permits for employees.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات الإقامة للموظف، رقم الحدود",
    "docsEn": "Employee residence data or Border Number",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إصدار رخص العمل",
      "Issue Work Permits",
      "qiwa-issue-permits"
    ],
    "featured": false,
    "visible": true,
    "order": 12
  },
  {
    "id": "qiwa-renew-permits",
    "titleAr": "تجديد رخص العمل",
    "titleEn": "Renew Work Permits",
    "descAr": "تجديد صلاحية رخص العمل وتحديث البيانات في قوى ومكتب العمل.",
    "descEn": "Renew validity of work permits and update records in Qiwa.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات رخصة العمل القديمة والإقامة",
    "docsEn": "Old work permit and Residence ID details",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تجديد رخص العمل",
      "Renew Work Permits",
      "qiwa-renew-permits"
    ],
    "featured": false,
    "visible": true,
    "order": 13
  },
  {
    "id": "qiwa-transfer-sponsorship",
    "titleAr": "نقل خدمات العمالة",
    "titleEn": "Transfer Employee Sponsorship",
    "descAr": "تعديل ونقل خدمات الموظفين والعمالة الوافدة بين المنشآت إلكترونياً.",
    "descEn": "Modify and transfer employee sponsorship between establishments.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "موافقة صاحب العمل الحالي، بيانات المنشأة الجديدة",
    "docsEn": "Current employer consent, new facility details",
    "completionTimeAr": "1-3 أيام عمل",
    "completionTimeEn": "1-3 أيام عمل",
    "keywords": [
      "نقل خدمات العمالة",
      "Transfer Employee Sponsorship",
      "qiwa-transfer-sponsorship"
    ],
    "featured": false,
    "visible": true,
    "order": 14
  },
  {
    "id": "qiwa-change-professions",
    "titleAr": "تغيير المهن",
    "titleEn": "Modify Profession",
    "descAr": "تعديل وتحديث المهنة الوظيفية للموظف في التأمينات ومكتب العمل.",
    "descEn": "Modify and update employee's official profession designation.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "شهادة علمية مصدقة، تفويض المنشأة",
    "docsEn": "Certified educational certificate, company authorization",
    "completionTimeAr": "1-3 أيام عمل",
    "completionTimeEn": "1-3 أيام عمل",
    "keywords": [
      "تغيير المهن",
      "Modify Profession",
      "qiwa-change-professions"
    ],
    "featured": false,
    "visible": true,
    "order": 15
  },
  {
    "id": "qiwa-issue-contracts",
    "titleAr": "إصدار عقود العمل",
    "titleEn": "Create Employment Contract",
    "descAr": "إنشاء عقود وظيفية موثقة إلكترونياً ومتوافقة مع نظام مكتب العمل.",
    "descEn": "Create certified digital employment contracts compliant with Ministry rules.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "الهوية الوطنية أو الإقامة للموظف، تفاصيل الراتب والمهام",
    "docsEn": "National ID or Residence of employee, salary details",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إصدار عقود العمل",
      "Create Employment Contract",
      "qiwa-issue-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 16
  },
  {
    "id": "qiwa-renew-contracts",
    "titleAr": "تجديد عقود العمل",
    "titleEn": "Renew Employment Contracts",
    "descAr": "تجديد وتمديد عقود العمل الرسمية والموثقة للموظفين.",
    "descEn": "Renew and extend valid certified employment contracts for employees.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "رقم العقد الحالي، التعديلات المقترحة",
    "docsEn": "Current contract number, proposed updates",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تجديد عقود العمل",
      "Renew Employment Contracts",
      "qiwa-renew-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 17
  },
  {
    "id": "qiwa-manage-contracts",
    "titleAr": "إدارة وتوثيق العقود",
    "titleEn": "Manage and Certify Contracts",
    "descAr": "توثيق واعتماد عقود العمل إلكترونياً عبر منصة قوى.",
    "descEn": "Certify and approve employment agreements digitally on Qiwa.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات العقد المعتمد، موافقة الموظف",
    "docsEn": "Approved contract details, employee consent",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إدارة وتوثيق العقود",
      "Manage and Certify Contracts",
      "qiwa-manage-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 18
  },
  {
    "id": "qiwa-saudization-nitaqat",
    "titleAr": "خدمات التوطين ونطاقات",
    "titleEn": "Saudization & Nitaqat Services",
    "descAr": "تحسين نسبة التوطين ومتابعة درجات النطاق الأخضر للمنشآت.",
    "descEn": "Improve Saudization rates and monitor facility's Nitaqat tier.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "كشف العمالة الحالي، شهادة السعودة",
    "docsEn": "Current workforce roster, Saudization cert",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات التوطين ونطاقات",
      "Saudization & Nitaqat Services",
      "qiwa-saudization-nitaqat"
    ],
    "featured": false,
    "visible": true,
    "order": 19
  },
  {
    "id": "qiwa-saudization-inquire",
    "titleAr": "الاستعلام عن نسب التوطين",
    "titleEn": "Inquire Saudization Rates",
    "descAr": "الاستعلام ودراسة نسب السعودة المطلوبة والشرطية للمنشأة.",
    "descEn": "Inquire and analyze required Saudization targets for the facility.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "رقم المنشأة الموحد",
    "docsEn": "Unified facility registration number",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الاستعلام عن نسب التوطين",
      "Inquire Saudization Rates",
      "qiwa-saudization-inquire"
    ],
    "featured": false,
    "visible": true,
    "order": 20
  },
  {
    "id": "qiwa-violations",
    "titleAr": "معالجة ملاحظات ومخالفات المنشأة",
    "titleEn": "Resolve Facility Violations",
    "descAr": "الاعتراض وحل وتسوية المخالفات المفروضة على المنشأة من مكتب العمل.",
    "descEn": "Object and resolve penalties imposed on the facility by Ministry of Labor.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "مستند المخالفة، إثباتات التسوية أو الدفع",
    "docsEn": "Violation document, proof of settlement or payment",
    "completionTimeAr": "2-4 أيام عمل",
    "completionTimeEn": "2-4 أيام عمل",
    "keywords": [
      "معالجة ملاحظات ومخالفات المنشأة",
      "Resolve Facility Violations",
      "qiwa-violations"
    ],
    "featured": false,
    "visible": true,
    "order": 21
  },
  {
    "id": "qiwa-saudization-cert",
    "titleAr": "خدمات السعودة والتوطين",
    "titleEn": "Saudization Certificates",
    "descAr": "إصدار شهادة السعودة الرسمية المعتمدة للمؤسسات.",
    "descEn": "Issue official Saudization certificate for commercial companies.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري والاشتراكات المعتمدة",
    "docsEn": "Commercial Registration and certified subscriptions",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "خدمات السعودة والتوطين",
      "Saudization Certificates",
      "qiwa-saudization-cert"
    ],
    "featured": false,
    "visible": true,
    "order": 22
  },
  {
    "id": "qiwa-professional-visas",
    "titleAr": "التأشيرات المهنية",
    "titleEn": "Professional Work Visas",
    "descAr": "إصدار تأشيرات العمل المهنية الفورية للشركات والمؤسسات.",
    "descEn": "Issue instant professional work visas for companies and enterprises.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "موافقة وزارة العمل، السجل التجاري",
    "docsEn": "Ministry approval, Commercial Registration",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "التأشيرات المهنية",
      "Professional Work Visas",
      "qiwa-professional-visas"
    ],
    "featured": false,
    "visible": true,
    "order": 23
  },
  {
    "id": "qiwa-recruitment-req",
    "titleAr": "طلبات الاستقدام",
    "titleEn": "Recruitment Requests",
    "descAr": "إدارة وتقديم طلبات تأشيرات استقدام العمالة للمؤسسات.",
    "descEn": "Manage and submit recruitment visa requests for organizations.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "موافقة الجهة الحكومية، السجل التجاري",
    "docsEn": "Government consent, Commercial Registration",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "طلبات الاستقدام",
      "Recruitment Requests",
      "qiwa-recruitment-req"
    ],
    "featured": false,
    "visible": true,
    "order": 24
  },
  {
    "id": "qiwa-domestic-workers",
    "titleAr": "خدمات العمالة المنزلية حسب المنصة المختصة",
    "titleEn": "Domestic Workers Services",
    "descAr": "إصدار وتجديد وإلغاء تأشيرات العمالة المنزلية عبر مساند أو منصة أبشر.",
    "descEn": "Issue, renew and cancel domestic worker visas via Musaned or Absher.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "الهوية الوطنية، إثبات الملاءة المالية للمستفيد",
    "docsEn": "National ID, financial solvency proof of applicant",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات العمالة المنزلية حسب المنصة المختصة",
      "Domestic Workers Services",
      "qiwa-domestic-workers"
    ],
    "featured": false,
    "visible": true,
    "order": 25
  },
  {
    "id": "qiwa-labor-office",
    "titleAr": "خدمات مكتب العمل",
    "titleEn": "Labor Office Services",
    "descAr": "إدارة فتح وتحديث الملفات وتنزيل وحساب نسب مكتب العمل.",
    "descEn": "Manage opening, updating profiles and calculating Ministry of Labor dues.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري والترخيص البلدي",
    "docsEn": "Commercial Registration and Municipal License",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات مكتب العمل",
      "Labor Office Services",
      "qiwa-labor-office"
    ],
    "featured": false,
    "visible": true,
    "order": 26
  },
  {
    "id": "qiwa-manage-locations",
    "titleAr": "إدارة مواقع المنشأة",
    "titleEn": "Manage Facility Locations",
    "descAr": "تحديث وإضافة العناوين والمواقع الرسمية للمؤسسة في منصة قوى.",
    "descEn": "Update and add official addresses and locations of the facility.",
    "categoryId": "hr-qiwa",
    "price": "حسب الاتفاق",
    "docsAr": "العنوان الوطني للمنشأة",
    "docsEn": "National Address of the establishment",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إدارة مواقع المنشأة",
      "Manage Facility Locations",
      "qiwa-manage-locations"
    ],
    "featured": false,
    "visible": true,
    "order": 27
  },
  {
    "id": "commerce-issue-cr",
    "titleAr": "إصدار سجل تجاري",
    "titleEn": "Issue Commercial Register (CR)",
    "descAr": "تأسيس وإصدار السجل التجاري الفوري للمؤسسات والشركات.",
    "descEn": "Establish and issue instant Commercial Register for companies.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الهوية للمالك، حجز الاسم التجاري",
    "docsEn": "Owner ID number, reserved trade name",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إصدار سجل تجاري",
      "Issue Commercial Register (CR)",
      "commerce-issue-cr"
    ],
    "featured": false,
    "visible": true,
    "order": 28
  },
  {
    "id": "commerce-edit-cr",
    "titleAr": "تعديل السجل التجاري",
    "titleEn": "Modify Commercial Register (CR)",
    "descAr": "تعديل وتحديث بيانات السجل التجاري (رأس المال، الشركاء، العنوان).",
    "descEn": "Update Commercial Register details (capital, partners, address).",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري، تفاصيل التعديلات المطلوبة",
    "docsEn": "Commercial Register Number, requested modifications",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تعديل السجل التجاري",
      "Modify Commercial Register (CR)",
      "commerce-edit-cr"
    ],
    "featured": false,
    "visible": true,
    "order": 29
  },
  {
    "id": "commerce-renew-cr",
    "titleAr": "تجديد السجل التجاري",
    "titleEn": "Renew Commercial Register (CR)",
    "descAr": "تجديد صلاحية السجل التجاري إلكترونياً لضمان سريانه.",
    "descEn": "Renew commercial registration online to ensure compliance.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري المطلوب تجديده",
    "docsEn": "Commercial Register Number to renew",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تجديد السجل التجاري",
      "Renew Commercial Register (CR)",
      "commerce-renew-cr"
    ],
    "featured": false,
    "visible": true,
    "order": 30
  },
  {
    "id": "commerce-cancel-cr",
    "titleAr": "شطب سجل تجاري",
    "titleEn": "Cancel Commercial Register (CR)",
    "descAr": "إلغاء وشطب السجلات التجارية وتصفية المنشأة بصورة رسمية.",
    "descEn": "Delete and cancel commercial registers and dissolve the business.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري، تسوية مستحقات البلدية والغرفة",
    "docsEn": "Commercial Register, settlement of municipal and chamber dues",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "شطب سجل تجاري",
      "Cancel Commercial Register (CR)",
      "commerce-cancel-cr"
    ],
    "featured": false,
    "visible": true,
    "order": 31
  },
  {
    "id": "commerce-add-activities",
    "titleAr": "إضافة الأنشطة",
    "titleEn": "Add Business Activities",
    "descAr": "إضافة أنشطة تجارية جديدة للسجل التجاري القائم.",
    "descEn": "Add new business activities to the existing Commercial Register.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري، اختيار الأنشطة المطلوبة",
    "docsEn": "Commercial Register, selected activities list",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إضافة الأنشطة",
      "Add Business Activities",
      "commerce-add-activities"
    ],
    "featured": false,
    "visible": true,
    "order": 32
  },
  {
    "id": "commerce-remove-activities",
    "titleAr": "حذف الأنشطة",
    "titleEn": "Remove Business Activities",
    "descAr": "حذف أو إلغاء أنشطة تجارية من السجل التجاري القائم.",
    "descEn": "Delete or cancel business activities from the existing Commercial Register.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري، تحديد الأنشطة المراد حذفها",
    "docsEn": "Commercial Register, list of activities to remove",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "حذف الأنشطة",
      "Remove Business Activities",
      "commerce-remove-activities"
    ],
    "featured": false,
    "visible": true,
    "order": 33
  },
  {
    "id": "commerce-reserve-name",
    "titleAr": "حجز الاسم التجاري",
    "titleEn": "Reserve Trade Name",
    "descAr": "حجز اسم تجاري مميز وحصري للمنشأة عبر وزارة التجارة.",
    "descEn": "Reserve a distinct and exclusive trade name for the company.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "الاسم المقترح، الهوية الوطنية للمستفيد",
    "docsEn": "Proposed name, National ID of applicant",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "حجز الاسم التجاري",
      "Reserve Trade Name",
      "commerce-reserve-name"
    ],
    "featured": false,
    "visible": true,
    "order": 34
  },
  {
    "id": "commerce-issue-corp",
    "titleAr": "إصدار وتعديل بيانات المؤسسة",
    "titleEn": "Issue and Edit Entity Profile",
    "descAr": "إنشاء أو تحديث ملف الكيان القانوني للمؤسسة.",
    "descEn": "Establish or update the legal entity profile of the enterprise.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، الهوية الوطنية للمالك",
    "docsEn": "Commercial Register, Owner National ID",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "إصدار وتعديل بيانات المؤسسة",
      "Issue and Edit Entity Profile",
      "commerce-issue-corp"
    ],
    "featured": false,
    "visible": true,
    "order": 35
  },
  {
    "id": "commerce-transfer-cr",
    "titleAr": "نقل ملكية السجل التجاري",
    "titleEn": "Transfer Ownership of CR",
    "descAr": "نقل ملكية وتنازل السجل التجاري من شخص لآخر بصورة قانونية.",
    "descEn": "Transfer commercial register ownership to another person legally.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "عقد التنازل الإلكتروني، الهوية الوطنية للمشتري والبائع",
    "docsEn": "Electronic assignment deed, Buyer & Seller IDs",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "نقل ملكية السجل التجاري",
      "Transfer Ownership of CR",
      "commerce-transfer-cr"
    ],
    "featured": false,
    "visible": true,
    "order": 36
  },
  {
    "id": "commerce-beneficiary",
    "titleAr": "إدارة المستفيد الحقيقي",
    "titleEn": "Manage Ultimate Beneficial Owner (UBO)",
    "descAr": "تسجيل والإفصاح عن بيانات المستفيد الحقيقي للمنشآت والشركات.",
    "descEn": "Register and disclose Ultimate Beneficial Owner data for entities.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، الهوية الوطنية للمالكين الحقيقيين",
    "docsEn": "Commercial Register, National IDs of actual beneficiaries",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إدارة المستفيد الحقيقي",
      "Manage Ultimate Beneficial Owner (UBO)",
      "commerce-beneficiary"
    ],
    "featured": false,
    "visible": true,
    "order": 37
  },
  {
    "id": "commerce-disclosure",
    "titleAr": "الإفصاح والبيانات التجارية",
    "titleEn": "Commercial Disclosure & Data",
    "descAr": "تقديم إقرارات الإفصاح المالي والبيانات التجارية السنوية.",
    "descEn": "Submit financial disclosures and commercial statements annually.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "القوائم المالية السنوية للمنشأة",
    "docsEn": "Annual financial statements of the facility",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "الإفصاح والبيانات التجارية",
      "Commercial Disclosure & Data",
      "commerce-disclosure"
    ],
    "featured": false,
    "visible": true,
    "order": 38
  },
  {
    "id": "commerce-trade-names",
    "titleAr": "خدمات الأسماء التجارية",
    "titleEn": "Trade Name Services",
    "descAr": "الاستعلام وتحديث وتعديل الأسماء التجارية المحجوزة والقائمة.",
    "descEn": "Inquire, update, and modify existing or reserved trade names.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم حجز الاسم أو رقم السجل التجاري",
    "docsEn": "Trade name reservation code or Commercial Register",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "خدمات الأسماء التجارية",
      "Trade Name Services",
      "commerce-trade-names"
    ],
    "featured": false,
    "visible": true,
    "order": 39
  },
  {
    "id": "commerce-trademarks",
    "titleAr": "خدمات العلامات التجارية",
    "titleEn": "Trademark Services",
    "descAr": "تسجيل وحماية العلامات التجارية والشعارات إلكترونياً.",
    "descEn": "Register and protect commercial trademarks and logos online.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "صورة العلامة التجارية، تفاصيل النشاط والمالك",
    "docsEn": "Image of trademark, activity and owner details",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "خدمات العلامات التجارية",
      "Trademark Services",
      "commerce-trademarks"
    ],
    "featured": false,
    "visible": true,
    "order": 40
  },
  {
    "id": "commerce-cr-docs",
    "titleAr": "استخراج وطباعة مستندات السجل",
    "titleEn": "Extract and Print CR Documents",
    "descAr": "استخراج شهادات ومستندات السجل التجاري المعتمدة إلكترونياً.",
    "descEn": "Extract certified commercial registration documents online.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري للمنشأة",
    "docsEn": "Commercial Register Number of the facility",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "استخراج وطباعة مستندات السجل",
      "Extract and Print CR Documents",
      "commerce-cr-docs"
    ],
    "featured": false,
    "visible": true,
    "order": 41
  },
  {
    "id": "commerce-annual-confirm",
    "titleAr": "التأكيد السنوي لبيانات السجل التجاري",
    "titleEn": "Annual Confirmation of CR Data",
    "descAr": "إجراء التأكيد السنوي الإلزامي لبيانات السجل التجاري عبر المركز السعودي للأعمال.",
    "descEn": "Complete mandatory annual validation of Commercial Register data via SBC.",
    "categoryId": "commerce-business",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري، الهوية الوطنية للمدير",
    "docsEn": "Commercial Register, Manager National ID",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "التأكيد السنوي لبيانات السجل التجاري",
      "Annual Confirmation of CR Data",
      "commerce-annual-confirm"
    ],
    "featured": false,
    "visible": true,
    "order": 42
  },
  {
    "id": "muni-issue-license",
    "titleAr": "إصدار الرخصة البلدية",
    "titleEn": "Issue Municipal License",
    "descAr": "إصدار رخصة بلدية فورية جديدة للنشاط التجاري والمحلات.",
    "descEn": "Issue new instant municipal license for commercial activities.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "عقد الإيجار الإلكتروني، مخطط السلامة، العنوان الوطني",
    "docsEn": "Ejar contract, safety layout, National Address",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "إصدار الرخصة البلدية",
      "Issue Municipal License",
      "muni-issue-license"
    ],
    "featured": false,
    "visible": true,
    "order": 43
  },
  {
    "id": "muni-renew-license",
    "titleAr": "تجديد الرخص",
    "titleEn": "Renew Municipal Licenses",
    "descAr": "تجديد صلاحية الرخصة البلدية للمنشأة وتحديث بياناتها.",
    "descEn": "Renew validity of facility municipal licenses and update profile.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الرخصة البلدية المراد تجديدها، عقد الإيجار الساري",
    "docsEn": "Municipal License Number to renew, active Ejar contract",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تجديد الرخص",
      "Renew Municipal Licenses",
      "muni-renew-license"
    ],
    "featured": false,
    "visible": true,
    "order": 44
  },
  {
    "id": "muni-edit-license",
    "titleAr": "تعديل الرخصة",
    "titleEn": "Modify Municipal License",
    "descAr": "تعديل بيانات أو مساحة أو فئة الرخصة البلدية القائمة.",
    "descEn": "Modify details, area, or category of the existing municipal license.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الرخصة، المستندات الداعمة للتعديل",
    "docsEn": "License Number, supporting update documents",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تعديل الرخصة",
      "Modify Municipal License",
      "muni-edit-license"
    ],
    "featured": false,
    "visible": true,
    "order": 45
  },
  {
    "id": "muni-transfer-license",
    "titleAr": "نقل ملكية الرخصة",
    "titleEn": "Transfer License Ownership",
    "descAr": "نقل ملكية الرخصة البلدية للمنشأة للمستفيد الجديد.",
    "descEn": "Transfer municipal license ownership of the facility to the new user.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري الجديد، تنازل المالك السابق",
    "docsEn": "New Commercial Register, former owner assignment",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "نقل ملكية الرخصة",
      "Transfer License Ownership",
      "muni-transfer-license"
    ],
    "featured": false,
    "visible": true,
    "order": 46
  },
  {
    "id": "muni-change-activity",
    "titleAr": "تغيير النشاط",
    "titleEn": "Change Municipal Activity",
    "descAr": "تعديل وتغيير النشاط التجاري للرخصة البلدية القائمة.",
    "descEn": "Modify and change the commercial activity of the municipal license.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الرخصة، السجل التجاري المحدث بالنشاط الجديد",
    "docsEn": "License number, updated Commercial Register",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تغيير النشاط",
      "Change Municipal Activity",
      "muni-change-activity"
    ],
    "featured": false,
    "visible": true,
    "order": 47
  },
  {
    "id": "muni-add-activity",
    "titleAr": "إضافة نشاط",
    "titleEn": "Add Municipal Activity",
    "descAr": "إضافة نشاط تجاري إضافي أو فرعي للرخصة البلدية.",
    "descEn": "Add additional or branch activity to the municipal license.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الرخصة، تفاصيل النشاط الجديد",
    "docsEn": "License number, new activity details",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إضافة نشاط",
      "Add Municipal Activity",
      "muni-add-activity"
    ],
    "featured": false,
    "visible": true,
    "order": 48
  },
  {
    "id": "muni-issue-health",
    "titleAr": "إصدار الشهادات الصحية",
    "titleEn": "Issue Health Certificates",
    "descAr": "إصدار شهادات صحية للعاملين في الأنشطة ذات العلاقة بالصحة العامة.",
    "descEn": "Issue health certificates for employees in health-related sectors.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "الفحص الطبي الساري، الهوية الوطنية أو الإقامة للعامل",
    "docsEn": "Valid medical check, National ID or Residence of worker",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "إصدار الشهادات الصحية",
      "Issue Health Certificates",
      "muni-issue-health"
    ],
    "featured": false,
    "visible": true,
    "order": 49
  },
  {
    "id": "muni-renew-health",
    "titleAr": "تجديد الشهادات الصحية للعاملين",
    "titleEn": "Renew Health Certificates",
    "descAr": "تجديد الشهادة الصحية للعامل بعد إجراء الفحص الطبي المعتمد.",
    "descEn": "Renew employee health certificate after medical exam verification.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الشهادة القديمة، الفحص الطبي الجديد",
    "docsEn": "Old certificate number, new medical check",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تجديد الشهادات الصحية للعاملين",
      "Renew Health Certificates",
      "muni-renew-health"
    ],
    "featured": false,
    "visible": true,
    "order": 50
  },
  {
    "id": "muni-sign-permit",
    "titleAr": "تصاريح اللوحات",
    "titleEn": "Signboard Permits",
    "descAr": "إصدار تصاريح لوحات المحلات التجارية الإعلانية والتعريفية.",
    "descEn": "Issue billboard or signboard permits for retail establishments.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "مقاسات اللوحة، صورة توضيحية لواجهة المحل",
    "docsEn": "Signboard dimensions, retail storefront photo",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تصاريح اللوحات",
      "Signboard Permits",
      "muni-sign-permit"
    ],
    "featured": false,
    "visible": true,
    "order": 51
  },
  {
    "id": "muni-ads-permit",
    "titleAr": "تصاريح الإعلانات",
    "titleEn": "Advertising Permits",
    "descAr": "إصدار التراخيص اللازمة للحملات الإعلانية الخارجية والترويجية.",
    "descEn": "Issue required permits for outdoor advertisement campaigns.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل الإعلان والجهة المستفيدة",
    "docsEn": "Ad copy details, beneficiary identification",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "تصاريح الإعلانات",
      "Advertising Permits",
      "muni-ads-permit"
    ],
    "featured": false,
    "visible": true,
    "order": 52
  },
  {
    "id": "muni-sidewalk-permit",
    "titleAr": "تصاريح إشغال الأرصفة",
    "titleEn": "Sidewalk Occupancy Permits",
    "descAr": "إصدار تصريح إشغال الرصيف للمحلات التجارية والمطاعم بشكل نظامي.",
    "descEn": "Issue official sidewalk occupancy permit for cafes and shops.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "كروكي الموقع، الرخصة البلدية السارية",
    "docsEn": "Site layout sketch, valid municipal license",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "تصاريح إشغال الأرصفة",
      "Sidewalk Occupancy Permits",
      "muni-sidewalk-permit"
    ],
    "featured": false,
    "visible": true,
    "order": 53
  },
  {
    "id": "muni-events-permit",
    "titleAr": "تصاريح الفعاليات",
    "titleEn": "Events Permits",
    "descAr": "إصدار تصاريح بلدية مؤقتة للفعاليات والأنشطة العامة.",
    "descEn": "Issue temporary municipal permits for public events.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "موافقة هيئة الترفيه أو الجهة المعنية، كروكي الفعالية",
    "docsEn": "Entertainment Authority approval, event layout plan",
    "completionTimeAr": "2-4 أيام عمل",
    "completionTimeEn": "2-4 أيام عمل",
    "keywords": [
      "تصاريح الفعاليات",
      "Events Permits",
      "muni-events-permit"
    ],
    "featured": false,
    "visible": true,
    "order": 54
  },
  {
    "id": "muni-commercial-locations",
    "titleAr": "خدمات المواقع والأنشطة التجارية",
    "titleEn": "Commercial Site Services",
    "descAr": "الاستعلام وتجهيز المواقع الجغرافية ومطابقة أنشطة المحلات.",
    "descEn": "Inquire and verify geographical coordinates for store activities.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "الإحداثيات الجغرافية للموقع، صك الملكية أو العقد",
    "docsEn": "Geographical coordinates, deed or rent contract",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "خدمات المواقع والأنشطة التجارية",
      "Commercial Site Services",
      "muni-commercial-locations"
    ],
    "featured": false,
    "visible": true,
    "order": 55
  },
  {
    "id": "muni-compliance",
    "titleAr": "متابعة اشتراطات النشاط",
    "titleEn": "Monitor Activity Requirements",
    "descAr": "متابعة وتحديث الاشتراطات الفنية المعتمدة للنشاط البلدي.",
    "descEn": "Monitor and update certified technical requirements of municipal activities.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "كود النشاط البلدي للمحل",
    "docsEn": "Municipal activity code of the shop",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "متابعة اشتراطات النشاط",
      "Monitor Activity Requirements",
      "muni-compliance"
    ],
    "featured": false,
    "visible": true,
    "order": 56
  },
  {
    "id": "muni-resolve-notes",
    "titleAr": "معالجة الملاحظات والطلبات",
    "titleEn": "Resolve Municipal Inquiries & Demands",
    "descAr": "معالجة ومتابعة الطلبات الموقوفة أو الملاحظات الفنية في بلدي.",
    "descEn": "Address and process suspended municipal requests and technical feedback.",
    "categoryId": "municipality-balady",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الطلب البلدي، تفاصيل الملاحظة الفنية",
    "docsEn": "Municipal request number, technical feedback details",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "معالجة الملاحظات والطلبات",
      "Resolve Municipal Inquiries & Demands",
      "muni-resolve-notes"
    ],
    "featured": false,
    "visible": true,
    "order": 57
  },
  {
    "id": "safety-issue-permit",
    "titleAr": "إصدار رخصة السلامة",
    "titleEn": "Issue Safety License",
    "descAr": "إصدار رخصة الدفاع المدني والسلامة للمحلات والمستودعات.",
    "descEn": "Issue Civil Defense safety license for retail shops and warehouses.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "تقرير فني من مكتب هندسي معتمد، فاتورة أدوات السلامة",
    "docsEn": "Technical report from certified engineering firm, safety equipment invoice",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "إصدار رخصة السلامة",
      "Issue Safety License",
      "safety-issue-permit"
    ],
    "featured": false,
    "visible": true,
    "order": 58
  },
  {
    "id": "safety-requirements",
    "titleAr": "متطلبات السلامة للمنشآت",
    "titleEn": "Facility Safety Requirements",
    "descAr": "تجهيز ودراسة وتوفير الاشتراطات الفنية للدفاع المدني.",
    "descEn": "Prepare, study, and execute technical specifications of Civil Defense.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "كروكي المحل، نوع النشاط التجاري",
    "docsEn": "Store layout sketch, commercial activity type",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "متطلبات السلامة للمنشآت",
      "Facility Safety Requirements",
      "safety-requirements"
    ],
    "featured": false,
    "visible": true,
    "order": 59
  },
  {
    "id": "safety-track-requests",
    "titleAr": "متابعة طلبات السلامة",
    "titleEn": "Track Safety Requests",
    "descAr": "متابعة الطلبات المرفوعة في بوابة سلامة للدفاع المدني.",
    "descEn": "Follow up on requests submitted in the Salamah Civil Defense portal.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "رقم طلب بوابة سلامة",
    "docsEn": "Salamah portal request code",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "متابعة طلبات السلامة",
      "Track Safety Requests",
      "safety-track-requests"
    ],
    "featured": false,
    "visible": true,
    "order": 60
  },
  {
    "id": "safety-tech-reports",
    "titleAr": "التقارير الفنية المتعلقة بالسلامة",
    "titleEn": "Safety Technical Reports",
    "descAr": "إصدار التقارير الفنية المعتمدة لأجهزة ومخارج السلامة للمحلات.",
    "descEn": "Issue certified technical reports for safety systems and exits.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "زيارة معاينة ميدانية للموقع",
    "docsEn": "Field inspection visit details",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "التقارير الفنية المتعلقة بالسلامة",
      "Safety Technical Reports",
      "safety-tech-reports"
    ],
    "featured": false,
    "visible": true,
    "order": 61
  },
  {
    "id": "safety-equipment-setup",
    "titleAr": "تجهيز متطلبات السلامة",
    "titleEn": "Prepare Safety Requirements",
    "descAr": "المساعدة في تجهيز وتوفير طفايات الحريق وصناديق الإسعاف واللوحات الإرشادية للمحلات.",
    "descEn": "Assistance in providing fire extinguishers, first aid kits, and signs.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "قائمة أدوات السلامة المطلوبة بحسب المساحة والنشاط",
    "docsEn": "Required safety tools list based on area and activity",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "تجهيز متطلبات السلامة",
      "Prepare Safety Requirements",
      "safety-equipment-setup"
    ],
    "featured": false,
    "visible": true,
    "order": 62
  },
  {
    "id": "safety-docs-setup",
    "titleAr": "تجهيز المستندات",
    "titleEn": "Prepare Safety Documents",
    "descAr": "إعداد وتجهيز مستندات وعقود الصيانة المعتمدة للسلامة.",
    "descEn": "Compile and prepare certified maintenance contracts for safety.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري، رخصة البلدية",
    "docsEn": "Commercial Register, Municipal License",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تجهيز المستندات",
      "Prepare Safety Documents",
      "safety-docs-setup"
    ],
    "featured": false,
    "visible": true,
    "order": 63
  },
  {
    "id": "safety-inspections",
    "titleAr": "متابعة الزيارات والمعاينات",
    "titleEn": "Follow Up on Inspections",
    "descAr": "تنسيق ومتابعة مواعيد زيارات مفتشي الدفاع المدني للموقع.",
    "descEn": "Coordinate and follow up on Civil Defense field inspection schedules.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "عنوان المنشأة ورقم الاتصال للمسؤول عن الموقع",
    "docsEn": "Facility address and site manager contact info",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "متابعة الزيارات والمعاينات",
      "Follow Up on Inspections",
      "safety-inspections"
    ],
    "featured": false,
    "visible": true,
    "order": 64
  },
  {
    "id": "safety-resolve-notes",
    "titleAr": "معالجة الملاحظات",
    "titleEn": "Resolve Safety Remarks",
    "descAr": "حل ومعالجة الملاحظات الفنية المسجلة من قبل الدفاع المدني.",
    "descEn": "Address and resolve technical notes registered by Civil Defense inspectors.",
    "categoryId": "civil-defense",
    "price": "حسب الاتفاق",
    "docsAr": "نسخة من محضر ملاحظات الدفاع المدني",
    "docsEn": "Copy of Civil Defense inspection remark report",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "معالجة الملاحظات",
      "Resolve Safety Remarks",
      "safety-resolve-notes"
    ],
    "featured": false,
    "visible": true,
    "order": 65
  },
  {
    "id": "zatca-register-zakat",
    "titleAr": "التسجيل في الزكاة",
    "titleEn": "Register in Zakat",
    "descAr": "فتح ملف المنشأة والتسجيل لدى الهيئة العامة للزكاة والضريبة والجمارك.",
    "descEn": "Create profile and register in ZATCA for zakat filings.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، عقد التأسيس، العنوان الوطني",
    "docsEn": "Commercial Register, Articles of Assoc, National Address",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "التسجيل في الزكاة",
      "Register in Zakat",
      "zatca-register-zakat"
    ],
    "featured": false,
    "visible": true,
    "order": 66
  },
  {
    "id": "zatca-register-vat",
    "titleAr": "التسجيل في ضريبة القيمة المضافة",
    "titleEn": "Register in VAT",
    "descAr": "التسجيل الإلزامى أو الاختياري في ضريبة القيمة المضافة (VAT).",
    "descEn": "Mandatory or voluntary registration in Value Added Tax (VAT).",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، مستند يوضح المبيعات السنوية المتوقعة أو الفعلية",
    "docsEn": "Commercial Register, statement showing annual sales figures",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "التسجيل في ضريبة القيمة المضافة",
      "Register in VAT",
      "zatca-register-vat"
    ],
    "featured": false,
    "visible": true,
    "order": 67
  },
  {
    "id": "zatca-update-profile",
    "titleAr": "تعديل بيانات المنشأة",
    "titleEn": "Modify ZATCA Profile Data",
    "descAr": "تحديث وتعديل البيانات القانونية للمنشأة في هيئة الزكاة.",
    "descEn": "Update and modify legal profile details of the facility at ZATCA.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري المعدل، الهوية الوطنية للمدير",
    "docsEn": "Modified Commercial Register, Manager National ID",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تعديل بيانات المنشأة",
      "Modify ZATCA Profile Data",
      "zatca-update-profile"
    ],
    "featured": false,
    "visible": true,
    "order": 68
  },
  {
    "id": "zatca-vat-returns",
    "titleAr": "تقديم الإقرارات الضريبية",
    "titleEn": "Submit VAT Returns",
    "descAr": "إعداد وتقديم الإقرارات الدورية لضريبة القيمة المضافة بشكل نظامي.",
    "descEn": "Prepare and submit periodic VAT return filings in compliance with ZATCA.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "كشوفات فواتير المبيعات والمشتريات خلال الفترة الضريبية",
    "docsEn": "Sales and purchases invoices reports for the tax period",
    "completionTimeAr": "1-3 أيام عمل",
    "completionTimeEn": "1-3 أيام عمل",
    "keywords": [
      "تقديم الإقرارات الضريبية",
      "Submit VAT Returns",
      "zatca-vat-returns"
    ],
    "featured": false,
    "visible": true,
    "order": 69
  },
  {
    "id": "zatca-zakat-returns",
    "titleAr": "تقديم الإقرارات الزكوية",
    "titleEn": "Submit Zakat Returns",
    "descAr": "إعداد وتقديم الإقرارات الزكوية السنوية للمؤسسات والشركات.",
    "descEn": "Prepare and submit annual zakat return filings for entities.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "الحسابات الختامية السنوية، كشف الأرباح والخسائر للمنشأة",
    "docsEn": "Annual financial accounts, profit and loss report of the facility",
    "completionTimeAr": "2-4 أيام عمل",
    "completionTimeEn": "2-4 أيام عمل",
    "keywords": [
      "تقديم الإقرارات الزكوية",
      "Submit Zakat Returns",
      "zatca-zakat-returns"
    ],
    "featured": false,
    "visible": true,
    "order": 70
  },
  {
    "id": "zatca-certificates",
    "titleAr": "الشهادات الزكوية والضريبية",
    "titleEn": "Zakat & Tax Certificates",
    "descAr": "إصدار واستخراج شهادة الزكاة والضريبة والجمارك الرسمية السارية.",
    "descEn": "Issue and extract official active Zakat and Tax certificates.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "سداد المستحقات والالتزامات للضريبة أو الزكاة",
    "docsEn": "Settlement of tax or zakat obligations",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "الشهادات الزكوية والضريبية",
      "Zakat & Tax Certificates",
      "zatca-certificates"
    ],
    "featured": false,
    "visible": true,
    "order": 71
  },
  {
    "id": "zatca-e-invoicing",
    "titleAr": "الفوترة الإلكترونية",
    "titleEn": "Electronic Invoicing (Fatoora)",
    "descAr": "المساعدة في إعداد وتطبيق نظام الفوترة الإلكترونية (فاتورة) للمنشآت.",
    "descEn": "Assistance in setting up and implementing ZATCA Electronic Invoicing.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات نظام المحاسبة والفوترة المستخدم",
    "docsEn": "Details of accounting and invoicing software used",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "الفوترة الإلكترونية",
      "Electronic Invoicing (Fatoora)",
      "zatca-e-invoicing"
    ],
    "featured": false,
    "visible": true,
    "order": 72
  },
  {
    "id": "zatca-tin-number",
    "titleAr": "الرقم المميز",
    "titleEn": "Get Tax Identification Number (TIN)",
    "descAr": "إصدار واستخراج الرقم المميز (TIN) الضريبي للمنشآت.",
    "descEn": "Issue and extract Tax Identification Number (TIN) for enterprises.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، عقد التأسيس للمنشأة",
    "docsEn": "Commercial Register, Articles of Association",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الرقم المميز",
      "Get Tax Identification Number (TIN)",
      "zatca-tin-number"
    ],
    "featured": false,
    "visible": true,
    "order": 73
  },
  {
    "id": "zatca-corporate-services",
    "titleAr": "خدمات المنشآت لدى هيئة الزكاة والضريبة والجمارك",
    "titleEn": "ZATCA Corporate Services",
    "descAr": "متابعة وإدارة ملفات المنشآت الكبرى والمتوسطة وتطبيقات الجمارك.",
    "descEn": "Follow up and manage big and medium facility profiles at ZATCA.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "التفويض الرسمي، رقم المنشأة الموحد",
    "docsEn": "Official authorization, unified facility number",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات المنشآت لدى هيئة الزكاة والضريبة والجمارك",
      "ZATCA Corporate Services",
      "zatca-corporate-services"
    ],
    "featured": false,
    "visible": true,
    "order": 74
  },
  {
    "id": "zatca-claims",
    "titleAr": "متابعة المطالبات",
    "titleEn": "Follow Up on Tax Claims",
    "descAr": "متابعة المطالبات والاستردادات الضريبية والمالية مع هيئة الزكاة.",
    "descEn": "Follow up on tax claims, refunds, and financial queries with ZATCA.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "مستندات وتفاصيل الفواتير والمدفوعات الزائدة",
    "docsEn": "Invoices and documents showing surplus payments",
    "completionTimeAr": "2-4 أيام عمل",
    "completionTimeEn": "2-4 أيام عمل",
    "keywords": [
      "متابعة المطالبات",
      "Follow Up on Tax Claims",
      "zatca-claims"
    ],
    "featured": false,
    "visible": true,
    "order": 75
  },
  {
    "id": "zatca-penalties",
    "titleAr": "متابعة المخالفات",
    "titleEn": "Follow Up on Tax Violations",
    "descAr": "مراجعة وتسوية المخالفات الضريبية أو الغرامات غير المسددة.",
    "descEn": "Review and settle tax violations or unpaid penalty charges.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "رقم إشعار المخالفة أو الغرامة، السجل التجاري",
    "docsEn": "Violation notice number, Commercial Register",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "متابعة المخالفات",
      "Follow Up on Tax Violations",
      "zatca-penalties"
    ],
    "featured": false,
    "visible": true,
    "order": 76
  },
  {
    "id": "zatca-objections",
    "titleAr": "الاعتراضات والتسويات عندما تكون خدمة متاحة ومناسبة",
    "titleEn": "Objections & Settle Disputes",
    "descAr": "إعداد وتقديم طلبات الاعتراض على قرارات الربط الزكوي أو الضريبي.",
    "descEn": "Prepare and submit objection requests against ZATCA tax decisions.",
    "categoryId": "zatca",
    "price": "حسب الاتفاق",
    "docsAr": "قرار الربط الصادر، مذكرة الدفوع القانونية والمحاسبية",
    "docsEn": "ZATCA assessment letter, legal and accounting defense statement",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "الاعتراضات والتسويات عندما تكون خدمة متاحة ومناسبة",
      "Objections & Settle Disputes",
      "zatca-objections"
    ],
    "featured": false,
    "visible": true,
    "order": 77
  },
  {
    "id": "gosi-register-company",
    "titleAr": "تسجيل المنشأة",
    "titleEn": "Register Establishment in GOSI",
    "descAr": "فتح وتفعيل ملف اشتراك للمنشأة لدى المؤسسة العامة للتأمينات الاجتماعية.",
    "descEn": "Open and activate insurance subscription file for entity in GOSI.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، تفاصيل العنوان الوطني",
    "docsEn": "Commercial Register, National Address details",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تسجيل المنشأة",
      "Register Establishment in GOSI",
      "gosi-register-company"
    ],
    "featured": false,
    "visible": true,
    "order": 78
  },
  {
    "id": "gosi-add-employee",
    "titleAr": "إضافة المشتركين",
    "titleEn": "Add Subscribers (Employees)",
    "descAr": "إضافة وتسجيل الموظفين السعوديين والوافدين في ملف التأمينات الاجتماعية.",
    "descEn": "Register Saudi and foreign workers under the establishment's GOSI file.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "الهوية الوطنية أو الإقامة، تاريخ الالتحاق بالعمل، الراتب الأساسي",
    "docsEn": "National ID or Residence, hiring date, basic salary",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إضافة المشتركين",
      "Add Subscribers (Employees)",
      "gosi-add-employee"
    ],
    "featured": false,
    "visible": true,
    "order": 79
  },
  {
    "id": "gosi-remove-employee",
    "titleAr": "استبعاد المشتركين",
    "titleEn": "Exclude Subscribers (Terminate)",
    "descAr": "استبعاد أو إنهاء اشتراك الموظف في التأمينات عند نهاية الخدمة.",
    "descEn": "Remove or terminate employee's subscription in GOSI at end of service.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "الهوية الوطنية أو الإقامة، تاريخ انتهاء العلاقة التعاقدية",
    "docsEn": "National ID or Residence, contract termination date",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "استبعاد المشتركين",
      "Exclude Subscribers (Terminate)",
      "gosi-remove-employee"
    ],
    "featured": false,
    "visible": true,
    "order": 80
  },
  {
    "id": "gosi-modify-salaries",
    "titleAr": "تعديل الأجور",
    "titleEn": "Modify Employee Wages",
    "descAr": "تعديل وتحديث الأجور الشهرية والبدلات للمشتركين للتحديث السنوي.",
    "descEn": "Update monthly basic wages and allowances of subscribers in GOSI.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "العقد المحدث، تفاصيل الراتب الجديد والبدلات",
    "docsEn": "Updated contract, new salary breakdown",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تعديل الأجور",
      "Modify Employee Wages",
      "gosi-modify-salaries"
    ],
    "featured": false,
    "visible": true,
    "order": 81
  },
  {
    "id": "gosi-modify-subscriber",
    "titleAr": "تعديل بيانات المشترك",
    "titleEn": "Modify Subscriber Profile Data",
    "descAr": "تعديل البيانات الشخصية أو العلمية أو المسمى الوظيفي للمشترك.",
    "descEn": "Modify personal, academic, or professional details of the subscriber.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "صورة الهوية الوطنية أو الإقامة، إثباتات المؤهلات",
    "docsEn": "National ID or Residence card, qualification proofs",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تعديل بيانات المشترك",
      "Modify Subscriber Profile Data",
      "gosi-modify-subscriber"
    ],
    "featured": false,
    "visible": true,
    "order": 82
  },
  {
    "id": "gosi-track-payments",
    "titleAr": "متابعة الاشتراكات",
    "titleEn": "Follow Up Subscriptions",
    "descAr": "متابعة وتسوية الفواتير الشهرية والمدفوعات والمستحقات للتأمينات.",
    "descEn": "Follow up on monthly subscription bills, dues, and payments.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "رقم اشتراك المنشأة في التأمينات",
    "docsEn": "GOSI establishment registration number",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "متابعة الاشتراكات",
      "Follow Up Subscriptions",
      "gosi-track-payments"
    ],
    "featured": false,
    "visible": true,
    "order": 83
  },
  {
    "id": "gosi-certificates",
    "titleAr": "استخراج الشهادات",
    "titleEn": "Extract GOSI Certificates",
    "descAr": "استخراج شهادة التأمينات الاجتماعية الرسمية والخلو من الغرامات.",
    "descEn": "Extract official certified GOSI subscription and clearance certificates.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "رقم اشتراك المنشأة",
    "docsEn": "GOSI registration number",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "استخراج الشهادات",
      "Extract GOSI Certificates",
      "gosi-certificates"
    ],
    "featured": false,
    "visible": true,
    "order": 84
  },
  {
    "id": "gosi-salary-file",
    "titleAr": "ملف الأجور",
    "titleEn": "Salary File Services",
    "descAr": "المساعدة في رفع وتحديث ملف الأجور الشهري المعتمد للموظفين.",
    "descEn": "Assistance in uploading and updating monthly salary files.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "ملف الإكسيل المعتمد لبيانات الرواتب والموظفين",
    "docsEn": "Certified Excel template of salary breakdown",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "ملف الأجور",
      "Salary File Services",
      "gosi-salary-file"
    ],
    "featured": false,
    "visible": true,
    "order": 85
  },
  {
    "id": "gosi-mudad-integration",
    "titleAr": "خدمات مدد المرتبطة بالأجور",
    "titleEn": "Mudad Platform Wage Protection",
    "descAr": "ربط وإدارة ملف الأجور ونظام حماية الأجور عبر منصة مدد المعتمدة.",
    "descEn": "Connect and manage wage protection system files via Mudad platform.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات المنشأة، حساب البنك التجاري المربوط",
    "docsEn": "Facility profile details, linked commercial bank account",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات مدد المرتبطة بالأجور",
      "Mudad Platform Wage Protection",
      "gosi-mudad-integration"
    ],
    "featured": false,
    "visible": true,
    "order": 86
  },
  {
    "id": "gosi-resolve-requests",
    "titleAr": "معالجة الملاحظات والطلبات",
    "titleEn": "Resolve GOSI Remarks & Queries",
    "descAr": "حل ومتابعة الاعتراضات والملاحظات المتعلقة بنسب الاشتراك والقرارات.",
    "descEn": "Resolve GOSI remarks, audits, and objections on subscription rates.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "رقم المعاملة، المستندات الداعمة للمراجعة",
    "docsEn": "Transaction number, supporting check documents",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "معالجة الملاحظات والطلبات",
      "Resolve GOSI Remarks & Queries",
      "gosi-resolve-requests"
    ],
    "featured": false,
    "visible": true,
    "order": 87
  },
  {
    "id": "gosi-manage-users",
    "titleAr": "إدارة مستخدمي المنشأة",
    "titleEn": "Manage GOSI Portal Users",
    "descAr": "إضافة وتعديل المفوضين والمدراء الممثلين للمنشأة في البوابة.",
    "descEn": "Add or edit authorized managers representing the facility in GOSI.",
    "categoryId": "gosi",
    "price": "حسب الاتفاق",
    "docsAr": "التفويض الرسمي للشركة، رقم الهوية الوطنية للمدير الجديد",
    "docsEn": "Official company authorization, National ID of new manager",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "إدارة مستخدمي المنشأة",
      "Manage GOSI Portal Users",
      "gosi-manage-users"
    ],
    "featured": false,
    "visible": true,
    "order": 88
  },
  {
    "id": "absher-issue-iqama",
    "titleAr": "إصدار الإقامة",
    "titleEn": "Issue Iqama",
    "descAr": "إصدار هوية مقيم جديدة للعمالة الوافدة للمرة الأولى.",
    "descEn": "Issue new resident identity card (Iqama) for foreign workers.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الحدود، نتيجة الفحص الطبي، سداد الرسوم والتأمين",
    "docsEn": "Border Number, medical check result, fees & insurance payment",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "إصدار الإقامة",
      "Issue Iqama",
      "absher-issue-iqama"
    ],
    "featured": false,
    "visible": true,
    "order": 89
  },
  {
    "id": "absher-renew-iqama",
    "titleAr": "تجديد الإقامة",
    "titleEn": "Renew Iqama",
    "descAr": "تجديد صلاحية هوية المقيم (الإقامة) للعمالة لتجنب الغرامات.",
    "descEn": "Renew residency (Iqama) validity for expatriate employees.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "سداد الرسوم والضمان الاجتماعي الطبي المعتمد، الإقامة الحالية",
    "docsEn": "Payment of fees & medical insurance, current Iqama details",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تجديد الإقامة",
      "Renew Iqama",
      "absher-renew-iqama"
    ],
    "featured": false,
    "visible": true,
    "order": 90
  },
  {
    "id": "absher-transfer-services",
    "titleAr": "نقل الخدمات حسب الصلاحيات",
    "titleEn": "Transfer Residency Services",
    "descAr": "إكمال معاملات نقل خدمات المقيمين عبر أبشر وتحديث سجل الجوازات.",
    "descEn": "Complete resident sponsorship transfers via Absher & Passports.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "موافقة الكفيل السابق والمستفيد الجديد، بيانات الإقامة",
    "docsEn": "Consent of former sponsor & new user, Iqama details",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "نقل الخدمات حسب الصلاحيات",
      "Transfer Residency Services",
      "absher-transfer-services"
    ],
    "featured": false,
    "visible": true,
    "order": 91
  },
  {
    "id": "absher-exit-reentry-issue",
    "titleAr": "إصدار تأشيرة خروج وعودة",
    "titleEn": "Issue Exit/Re-entry Visa",
    "descAr": "إصدار تأشيرة الخروج والعودة (مفردة أو متعددة) للمقيمين.",
    "descEn": "Issue single or multiple exit/re-entry visas for residents.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "سداد رسوم التأشيرة الحكومية، إقامة سارية المفعول للمستفيد",
    "docsEn": "Government visa fee payment, valid Iqama of applicant",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إصدار تأشيرة خروج وعودة",
      "Issue Exit/Re-entry Visa",
      "absher-exit-reentry-issue"
    ],
    "featured": false,
    "visible": true,
    "order": 92
  },
  {
    "id": "absher-exit-reentry-cancel",
    "titleAr": "إلغاء تأشيرة خروج وعودة",
    "titleEn": "Cancel Exit/Re-entry Visa",
    "descAr": "إلغاء تأشيرة خروج وعودة قائمة وغير مستخدمة لتجنب الغرامات.",
    "descEn": "Cancel active unused exit/re-entry visa to avoid penalty charges.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الإقامة، تفاصيل التأشيرة الصادرة",
    "docsEn": "Iqama Number, details of issued visa",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إلغاء تأشيرة خروج وعودة",
      "Cancel Exit/Re-entry Visa",
      "absher-exit-reentry-cancel"
    ],
    "featured": false,
    "visible": true,
    "order": 93
  },
  {
    "id": "absher-final-exit-issue",
    "titleAr": "إصدار خروج نهائي",
    "titleEn": "Issue Final Exit Visa",
    "descAr": "إصدار تأشيرة خروج نهائي للمقيمين عند مغادرة المملكة.",
    "descEn": "Issue final exit visa for residents leaving the Kingdom permanently.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "سجل خلو من المخالفات المرورية، إقامة سارية، جواز سفر ساري",
    "docsEn": "Traffic violation clearance, valid Iqama, valid passport",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إصدار خروج نهائي",
      "Issue Final Exit Visa",
      "absher-final-exit-issue"
    ],
    "featured": false,
    "visible": true,
    "order": 94
  },
  {
    "id": "absher-final-exit-cancel",
    "titleAr": "إلغاء خروج نهائي",
    "titleEn": "Cancel Final Exit Visa",
    "descAr": "إلغاء تأشيرة الخروج النهائي المصدرة للعمالة قبل مغادرة المملكة.",
    "descEn": "Cancel issued final exit visa before employee leaves the country.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الإقامة، جواز سفر الموظف ساري المفعول",
    "docsEn": "Iqama Number, valid passport of employee",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إلغاء خروج نهائي",
      "Cancel Final Exit Visa",
      "absher-final-exit-cancel"
    ],
    "featured": false,
    "visible": true,
    "order": 95
  },
  {
    "id": "absher-modify-profession-res",
    "titleAr": "تعديل المهنة حسب الصلاحيات",
    "titleEn": "Modify Resident Profession",
    "descAr": "تعديل المهنة الرسمية للمقيم في هوية مقيم (الإقامة).",
    "descEn": "Update the official profession title printed on the resident card.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "موافقة وزارة الموارد البشرية، المؤهل العلمي المعتمد",
    "docsEn": "Ministry approval, accredited scientific degree certificate",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تعديل المهنة حسب الصلاحيات",
      "Modify Resident Profession",
      "absher-modify-profession-res"
    ],
    "featured": false,
    "visible": true,
    "order": 96
  },
  {
    "id": "absher-residents-services",
    "titleAr": "خدمات المقيمين",
    "titleEn": "Resident Services Services",
    "descAr": "الاستعلام وحل المعاملات والطلبات والملاحظات المرتبطة بالمقيمين.",
    "descEn": "Inquire and resolve issues, requests, and remarks for residents.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الإقامة أو جواز السفر للمستفيد",
    "docsEn": "Iqama or Passport Number of the applicant",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات المقيمين",
      "Resident Services Services",
      "absher-residents-services"
    ],
    "featured": false,
    "visible": true,
    "order": 97
  },
  {
    "id": "absher-dependents",
    "titleAr": "خدمات أفراد الأسرة",
    "titleEn": "Family Members Services",
    "descAr": "إصدار وتجديد وإلغاء إقامات أفراد الأسرة والتابعين للمقيمين.",
    "descEn": "Issue, renew, and cancel residency IDs of family dependents.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "عقد النكاح أو شهادات الميلاد، الفحص الطبي للتابعين",
    "docsEn": "Marriage certificate or birth certificates, medical check",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات أفراد الأسرة",
      "Family Members Services",
      "absher-dependents"
    ],
    "featured": false,
    "visible": true,
    "order": 98
  },
  {
    "id": "absher-inquire-status",
    "titleAr": "الاستعلام عن حالة الإقامة والتأشيرات",
    "titleEn": "Inquire Residency & Visas Status",
    "descAr": "الاستعلام الإلكتروني عن صلاحية وتواريخ انتهاء الإقامات والتأشيرات.",
    "descEn": "Query validity and expiry dates of residencies and visas online.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الإقامة أو رقم الحدود للمستعلم عنه",
    "docsEn": "Iqama or Border Number of search target",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الاستعلام عن حالة الإقامة والتأشيرات",
      "Inquire Residency & Visas Status",
      "absher-inquire-status"
    ],
    "featured": false,
    "visible": true,
    "order": 99
  },
  {
    "id": "absher-business-delegation",
    "titleAr": "تفاويض أبشر أعمال",
    "titleEn": "Absher Business Delegations",
    "descAr": "إصدار وتحديث تفاويض الممثلين والمدراء في منصة أبشر أعمال.",
    "descEn": "Issue and update representative delegations in Absher Business.",
    "categoryId": "absher-passports",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، الهوية الوطنية للمثل المفوض",
    "docsEn": "Commercial Register, National ID of delegated representative",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تفاويض أبشر أعمال",
      "Absher Business Delegations",
      "absher-business-delegation"
    ],
    "featured": false,
    "visible": true,
    "order": 100
  },
  {
    "id": "mofa-visit-requests",
    "titleAr": "طلبات الزيارة",
    "titleEn": "Visit Visa Requests",
    "descAr": "تقديم وتوثيق طلبات الزيارة العائلية أو التجارية عبر الخارجية.",
    "descEn": "Submit and certify family or business visit visas via MOFA.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "الإقامة للمستضيف، صك القرابة العائلية أو السجل التجاري",
    "docsEn": "Host residency ID, kinship proof or Commercial Register",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "طلبات الزيارة",
      "Visit Visa Requests",
      "mofa-visit-requests"
    ],
    "featured": false,
    "visible": true,
    "order": 101
  },
  {
    "id": "mofa-track-visas",
    "titleAr": "متابعة طلبات التأشيرات",
    "titleEn": "Track Visa Requests",
    "descAr": "متابعة وحل الملاحظات على تأشيرات الزيارة المقدمة للخارجية.",
    "descEn": "Follow up and resolve remarks on visit visa requests submitted.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "رقم طلب الزيارة بالخارجية",
    "docsEn": "MOFA visit visa request code",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "متابعة طلبات التأشيرات",
      "Track Visa Requests",
      "mofa-track-visas"
    ],
    "featured": false,
    "visible": true,
    "order": 102
  },
  {
    "id": "mofa-e-delegation",
    "titleAr": "التفويض الإلكتروني",
    "titleEn": "Electronic Visa Delegation",
    "descAr": "إصدار تفويض إلكتروني على تأشيرات العمل لمكاتب الاستقدام بالخارج.",
    "descEn": "Issue digital visa delegations for overseas recruitment agencies.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "رقم التأشيرة الصادرة، اسم وكالة الاستقدام المعتمدة",
    "docsEn": "Issued visa code, name of certified recruitment agency",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "التفويض الإلكتروني",
      "Electronic Visa Delegation",
      "mofa-e-delegation"
    ],
    "featured": false,
    "visible": true,
    "order": 103
  },
  {
    "id": "mofa-visa-services",
    "titleAr": "خدمات التأشيرات",
    "titleEn": "Visa Services Services",
    "descAr": "مراجعة وتحديث معاملات الاستقدام والتأشيرات عبر الخارجية.",
    "descEn": "Review and update recruitment and visa transactions via MOFA.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "أوراق المعاملة وتفاصيل الطلب بالخارجية",
    "docsEn": "Transaction documents and MOFA request details",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "خدمات التأشيرات",
      "Visa Services Services",
      "mofa-visa-services"
    ],
    "featured": false,
    "visible": true,
    "order": 104
  },
  {
    "id": "mofa-extend-visit",
    "titleAr": "تمديد الزيارة حسب الحالة",
    "titleEn": "Extend Visit Visa",
    "descAr": "تقديم طلبات تمديد صلاحية تأشيرة الزيارة العائلية أو التجارية.",
    "descEn": "Submit requests to extend family or business visit visa validity.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "تأمين طبي ساري للزائر، جواز السفر وتأشيرة الزيارة الحالية",
    "docsEn": "Valid medical insurance for visitor, passport & active visa",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تمديد الزيارة حسب الحالة",
      "Extend Visit Visa",
      "mofa-extend-visit"
    ],
    "featured": false,
    "visible": true,
    "order": 105
  },
  {
    "id": "mofa-document-cert",
    "titleAr": "تصديق الوثائق",
    "titleEn": "Document Attestation",
    "descAr": "تصديق الشهادات والوكالات والعقود من فروع وزارة الخارجية بالمملكة.",
    "descEn": "Attest educational certificates, POAs, and contracts at MOFA.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "المستند الأصلي المراد تصديقه، الهوية الوطنية للمستفيد",
    "docsEn": "Original document to attest, National ID of applicant",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تصديق الوثائق",
      "Document Attestation",
      "mofa-document-cert"
    ],
    "featured": false,
    "visible": true,
    "order": 106
  },
  {
    "id": "mofa-track-transactions",
    "titleAr": "متابعة الطلبات والمعاملات",
    "titleEn": "Follow Up MOFA Applications",
    "descAr": "متابعة إنهاء المعاملات الدبلوماسية والقنصلية لدى الخارجية.",
    "descEn": "Follow up and finalize consular or diplomatic requests with MOFA.",
    "categoryId": "mofa-visas",
    "price": "حسب الاتفاق",
    "docsAr": "رقم المعاملة أو الطلب الإلكتروني الصادر",
    "docsEn": "Transaction number or issued digital request code",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "متابعة الطلبات والمعاملات",
      "Follow Up MOFA Applications",
      "mofa-track-transactions"
    ],
    "featured": false,
    "visible": true,
    "order": 107
  },
  {
    "id": "najiz-issue-poa",
    "titleAr": "إصدار الوكالات الإلكترونية",
    "titleEn": "Issue Electronic POAs",
    "descAr": "إصدار وكالة شرعية إلكترونية معتمدة وفورية عبر بوابة ناجز.",
    "descEn": "Issue certified judicial power of attorney instantly via Najiz.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "الهوية الوطنية للموكل والوكيل، بنود الوكالة المحددة",
    "docsEn": "National IDs of principal and agent, selected POA terms",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إصدار الوكالات الإلكترونية",
      "Issue Electronic POAs",
      "najiz-issue-poa"
    ],
    "featured": false,
    "visible": true,
    "order": 108
  },
  {
    "id": "najiz-cancel-poa",
    "titleAr": "فسخ الوكالة",
    "titleEn": "Revoke Power of Attorney",
    "descAr": "إلغاء وفسخ الوكالات الشرعية الإلكترونية القائمة.",
    "descEn": "Cancel and revoke active electronic judicial POAs.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الوكالة المراد فسخها، الهوية الوطنية للموكل",
    "docsEn": "POA Number to revoke, National ID of principal",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "فسخ الوكالة",
      "Revoke Power of Attorney",
      "najiz-cancel-poa"
    ],
    "featured": false,
    "visible": true,
    "order": 109
  },
  {
    "id": "najiz-verify-poa",
    "titleAr": "التحقق من الوكالات",
    "titleEn": "Verify Validity of POAs",
    "descAr": "التحقق والاستعلام عن سريان وصلاحية الوكالة الشرعية.",
    "descEn": "Verify and query active status and validity of judicial POAs.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الوكالة، رقم هوية الموكل",
    "docsEn": "POA Number, National ID of principal",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "التحقق من الوكالات",
      "Verify Validity of POAs",
      "najiz-verify-poa"
    ],
    "featured": false,
    "visible": true,
    "order": 110
  },
  {
    "id": "najiz-lawsuit-file",
    "titleAr": "صحيفة الدعوى",
    "titleEn": "Submit Statement of Claim",
    "descAr": "إعداد ورفع صحيفة الدعوى القضائية عبر بوابة ناجز لوزارة العدل.",
    "descEn": "Prepare and file statement of claim via Najiz portal.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل المدعي والمدعى عليه، مستندات القضية والأسانيد",
    "docsEn": "Plaintiff & Defendant details, supporting lawsuit evidence files",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "صحيفة الدعوى",
      "Submit Statement of Claim",
      "najiz-lawsuit-file"
    ],
    "featured": false,
    "visible": true,
    "order": 111
  },
  {
    "id": "najiz-track-lawsuits",
    "titleAr": "تقديم ومتابعة القضايا المتاحة إلكترونيًا",
    "titleEn": "File & Follow Up Lawsuits",
    "descAr": "متابعة تحديثات الجلسات القضائية وتقديم المذكرات الجوابية.",
    "descEn": "Follow up court session updates and submit response memos.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "رقم القضية، تفويض أو وكالة سارية",
    "docsEn": "Lawsuit Number, active delegation or POA",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تقديم ومتابعة القضايا المتاحة إلكترونيًا",
      "File & Follow Up Lawsuits",
      "najiz-track-lawsuits"
    ],
    "featured": false,
    "visible": true,
    "order": 112
  },
  {
    "id": "najiz-execution-req",
    "titleAr": "طلبات التنفيذ",
    "titleEn": "Submit Execution Claims",
    "descAr": "تقديم طلبات التنفيذ لتنفيذ الأحكام القضائية وسندات الأمر.",
    "descEn": "Submit execution claims to enforce court rulings and notes.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "السند التنفيذي (حكم قضائي، سند لأمر، شيك بدون رصيد)",
    "docsEn": "Execution deed (court ruling, promissory note, bounced check)",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "طلبات التنفيذ",
      "Submit Execution Claims",
      "najiz-execution-req"
    ],
    "featured": false,
    "visible": true,
    "order": 113
  },
  {
    "id": "najiz-inquire-lawsuits",
    "titleAr": "الاستعلام عن القضايا",
    "titleEn": "Query Lawsuits Status",
    "descAr": "الاستعلام عن تفاصيل الموعد والجلسات والأحكام الصادرة.",
    "descEn": "Query details of court schedules, sessions, and issued rulings.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "رقم القضية أو الهوية الوطنية للمستعلم عنه",
    "docsEn": "Lawsuit Code or National ID of search target",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الاستعلام عن القضايا",
      "Query Lawsuits Status",
      "najiz-inquire-lawsuits"
    ],
    "featured": false,
    "visible": true,
    "order": 114
  },
  {
    "id": "najiz-appointments",
    "titleAr": "المواعيد",
    "titleEn": "Najiz Appointments",
    "descAr": "حجز مواعيد مراجعة فروع المحاكم وكتابات العدل بالمملكة.",
    "descEn": "Book in-person review appointments for court branches.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "تحديد الدائرة القضائية والمحكمة المعنية بالموعد",
    "docsEn": "Selected judicial division and target court details",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "المواعيد",
      "Najiz Appointments",
      "najiz-appointments"
    ],
    "featured": false,
    "visible": true,
    "order": 115
  },
  {
    "id": "najiz-real-estate",
    "titleAr": "الخدمات العقارية المتاحة إلكترونيًا",
    "titleEn": "Real Estate Digital Services",
    "descAr": "إفراغ وتحديث الصكوك العقارية والاستعلام عن الملكية إلكترونياً.",
    "descEn": "Update deed records and verify property ownership online.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "صورة الصك العقاري، الهوية الوطنية للملاك الحاليين",
    "docsEn": "Copy of property deed, National IDs of current owners",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "الخدمات العقارية المتاحة إلكترونيًا",
      "Real Estate Digital Services",
      "najiz-real-estate"
    ],
    "featured": false,
    "visible": true,
    "order": 116
  },
  {
    "id": "najiz-documentation",
    "titleAr": "التوثيق",
    "titleEn": "Digital Documentation Services",
    "descAr": "توثيق العقود والإفراغ وتوثيق الديون والالتزامات المالية.",
    "descEn": "Certify agreements, transfer deeds, and record financial dues.",
    "categoryId": "najiz-justice",
    "price": "حسب الاتفاق",
    "docsAr": "مستندات التعهد، موافقة الأطراف المعنية بالتوثيق",
    "docsEn": "Undertaking documents, consent of parties involved",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "التوثيق",
      "Digital Documentation Services",
      "najiz-documentation"
    ],
    "featured": false,
    "visible": true,
    "order": 117
  },
  {
    "id": "ops-waste-contracts",
    "titleAr": "عقود النظافة",
    "titleEn": "Waste Disposal Contracts",
    "descAr": "توفير وتجهيز عقود النظافة والتخلص من النفايات المعتمدة للبلدية.",
    "descEn": "Provide and prepare municipal-certified waste disposal contracts.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل مساحة المحل ونوع النشاط البلدي",
    "docsEn": "Store floor area details and municipal activity type",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "عقود النظافة",
      "Waste Disposal Contracts",
      "ops-waste-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 118
  },
  {
    "id": "ops-maintenance-contracts",
    "titleAr": "عقود الصيانة",
    "titleEn": "Maintenance Contracts",
    "descAr": "إعداد وتوقيع عقود صيانة أنظمة الحريق والسلامة والتكييف للمحلات.",
    "descEn": "Prepare and sign certified safety or AC system maintenance contracts.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل الأجهزة الحالية للموقع، الرخصة البلدية",
    "docsEn": "Details of installed equipment on site, Municipal License",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "عقود الصيانة",
      "Maintenance Contracts",
      "ops-maintenance-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 119
  },
  {
    "id": "ops-operation-contracts",
    "titleAr": "عقود التشغيل",
    "titleEn": "Operational Contracts",
    "descAr": "إعداد ومراجعة عقود تشغيل وإدارة المنشآت والمرافق التجارية.",
    "descEn": "Draft and review operational and facility management contracts.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل شروط التشغيل والشركاء",
    "docsEn": "Operational terms and partner identification details",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "عقود التشغيل",
      "Operational Contracts",
      "ops-operation-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 120
  },
  {
    "id": "ops-labor-contracts",
    "titleAr": "عقود العمل",
    "titleEn": "Employment Contracts Formatting",
    "descAr": "صياغة وتجهيز نماذج عقود العمل الداخلية للمؤسسات والشركات.",
    "descEn": "Draft internal employment contract templates for businesses.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "الهيكل التنظيمي للمؤسسة، لائحة العمل الفردية",
    "docsEn": "Establishment structure, individual working bylaws",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "عقود العمل",
      "Employment Contracts Formatting",
      "ops-labor-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 121
  },
  {
    "id": "ops-service-contracts",
    "titleAr": "عقود الخدمات",
    "titleEn": "Service Agreements Formatting",
    "descAr": "صياغة وتدقيق عقود تقديم الخدمات المهنية والتجارية للغير.",
    "descEn": "Draft and audit professional service delivery contracts.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "نطاق العمل المتفق عليه، شروط ومواعيد التسليم",
    "docsEn": "Agreed scope of work, delivery timelines & terms",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "عقود الخدمات",
      "Service Agreements Formatting",
      "ops-service-contracts"
    ],
    "featured": false,
    "visible": true,
    "order": 122
  },
  {
    "id": "ops-profile-setup",
    "titleAr": "تجهيز ملفات المنشآت",
    "titleEn": "Company Profile Setup",
    "descAr": "تجهيز وتنسيق ملفات التعريف وسيرة الأعمال للمنشآت والمؤسسات.",
    "descEn": "Compile and organize profiles and portfolios for businesses.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "قائمة الخدمات والأنشطة وشعارات الشركة",
    "docsEn": "List of services, activities, and corporate logos",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "تجهيز ملفات المنشآت",
      "Company Profile Setup",
      "ops-profile-setup"
    ],
    "featured": false,
    "visible": true,
    "order": 123
  },
  {
    "id": "ops-tech-reports",
    "titleAr": "التقارير الفنية",
    "titleEn": "Engineering Technical Reports",
    "descAr": "المساعدة في استخراج التقارير الفنية الهندسية اللازمة للرخص.",
    "descEn": "Assistance in extracting engineering reports required for licenses.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "المخطط المعماري للموقع، رخصة البلدية",
    "docsEn": "Architectural site layout sketch, Municipal License",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "التقارير الفنية",
      "Engineering Technical Reports",
      "ops-tech-reports"
    ],
    "featured": false,
    "visible": true,
    "order": 124
  },
  {
    "id": "ops-safety-files",
    "titleAr": "ملفات السلامة",
    "titleEn": "Safety Files Formatting",
    "descAr": "تنظيم وتوثيق ملفات الأمن والسلامة للمصانع والمنشآت التجارية.",
    "descEn": "Organize and document security and safety logs for factories.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "فواتير أدوات السلامة المعتمدة وعقود الصيانة",
    "docsEn": "Certified safety tool invoices and maintenance contracts",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "ملفات السلامة",
      "Safety Files Formatting",
      "ops-safety-files"
    ],
    "featured": false,
    "visible": true,
    "order": 125
  },
  {
    "id": "ops-license-prep",
    "titleAr": "تجهيز ملفات الرخص",
    "titleEn": "License Profile Preparation",
    "descAr": "تجهيز وتجميع مستندات رخص البلدية والدفاع المدني لتقديم الطلبات.",
    "descEn": "Compile and organize municipal & civil defense license application files.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، عقد الإيجار، الهوية الوطنية",
    "docsEn": "Commercial Register, Rent Contract, National ID",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تجهيز ملفات الرخص",
      "License Profile Preparation",
      "ops-license-prep"
    ],
    "featured": false,
    "visible": true,
    "order": 126
  },
  {
    "id": "ops-inspection-follow",
    "titleAr": "متابعة المعاينات والزيارات",
    "titleEn": "Follow Up Field Visits",
    "descAr": "متابعة وإرشاد المالك لاستقبال لجان التفتيش البلدية والبيئية والمطابقة.",
    "descEn": "Follow up and guide owner on municipal or environmental inspections.",
    "categoryId": "contracts-ops",
    "price": "حسب الاتفاق",
    "docsAr": "موعد الزيارة المحدد ونوع التفتيش",
    "docsEn": "Scheduled visit date and target inspection type",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "متابعة المعاينات والزيارات",
      "Follow Up Field Visits",
      "ops-inspection-follow"
    ],
    "featured": false,
    "visible": true,
    "order": 127
  },
  {
    "id": "modon-issue-license",
    "titleAr": "إصدار التراخيص",
    "titleEn": "Issue MODON Licenses",
    "descAr": "إصدار تراخيص البناء أو التشغيل أو التراخيص البيئية للمصانع في مدن.",
    "descEn": "Issue construction, operation, or environmental licenses for factories in MODON.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري الصناعي، عقد تخصيص الأرض الصناعية",
    "docsEn": "Industrial Commercial Register, land allocation contract",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "إصدار التراخيص",
      "Issue MODON Licenses",
      "modon-issue-license"
    ],
    "featured": false,
    "visible": true,
    "order": 128
  },
  {
    "id": "modon-modify-profile",
    "titleAr": "تعديل بيانات المنشأة",
    "titleEn": "Modify MODON Profile",
    "descAr": "تحديث وتعديل البيانات القانونية للمستثمر الصناعي في منصة مدن.",
    "descEn": "Update and modify industrial investor profile data in MODON.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "رقم السجل التجاري المحدث، رخصة التشغيل الصناعية",
    "docsEn": "Updated Commercial Register, industrial operation license",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "تعديل بيانات المنشأة",
      "Modify MODON Profile",
      "modon-modify-profile"
    ],
    "featured": false,
    "visible": true,
    "order": 129
  },
  {
    "id": "modon-land-services",
    "titleAr": "خدمات الأراضي الصناعية",
    "titleEn": "Industrial Land Services",
    "descAr": "متابعة طلبات استئجار الأراضي الصناعية أو توسيع المصانع.",
    "descEn": "Follow up industrial land leasing or factory expansion requests.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "دراسة الجدوى الفنية للمشروع الصناعي، المخطط المعماري",
    "docsEn": "Technical feasibility study of the industrial project, layout",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "خدمات الأراضي الصناعية",
      "Industrial Land Services",
      "modon-land-services"
    ],
    "featured": false,
    "visible": true,
    "order": 130
  },
  {
    "id": "modon-industrial-licenses",
    "titleAr": "التراخيص الصناعية",
    "titleEn": "Industrial Operating Permits",
    "descAr": "تجديد وتعديل وإصدار تراخيص التشغيل للمصانع والورش.",
    "descEn": "Renew, modify, and issue operating permits for factories and workshops.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "تقرير السلامة للدفاع المدني للموقع، شهادة إتمام البناء",
    "docsEn": "Civil defense safety report of site, building completion cert",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "التراخيص الصناعية",
      "Industrial Operating Permits",
      "modon-industrial-licenses"
    ],
    "featured": false,
    "visible": true,
    "order": 131
  },
  {
    "id": "modon-equipment-reqs",
    "titleAr": "متطلبات المعدات",
    "titleEn": "Factory Equipment Reqs",
    "descAr": "تسجيل واعتماد الآلات والمعدات الثقيلة والمولدات للمصانع.",
    "descEn": "Register and certify machinery, heavy equipment, and generators.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "فواتير ومواصفات الكتالوج الفني للمعدات المستوردة",
    "docsEn": "Invoices and technical catalog data of imported machinery",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "متطلبات المعدات",
      "Factory Equipment Reqs",
      "modon-equipment-reqs"
    ],
    "featured": false,
    "visible": true,
    "order": 132
  },
  {
    "id": "modon-specs",
    "titleAr": "المواصفات الفنية",
    "titleEn": "MODON Technical Specifications",
    "descAr": "مراجعة الاشتراطات والمواصفات الفنية للمصانع والمستودعات.",
    "descEn": "Review industrial technical requirements for factories & warehouses.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "المخطط الهندسي الإنشائي والكهربائي المعتمد",
    "docsEn": "Approved architectural, structural & electrical layouts",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "المواصفات الفنية",
      "MODON Technical Specifications",
      "modon-specs"
    ],
    "featured": false,
    "visible": true,
    "order": 133
  },
  {
    "id": "modon-tech-reports",
    "titleAr": "الملفات والتقارير الفنية",
    "titleEn": "MODON Technical Reports",
    "descAr": "إعداد ورفع التقارير والملفات الفنية الهندسية المعتمدة للمصانع.",
    "descEn": "Compile and submit certified engineering technical reports for factories.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "مستندات دراسة الأثر البيئي، كروكي السلامة",
    "docsEn": "Environmental impact assessment docs, safety layout",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "الملفات والتقارير الفنية",
      "MODON Technical Reports",
      "modon-tech-reports"
    ],
    "featured": false,
    "visible": true,
    "order": 134
  },
  {
    "id": "modon-track-requests",
    "titleAr": "متابعة الطلبات والملاحظات",
    "titleEn": "Follow Up MODON Requests",
    "descAr": "متابعة وحل الملاحظات الفنية والبلدية على طلبات رخص التشغيل.",
    "descEn": "Follow up and resolve technical or municipal remarks in MODON.",
    "categoryId": "modon",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الطلب الإلكتروني في بوابة مدن",
    "docsEn": "Request code in MODON digital portal",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "متابعة الطلبات والملاحظات",
      "Follow Up MODON Requests",
      "modon-track-requests"
    ],
    "featured": false,
    "visible": true,
    "order": 135
  },
  {
    "id": "chamber-subscribe",
    "titleAr": "اشتراك الغرفة",
    "titleEn": "Chamber Subscription",
    "descAr": "التسجيل وفتح اشتراك جديد في الغرفة التجارية للمنشأة.",
    "descEn": "Register and open new subscription file in Chamber of Commerce.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، الهوية الوطنية للمالك",
    "docsEn": "Commercial Register, National ID of Owner",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "اشتراك الغرفة",
      "Chamber Subscription",
      "chamber-subscribe"
    ],
    "featured": false,
    "visible": true,
    "order": 136
  },
  {
    "id": "chamber-renew",
    "titleAr": "تجديد الاشتراك",
    "titleEn": "Renew Chamber Subscription",
    "descAr": "تجديد صلاحية اشتراك الغرفة التجارية السنوي إلكترونياً.",
    "descEn": "Renew validity of Chamber of Commerce subscription online annually.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "رقم اشتراك الغرفة التجارية الحالي، السجل التجاري",
    "docsEn": "Current Chamber subscription code, Commercial Register",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تجديد الاشتراك",
      "Renew Chamber Subscription",
      "chamber-renew"
    ],
    "featured": false,
    "visible": true,
    "order": 137
  },
  {
    "id": "chamber-certify",
    "titleAr": "تصديق المستندات",
    "titleEn": "Certify Documents",
    "descAr": "تصديق إلكتروني للخطابات والعقود والتفاويض الرسمية للشركات.",
    "descEn": "Certify letters, contracts, and official delegations online.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "مستند الخطاب مكتوب بالصيغة المعتمدة للغرفة",
    "docsEn": "Letter text written in Chamber-approved format",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تصديق المستندات",
      "Certify Documents",
      "chamber-certify"
    ],
    "featured": false,
    "visible": true,
    "order": 138
  },
  {
    "id": "chamber-intro-letters",
    "titleAr": "خطابات التعريف",
    "titleEn": "Introductory Letters",
    "descAr": "توثيق خطابات التعريف بالرواتب والموظفين المصدقة للجهات.",
    "descEn": "Certify introductory and salary certificate letters for employees.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات الموظف، تفاصيل الراتب المصدق",
    "docsEn": "Employee details, certified salary breakdown details",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "خطابات التعريف",
      "Introductory Letters",
      "chamber-intro-letters"
    ],
    "featured": false,
    "visible": true,
    "order": 139
  },
  {
    "id": "chamber-delegations",
    "titleAr": "التفويضات",
    "titleEn": "Chamber Delegations",
    "descAr": "تصديق خطابات التفويض للمراجعين للجهات الحكومية والخاصة.",
    "descEn": "Certify representative delegation letters for review boards.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "بيانات الهوية الوطنية للوكيل والموكل والمهام",
    "docsEn": "IDs of agent and principal, list of tasks delegated",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "التفويضات",
      "Chamber Delegations",
      "chamber-delegations"
    ],
    "featured": false,
    "visible": true,
    "order": 140
  },
  {
    "id": "chamber-corporate-services",
    "titleAr": "خدمات المنشآت",
    "titleEn": "Chamber Corporate Services",
    "descAr": "إدارة ملف المنشأة وتحديث الفئة والأنشطة المسجلة بالغرفة.",
    "descEn": "Manage facility profile, update category tier and active fields.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري المحدث، الهوية للمدير المعتمد",
    "docsEn": "Updated Commercial Register, ID of authorized manager",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "خدمات المنشآت",
      "Chamber Corporate Services",
      "chamber-corporate-services"
    ],
    "featured": false,
    "visible": true,
    "order": 141
  },
  {
    "id": "chamber-extract-certs",
    "titleAr": "استخراج الشهادات والخطابات",
    "titleEn": "Extract Chamber Certificates",
    "descAr": "طباعة واستخراج شهادة العضوية والانتساب الرسمية للغرفة.",
    "descEn": "Print and extract official Chamber of Commerce membership certificates.",
    "categoryId": "chamber",
    "price": "حسب الاتفاق",
    "docsAr": "رقم اشتراك الغرفة التجارية المعتمد",
    "docsEn": "Certified Chamber subscription number",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "استخراج الشهادات والخطابات",
      "Extract Chamber Certificates",
      "chamber-extract-certs"
    ],
    "featured": false,
    "visible": true,
    "order": 142
  },
  {
    "id": "tga-issue-license",
    "titleAr": "إصدار تراخيص النقل",
    "titleEn": "Issue Transport Licenses",
    "descAr": "إصدار ترخيص الهيئة العامة للنقل للأنشطة اللوجستية وتأجير السيارات.",
    "descEn": "Issue Transport General Authority license for logistics & rental.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري بالنشاط، عقد إيجار الموقع، التأمين",
    "docsEn": "Commercial Register of activity, rent contract of site, insurance",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "إصدار تراخيص النقل",
      "Issue Transport Licenses",
      "tga-issue-license"
    ],
    "featured": false,
    "visible": true,
    "order": 143
  },
  {
    "id": "tga-renew-license",
    "titleAr": "تجديد تراخيص النقل",
    "titleEn": "Renew Transport Licenses",
    "descAr": "تجديد صلاحية تراخيص النقل والاشتراكات لشركات التوصيل والنقل.",
    "descEn": "Renew Transport General Authority licenses for logistics companies.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "الترخيص القديم المراد تجديده، التأمينات السارية",
    "docsEn": "Old license to renew, active social security details",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "تجديد تراخيص النقل",
      "Renew Transport Licenses",
      "tga-renew-license"
    ],
    "featured": false,
    "visible": true,
    "order": 144
  },
  {
    "id": "tga-operating-cards",
    "titleAr": "بطاقات التشغيل",
    "titleEn": "Issue Operating Cards",
    "descAr": "إصدار بطاقات تشغيل للمركبات والشاحنات في أنشطة النقل البري.",
    "descEn": "Issue operating cards for trucks and cars in commercial transport.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "استمارة المركبة السارية، فحص دوري ساري، تأمين المركبة",
    "docsEn": "Valid vehicle registration, valid periodic check, vehicle insurance",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "بطاقات التشغيل",
      "Issue Operating Cards",
      "tga-operating-cards"
    ],
    "featured": false,
    "visible": true,
    "order": 145
  },
  {
    "id": "tga-renew-cards",
    "titleAr": "تجديد بطاقات التشغيل",
    "titleEn": "Renew Operating Cards",
    "descAr": "تجديد بطاقة التشغيل السنوية للمركبات والشاحنات لنقل الركاب والبضائع.",
    "descEn": "Renew annual operating cards for commercial passenger and cargo vehicles.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "رقم بطاقة التشغيل الحالية، استمارة المركبة السارية",
    "docsEn": "Current operating card number, valid vehicle registration",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "تجديد بطاقات التشغيل",
      "Renew Operating Cards",
      "tga-renew-cards"
    ],
    "featured": false,
    "visible": true,
    "order": 146
  },
  {
    "id": "tga-change-cards",
    "titleAr": "تغيير بطاقة التشغيل",
    "titleEn": "Modify Operating Card",
    "descAr": "تعديل أو نقل بيانات بطاقة التشغيل لمركبات النقل.",
    "descEn": "Modify or transfer operating card records of commercial vehicles.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "الاستمارة المحدثة، بطاقة التشغيل الحالية",
    "docsEn": "Updated vehicle registration, current operating card",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "تغيير بطاقة التشغيل",
      "Modify Operating Card",
      "tga-change-cards"
    ],
    "featured": false,
    "visible": true,
    "order": 147
  },
  {
    "id": "tga-cancel-cards",
    "titleAr": "إلغاء بطاقة التشغيل",
    "titleEn": "Cancel Operating Card",
    "descAr": "شطب وإلغاء بطاقة التشغيل المسجلة للمركبات من هيئة النقل.",
    "descEn": "Delete and cancel registered operating cards of transport vehicles.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "رقم بطاقة التشغيل المراد إلغاؤها",
    "docsEn": "Operating card number to cancel",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "إلغاء بطاقة التشغيل",
      "Cancel Operating Card",
      "tga-cancel-cards"
    ],
    "featured": false,
    "visible": true,
    "order": 148
  },
  {
    "id": "tga-driver-cards",
    "titleAr": "بطاقات السائقين",
    "titleEn": "Issue Driver Cards",
    "descAr": "إصدار بطاقات التشغيل المهنية لسائقي الأجرة والحافلات والشاحنات.",
    "descEn": "Issue professional driver cards for taxis, buses and trucks.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "رخصة القيادة العمومية، الهوية الوطنية أو الإقامة للسائق",
    "docsEn": "Public driving license, National ID or Residence of driver",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "بطاقات السائقين",
      "Issue Driver Cards",
      "tga-driver-cards"
    ],
    "featured": false,
    "visible": true,
    "order": 149
  },
  {
    "id": "tga-corporate-services",
    "titleAr": "خدمات منشآت النقل",
    "titleEn": "Transport Corporate Services",
    "descAr": "إدارة وتحديث بيانات ملف الشركات والمؤسسات اللوجستية بهيئة النقل.",
    "descEn": "Manage and update logistics company profile records at TGA.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "تفويض رسمي للممثل، السجل التجاري",
    "docsEn": "Official representative authorization, Commercial Register",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات منشآت النقل",
      "Transport Corporate Services",
      "tga-corporate-services"
    ],
    "featured": false,
    "visible": true,
    "order": 150
  },
  {
    "id": "tga-compliance-reqs",
    "titleAr": "متابعة المتطلبات",
    "titleEn": "Follow Up TGA Requirements",
    "descAr": "متابعة المتطلبات الفنية والبيئية لتراخيص النقل واللوجستيات.",
    "descEn": "Follow up technical and environmental requirements for transport licenses.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل متطلبات التفتيش المعتمدة",
    "docsEn": "Details of certified inspection requirements",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "متابعة المتطلبات",
      "Follow Up TGA Requirements",
      "tga-compliance-reqs"
    ],
    "featured": false,
    "visible": true,
    "order": 151
  },
  {
    "id": "tga-inquire-bills",
    "titleAr": "الاستعلام عن الفواتير والمخالفات",
    "titleEn": "Query TGA Bills & Penalties",
    "descAr": "الاستعلام وتسوية فواتير الهيئة وغرامات النقل والتشغيل.",
    "descEn": "Query and settle TGA bills, transportation penalty charges.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "رقم اللوحة أو رقم السجل التجاري للمنشأة",
    "docsEn": "Plate number or Commercial Register of the entity",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الاستعلام عن الفواتير والمخالفات",
      "Query TGA Bills & Penalties",
      "tga-inquire-bills"
    ],
    "featured": false,
    "visible": true,
    "order": 152
  },
  {
    "id": "tga-objections",
    "titleAr": "الاعتراض على المخالفات",
    "titleEn": "Object to Transportation Violations",
    "descAr": "تقديم طلبات الاعتراض على غرامات ومخالفات الهيئة العامة للنقل.",
    "descEn": "Submit objection requests against Transport General Authority penalties.",
    "categoryId": "transportation",
    "price": "حسب الاتفاق",
    "docsAr": "رقم المخالفة الصادر، مبررات الاعتراض الرسمية والأدلة",
    "docsEn": "Violation notice code, official objection reasoning and proofs",
    "completionTimeAr": "2-4 أيام عمل",
    "completionTimeEn": "2-4 أيام عمل",
    "keywords": [
      "الاعتراض على المخالفات",
      "Object to Transportation Violations",
      "tga-objections"
    ],
    "featured": false,
    "visible": true,
    "order": 153
  },
  {
    "id": "insurance-check-status",
    "titleAr": "الاستعلام عن حالة التأمين",
    "titleEn": "Inquire Insurance Status",
    "descAr": "الاستعلام عن صلاحية وسريان التأمين الطبي المربوط بهوية مقيم.",
    "descEn": "Query validity and active status of health insurance on Iqama.",
    "categoryId": "health-insurance",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الإقامة أو الهوية الوطنية للمستعلم عنه",
    "docsEn": "Iqama or National ID of search target",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الاستعلام عن حالة التأمين",
      "Inquire Insurance Status",
      "insurance-check-status"
    ],
    "featured": false,
    "visible": true,
    "order": 154
  },
  {
    "id": "insurance-track-requests",
    "titleAr": "متابعة حالة التأمين",
    "titleEn": "Follow Up Insurance Status",
    "descAr": "متابعة حالة ربط وتفعيل التأمين الطبي في مجلس الضمان الصحي.",
    "descEn": "Follow up medical insurance linking status in CCHI.",
    "categoryId": "health-insurance",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الإقامة للموظف، رقم بوليصة التأمين الطبي",
    "docsEn": "Employee Iqama, medical insurance policy number",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "متابعة حالة التأمين",
      "Follow Up Insurance Status",
      "insurance-track-requests"
    ],
    "featured": false,
    "visible": true,
    "order": 155
  },
  {
    "id": "insurance-employees",
    "titleAr": "خدمات التأمين المرتبطة بالعمالة والمقيمين",
    "titleEn": "Workforce Medical Insurance Setup",
    "descAr": "المساعدة في تجهيز وربط التأمين الطبي للموظفين والعمالة الوافدة لإصدار الإقامات.",
    "descEn": "Assistance in arranging and linking health insurance for foreign workers.",
    "categoryId": "health-insurance",
    "price": "حسب الاتفاق",
    "docsAr": "قائمة الإقامات للموظفين، تفاصيل باقة التأمين المطلوبة",
    "docsEn": "List of employee Iqamas, required insurance plan package",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات التأمين المرتبطة بالعمالة والمقيمين",
      "Workforce Medical Insurance Setup",
      "insurance-employees"
    ],
    "featured": false,
    "visible": true,
    "order": 156
  },
  {
    "id": "insurance-link-staff",
    "titleAr": "ربط الموظفين بالتأمين",
    "titleEn": "Link Employees to Policy",
    "descAr": "ربط الموظف بالبوليصة المعتمدة للمؤسسة إلكترونياً وتحديث مجلس الضمان.",
    "descEn": "Link employee to corporate medical policy and update CCHI.",
    "categoryId": "health-insurance",
    "price": "حسب الاتفاق",
    "docsAr": "رقم بوليصة التأمين المعتمدة للمنشأة، بيانات الموظف",
    "docsEn": "Corporate insurance policy number, employee data",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "ربط الموظفين بالتأمين",
      "Link Employees to Policy",
      "insurance-link-staff"
    ],
    "featured": false,
    "visible": true,
    "order": 157
  },
  {
    "id": "traffic-transfer-vehicle",
    "titleAr": "نقل ملكية المركبة",
    "titleEn": "Transfer Vehicle Ownership",
    "descAr": "إكمال ونقل ملكية المركبات والسيارات إلكترونياً للبائع والمشتري.",
    "descEn": "Transfer car/vehicle ownership records via Absher.",
    "categoryId": "traffic-vehicles",
    "price": "حسب الاتفاق",
    "docsAr": "فحص دوري ساري، تأمين ساري للمركبة، هويات الأطراف",
    "docsEn": "Valid periodic check, valid vehicle insurance, IDs of parties",
    "completionTimeAr": "يوم عمل واحد",
    "completionTimeEn": "يوم عمل واحد",
    "keywords": [
      "نقل ملكية المركبة",
      "Transfer Vehicle Ownership",
      "traffic-transfer-vehicle"
    ],
    "featured": false,
    "visible": true,
    "order": 158
  },
  {
    "id": "traffic-istimara",
    "titleAr": "الاستمارات",
    "titleEn": "Vehicle Registration (Istimara)",
    "descAr": "إصدار وتجديد واستخراج بدل فاقد لاستمارات المركبات.",
    "descEn": "Issue, renew, and extract replacement vehicle registration (Istimara).",
    "categoryId": "traffic-vehicles",
    "price": "حسب الاتفاق",
    "docsAr": "سداد الرسوم الحكومية، تأمين ساري، فحص دوري ساري",
    "docsEn": "Government fee payment, valid insurance, valid periodic check",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "الاستمارات",
      "Vehicle Registration (Istimara)",
      "traffic-istimara"
    ],
    "featured": false,
    "visible": true,
    "order": 159
  },
  {
    "id": "traffic-violations",
    "titleAr": "المخالفات",
    "titleEn": "Traffic Violations Inquiry",
    "descAr": "الاستعلام وتفصيل المخالفات المرورية المسجلة على المالك أو المركبات.",
    "descEn": "Inquire and extract breakdown of traffic violations on Owner or Cars.",
    "categoryId": "traffic-vehicles",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الهوية الوطنية أو رقم السجل التجاري",
    "docsEn": "National ID or Commercial Register of owner",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "المخالفات",
      "Traffic Violations Inquiry",
      "traffic-violations"
    ],
    "featured": false,
    "visible": true,
    "order": 160
  },
  {
    "id": "traffic-delegations",
    "titleAr": "التفويض",
    "titleEn": "Vehicle Driving Delegations",
    "descAr": "إصدار تفويض قيادة خارجي أو داخلي للمركبات عبر أبشر.",
    "descEn": "Issue inside/outside driving delegations for vehicles via Absher.",
    "categoryId": "traffic-vehicles",
    "price": "حسب الاتفاق",
    "docsAr": "رقم هوية السائق المفوض ورقم لوحة المركبة",
    "docsEn": "National ID of driver, vehicle plate details",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "التفويض",
      "Vehicle Driving Delegations",
      "traffic-delegations"
    ],
    "featured": false,
    "visible": true,
    "order": 161
  },
  {
    "id": "traffic-corporate-services",
    "titleAr": "خدمات المركبات والمنشآت",
    "titleEn": "Corporate Fleet Services",
    "descAr": "إدارة أسطول سيارات الشركة والاستعلام وتجديد بيانات المركبات.",
    "descEn": "Manage company vehicle fleet, query and renew vehicle data.",
    "categoryId": "traffic-vehicles",
    "price": "حسب الاتفاق",
    "docsAr": "رقم المنشأة الموحد، تفويض رسمي للمدير",
    "docsEn": "Unified facility number, official manager delegation",
    "completionTimeAr": "1-2 أيام عمل",
    "completionTimeEn": "1-2 أيام عمل",
    "keywords": [
      "خدمات المركبات والمنشآت",
      "Corporate Fleet Services",
      "traffic-corporate-services"
    ],
    "featured": false,
    "visible": true,
    "order": 162
  },
  {
    "id": "traffic-license-services",
    "titleAr": "خدمات الرخص والقيادة",
    "titleEn": "Driving License Services",
    "descAr": "تجديد وإصدار رخص القيادة للسيارات والشاحنات والدراجات.",
    "descEn": "Renew and issue driving licenses for cars, trucks, and bikes.",
    "categoryId": "traffic-vehicles",
    "price": "حسب الاتفاق",
    "docsAr": "نتيجة الفحص الطبي المعتمد، سداد المخالفات والرسوم",
    "docsEn": "Certified medical exam result, fees and violations payment",
    "completionTimeAr": "فوري",
    "completionTimeEn": "فوري",
    "keywords": [
      "خدمات الرخص والقيادة",
      "Driving License Services",
      "traffic-license-services"
    ],
    "featured": false,
    "visible": true,
    "order": 163
  },
  {
    "id": "invest-setup-entity",
    "titleAr": "تأسيس المنشآت",
    "titleEn": "Establish Businesses",
    "descAr": "تأسيس وصياغة عقود تأسيس الشركات للمستثمرين المحليين والأجانب.",
    "descEn": "Establish companies and draft articles of association for investors.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "هويات الشركاء المقترحين، مسودة بنود التأسيس",
    "docsEn": "IDs of proposed partners, draft articles of association",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "تأسيس المنشآت",
      "Establish Businesses",
      "invest-setup-entity"
    ],
    "featured": false,
    "visible": true,
    "order": 164
  },
  {
    "id": "invest-modify-activities",
    "titleAr": "تعديل الأنشطة",
    "titleEn": "Modify Business Activities",
    "descAr": "تعديل وتوسيع الأنشطة الاستثمارية والصناعية للمنشأة.",
    "descEn": "Modify and expand investment and industrial activities of the firm.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، الترخيص الصناعي أو الاستثماري الحالي",
    "docsEn": "Commercial Register, active industrial or investment permit",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "تعديل الأنشطة",
      "Modify Business Activities",
      "invest-modify-activities"
    ],
    "featured": false,
    "visible": true,
    "order": 165
  },
  {
    "id": "invest-add-activities",
    "titleAr": "إضافة الأنشطة",
    "titleEn": "Add Business Activities",
    "descAr": "إضافة تراخيص فرعية أو أنشطة إضافية للمستثمرين.",
    "descEn": "Add branch licenses or additional activities for business investors.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، تفاصيل الأنشطة الجديدة المطلوبة",
    "docsEn": "Commercial Register, details of new activities requested",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "إضافة الأنشطة",
      "Add Business Activities",
      "invest-add-activities"
    ],
    "featured": false,
    "visible": true,
    "order": 166
  },
  {
    "id": "invest-open-portals",
    "titleAr": "فتح ملفات الجهات الحكومية",
    "titleEn": "Register Government Portals",
    "descAr": "فتح وتفعيل ملفات المنشأة وتأسيس حسابات في الموارد والزكاة والبلدية.",
    "descEn": "Register and activate company profiles in HR, ZATCA, and Balady.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "السجل التجاري، الترخيص البلدي، العنوان الوطني للشركة",
    "docsEn": "Commercial Register, Municipal License, National Address",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "فتح ملفات الجهات الحكومية",
      "Register Government Portals",
      "invest-open-portals"
    ],
    "featured": false,
    "visible": true,
    "order": 167
  },
  {
    "id": "invest-prepare-reqs",
    "titleAr": "تجهيز المتطلبات",
    "titleEn": "Prepare Investment Reqs",
    "descAr": "مراجعة وتجهيز متطلبات الاستثمار الأجنبي واللوائح البلدية.",
    "descEn": "Review and compile requirements for foreign investment and municipal laws.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "المخطط المبدئي ونطاق استثمار المنشأة",
    "docsEn": "Preliminary layout plan and company investment scope",
    "completionTimeAr": "2-3 أيام عمل",
    "completionTimeEn": "2-3 أيام عمل",
    "keywords": [
      "تجهيز المتطلبات",
      "Prepare Investment Reqs",
      "invest-prepare-reqs"
    ],
    "featured": false,
    "visible": true,
    "order": 168
  },
  {
    "id": "invest-track-permits",
    "titleAr": "متابعة التراخيص",
    "titleEn": "Follow Up Business Permits",
    "descAr": "متابعة طلبات التراخيص وتراخيص الاستثمار الصناعي بوزارة الاستثمار.",
    "descEn": "Follow up on license requests with the Ministry of Investment.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "رقم الطلب الصادر في بوابة وزارة الاستثمار",
    "docsEn": "Issued request code in Ministry of Investment portal",
    "completionTimeAr": "2-4 أيام عمل",
    "completionTimeEn": "2-4 أيام عمل",
    "keywords": [
      "متابعة التراخيص",
      "Follow Up Business Permits",
      "invest-track-permits"
    ],
    "featured": false,
    "visible": true,
    "order": 169
  },
  {
    "id": "invest-project-files",
    "titleAr": "تجهيز ملفات المشاريع",
    "titleEn": "Project Profile Preparation",
    "descAr": "تجهيز وتجميع ملفات المشاريع والخطط التشغيلية والفنية المعتمدة.",
    "descEn": "Compile and organize project profiles, plans and designs.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "مسودة الخطة الفنية والتشغيلية للمشروع",
    "docsEn": "Draft of project's technical and operational plan",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "تجهيز ملفات المشاريع",
      "Project Profile Preparation",
      "invest-project-files"
    ],
    "featured": false,
    "visible": true,
    "order": 170
  },
  {
    "id": "invest-legal-studies",
    "titleAr": "دراسة المتطلبات النظامية للنشاط",
    "titleEn": "Feasibility of Regulatory Reqs",
    "descAr": "دراسة وتدقيق الأنظمة واللوائح والاشتراطات النظامية المطلوبة للنشاط.",
    "descEn": "Study and audit statutory regulations and parameters for the business.",
    "categoryId": "investment-biz",
    "price": "حسب الاتفاق",
    "docsAr": "تفاصيل قطاع النشاط المراد الاستثمار به",
    "docsEn": "Details of active business sector target for investment",
    "completionTimeAr": "3-5 أيام عمل",
    "completionTimeEn": "3-5 أيام عمل",
    "keywords": [
      "دراسة المتطلبات النظامية للنشاط",
      "Feasibility of Regulatory Reqs",
      "invest-legal-studies"
    ],
    "featured": false,
    "visible": true,
    "order": 171
  }
];

export const defaultFAQs: FAQItem[] = [
  {
    id: "faq-1",
    qAr: "ما هي أوقات العمل في مكتب كود خدمات؟",
    qEn: "What are the working hours at Code Services?",
    aAr: "نسعد بخدمتكم من السبت إلى الخميس على فترتين: الفترة الصباحية من 9:30 ص إلى 1:00 م، والفترة المسائية من 4:00 م إلى 11:00 م (الجمعة مغلق). وتستقبل منصتنا وواتساب الطلبات على مدار 24 ساعة.",
    aEn: "We are pleased to serve you Saturday to Thursday in two shifts: Morning from 9:30 AM to 1:00 PM, and Evening from 4:00 PM to 11:00 PM (Closed on Friday). Online & WhatsApp requests are received 24/7.",
    visible: true,
    order: 1
  },
  {
    id: "faq-2",
    qAr: "هل يمكنني إنجاز المعاملات بالكامل عن بعد؟",
    qEn: "Can I complete my transactions online without visiting?",
    aAr: "نعم، بكل تأكيد! يمكنك إرسال المتطلبات والمستندات عبر الواتساب، وسيقوم فريقنا بإتمام المعاملة فوراً وإرسال إثبات الإنجاز لك إلكترونياً.",
    aEn: "Yes, absolutely! You can send requirements and documents via WhatsApp, and our team will process the transaction immediately and send you digital confirmation.",
    visible: true,
    order: 2
  },
  {
    id: "faq-3",
    qAr: "ما هي خدمات قطاع الأعمال المتوفرة لديكم؟",
    qEn: "What business services do you offer?",
    aAr: "نقدم خدمات متكاملة تشمل تأسيس السجلات التجارية وشطبها وتعديلها، إصدار تراخيص البلدية وعقود منصة بلدي، وكالات شرعية، وإدارة حساب قوى والعمالة بمقيم.",
    aEn: "We offer integrated services including commercial registration CRUD, municipal licenses, Balady platform, power of attorney, Qiwa management, and Muqeem portals.",
    visible: true,
    order: 3
  }
];

export const defaultAnnouncement: Announcement = {
  id: "announcement-main",
  textAr: "📢 أوقات العمل: من السبت إلى الخميس (9:30 ص – 1:00 م | 4:00 م – 11:00 م) وخدماتنا الإلكترونية متاحة 24/7",
  textEn: "📢 Working Hours: Saturday to Thursday (9:30 AM – 1:00 PM | 4:00 PM – 11:00 PM). Online requests open 24/7",
  active: true,
  bgColor: "bg-primary"
};

export const translations = {
  ar: {
    // Navigation
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navAbout: "من نحن",
    navReviews: "الآراء",
    navLocation: "موقعنا",
    navContact: "اتصل بنا",

    // Hero
    heroTitle: "كود خدمات",
    heroSubTitle: "خدمات عامة، خدمات إلكترونية، سداد، طباعة، تصوير، خدمات الطلاب والأعمال",
    heroBtnContact: "اتصل بنا",
    heroBtnServices: "عرض الخدمات",

    // About
    aboutTitle: "من نحن",
    aboutText: "كود خدمات هو مكتب متخصص في تقديم الخدمات الحكومية والإلكترونية وخدمات الأعمال والطلاب، مع سرعة في الإنجاز، دقة في العمل، وأسعار مناسبة.",
    aboutHighlight1: "سرعة الإنجاز",
    aboutHighlight2: "خدمة احترافية",
    aboutHighlight3: "أسعار مناسبة",
    aboutHighlight4: "خبرة عالية",

    // Services Filter & Search
    searchPlaceholder: "ابحث عن خدمة، تصنيف، أو كلمة دلالية...",
    allCategories: "جميع الخدمات",
    catGov: "خدمات حكومية",
    catVisa: "تأشيرات وزيارات",
    catStudent: "خدمات الطلاب",
    catDesign: "تصميم ومطبوعات",
    catBusiness: "خدمات الأعمال",

    // Stats
    statCustomersVal: "5000+",
    statCustomersLabel: "خدمة منجزة",
    statResponseVal: "24/7",
    statResponseLabel: "استجابة سريعة",
    statReviewsVal: "18+",
    statReviewsLabel: "تقييمات جوجل",
    statRatingVal: "4.9★",
    statRatingLabel: "تقييم ممتاز",

    // Reviews
    reviewsTitle: "تقييمات العملاء",
    reviewsSub: "ماذا يقول عملائنا عن خدماتنا على جوجل",
    reviewsText1: "خدمة ممتازة جدًا وتعامل راقي وسريع",
    reviewsText2: "الأسعار مناسبة والخدمة فوق الممتاز",
    reviewsText3: "أنصح أي شخص يتعامل معهم",
    reviewer1: "أحمد الحربي",
    reviewer2: "خالد الغامدي",
    reviewer3: "سارة عبد الله",

    // Gallery
    galleryTitle: "معرض الصور",
    gallerySub: "جولة داخل وخارج مكتب كود خدمات",
    imgStorefront: "الواجهة الخارجية للمكتب",
    imgOffice: "المكتب من الداخل",
    imgInterior: "منطقة الاستقبال والعملاء",
    imgSignboard: "لوحة كود خدمات",
    imgPriceList: "قائمة أسعار التصميم والمطبوعات",

    // Location / Maps
    locationTitle: "موقعنا",
    locationOpenMaps: "افتح الموقع في Google Maps",
    locationAddress: "الحسن بن الحارث، شارع النضير - حي الفلاح، جدة، المملكة العربية السعودية",
    locationPlusCode: "رمز بلس: Q5PM+X8",

    // Contact
    contactTitle: "اتصل بنا",
    contactSub: "تواصل معنا لإنجاز خدماتك بسرعة واحترافية",
    contactPhone: "الهاتف",
    contactWhatsApp: "واتساب",
    contactHours: "أوقات العمل",
    contactHoursVal: "السبت – الخميس: 9:30 ص – 1:00 م | 4:00 م – 11:00 م (الجمعة مغلق)",
    contactAddressLabel: "العنوان",
    contactFormName: "الاسم",
    contactFormEmail: "البريد الإلكتروني",
    contactFormPhone: "رقم الجوال",
    contactFormService: "الخدمة المطلوبة",
    contactFormMessage: "تفاصيل المعاملة / الرسالة",
    contactFormSubmit: "إرسال الطلب",
    contactFormSuccess: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
    contactFormError: "يرجى ملء جميع الحقول المطلوبة.",

    // FAQ
    faqTitle: "الأسئلة الشائعة",
    faqSub: "إجابات على استفساراتكم المتكررة",
    faqQ1: "ما هي أوقات العمل في مكتب كود خدمات؟",
    faqA1: "نسعد بخدمتكم من السبت إلى الخميس على فترتين: الصباحية (9:30 ص – 1:00 م) والمسائية (4:00 م – 11:00 م). الجمعة مغلق. وتستقبل طلباتكم الإلكترونية عبر الموقع والواتساب على مدار الساعة.",
    faqQ2: "هل يمكنني إنجاز معاملاتي عن بعد دون الحضور للمكتب؟",
    faqA2: "نعم بكل تأكيد! يمكنك التواصل معنا مباشرة عبر الواتساب وإرسال المستندات المطلوبة، وسيقوم فريقنا بإنجازها وإرسالها لك فوراً.",
    faqQ3: "هل تقدمون خدمات طباعة وتصوير الكتب والمذكرات الدراسية للطلاب؟",
    faqA3: "نعم، نقدم خدمات طباعة ليزر ملونة وعادية، تصوير مستندات، مسح ضوئي، تجليد الكتب وتقسيم المذكرات بأعلى جودة وأفضل أسعار للطلاب.",
    faqQ4: "ما هي خدمات قطاع الأعمال وتأسيس الشركات المتوفرة لديكم؟",
    faqA4: "نقوم بإصدار وتجديد السجلات التجارية، وتأسيس الشركات، ورخص البلدية عبر منصة بلدي، ووكالات إلكترونية، وخدمات مقيم للشركات.",

    // Footer
    footerDesc: "مكتب كود خدمات - شريكك الموثوق لإنجاز كافة الخدمات الحكومية، الإلكترونية، خدمات الطلاب والتصميم الاحترافي في جدة.",
    footerLinks: "روابط سريعة",
    footerCopyright: "© 2026 كود خدمات. جميع الحقوق محفوظة.",
    footerCredit: "صُمم بـ ❤️ بواسطة كود خدمات",
    
    // UI
    loading: "جاري التحميل..."
  },
  en: {
    // Navigation
    navHome: "Home",
    navServices: "Services",
    navAbout: "About Us",
    navReviews: "Reviews",
    navLocation: "Location",
    navContact: "Contact Us",

    // Hero
    heroTitle: "Code Services",
    heroSubTitle: "General Services, E-Services, Payments, Printing, Copying, Student & Business Services",
    heroBtnContact: "Contact Us",
    heroBtnServices: "View Services",

    // About
    aboutTitle: "About Us",
    aboutText: "Code Services is a specialized office providing government, electronic, business, and student services, with fast delivery, precise work, and affordable prices.",
    aboutHighlight1: "Fast Delivery",
    aboutHighlight2: "Professional Service",
    aboutHighlight3: "Reasonable Prices",
    aboutHighlight4: "High Experience",

    // Services Filter & Search
    searchPlaceholder: "Search for a service, category or keyword...",
    allCategories: "All Services",
    catGov: "Government Services",
    catVisa: "Visas & Visits",
    catStudent: "Student Services",
    catDesign: "Design & Printing",
    catBusiness: "Business Services",

    // Stats
    statCustomersVal: "5000+",
    statCustomersLabel: "Completed Services",
    statResponseVal: "24/7",
    statResponseLabel: "Fast Response",
    statReviewsVal: "18+",
    statReviewsLabel: "Google Reviews",
    statRatingVal: "4.9★",
    statRatingLabel: "Google Rating",

    // Reviews
    reviewsTitle: "Customer Reviews",
    reviewsSub: "What our clients say about our services on Google",
    reviewsText1: "Very excellent service, very professional and fast communication.",
    reviewsText2: "Reasonable prices and the service is beyond excellent.",
    reviewsText3: "I highly recommend dealing with them.",
    reviewer1: "Ahmed Al-Harbi",
    reviewer2: "Khaled Al-Ghamdi",
    reviewer3: "Sarah Abdullah",

    // Gallery
    galleryTitle: "Image Gallery",
    gallerySub: "A tour inside and outside Code Services office",
    imgStorefront: "Office Front View",
    imgOffice: "Office Interior Desk",
    imgInterior: "Reception & Waiting Area",
    imgSignboard: "Office Signboard",
    imgPriceList: "Design & Print Price List",

    // Location / Maps
    locationTitle: "Our Location",
    locationOpenMaps: "Open in Google Maps",
    locationAddress: "Al-Hasan Ibn Al-Harith, Al-Nadhir St - Al Falah, Jeddah, Saudi Arabia",
    locationPlusCode: "Plus Code: Q5PM+X8",

    // Contact
    contactTitle: "Contact Us",
    contactSub: "Get in touch with us to complete your services quickly and professionally",
    contactPhone: "Phone",
    contactWhatsApp: "WhatsApp",
    contactHours: "Working Hours",
    contactHoursVal: "Sat – Thu: 9:30 AM – 1:00 PM | 4:00 PM – 11:00 PM (Friday Closed)",
    contactAddressLabel: "Address",
    contactFormName: "Full Name",
    contactFormEmail: "Email Address",
    contactFormPhone: "Phone Number",
    contactFormService: "Requested Service",
    contactFormMessage: "Details / Message",
    contactFormSubmit: "Submit Request",
    contactFormSuccess: "Your message has been sent successfully! We will contact you soon.",
    contactFormError: "Please fill in all required fields.",

    // FAQ
    faqTitle: "FAQ",
    faqSub: "Answers to your frequently asked questions",
    faqQ1: "What are the working hours at Code Services?",
    faqA1: "We are pleased to serve you Saturday to Thursday in two shifts: Morning (9:30 AM – 1:00 PM) and Evening (4:00 PM – 11:00 PM). Closed on Friday. Online requests are received 24/7.",
    faqQ2: "Can I complete my transactions online without visiting the office?",
    faqA2: "Yes, absolutely! You can contact us directly via WhatsApp and send the required documents, and our team will process and send them back to you immediately.",
    faqQ3: "Do you provide printing and copying services for students?",
    faqA3: "Yes, we provide color and black & white laser printing, copying, scanning, book binding, and splitting services at the best student-friendly prices.",
    faqQ4: "What business setup and corporate services do you offer?",
    faqA4: "We handle commercial registration issuance and renewals, business setups, municipal licenses via Balady, electronic power of attorney, and Muqeem portal management.",

    // Footer
    footerDesc: "Code Services Office - Your trusted partner for completing all government, electronic, student, and professional design services in Jeddah.",
    footerLinks: "Quick Links",
    footerCopyright: "© 2026 Code Services. All rights reserved.",
    footerCredit: "Designed with ❤️ by Code Services",
    
    // UI
    loading: "Loading..."
  }
};

export const getMigratedServices = (): ServiceItem[] => {
  if (typeof window === "undefined") return defaultServices;
  const saved = localStorage.getItem("code_services_catalog");
  if (!saved) {
    localStorage.setItem("code_services_catalog", JSON.stringify(defaultServices));
    return defaultServices;
  }

  try {
    const list = JSON.parse(saved);
    if (!Array.isArray(list)) {
      localStorage.setItem("code_services_catalog", JSON.stringify(defaultServices));
      return defaultServices;
    }

    let needsMigration = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const migrated = list.map((item: any, index: number) => {
      if (item.titleAr && item.titleEn) {
        return item as ServiceItem;
      }
      
      needsMigration = true;
      const parts = (item.title || "").split(" / ");
      const titleAr = parts[0] || item.title || "";
      const titleEn = parts[1] || titleAr;
      const descAr = item.description || "";
      const descEn = item.description || "";
      
      let categoryId = item.categoryId || item.category || "business";
      if (categoryId === "design") categoryId = "printing";
      else if (categoryId === "visa") categoryId = "absher";

      return {
        id: item.id || `service-${Date.now()}-${index}`,
        titleAr,
        titleEn,
        descAr,
        descEn,
        categoryId,
        price: item.price || "",
        docsAr: "",
        docsEn: "",
        completionTimeAr: "",
        completionTimeEn: "",
        keywords: [],
        featured: false,
        visible: true,
        order: item.order || index + 1
      };
    });

    if (needsMigration) {
      localStorage.setItem("code_services_catalog", JSON.stringify(migrated));
    }
    return migrated;
  } catch (e) {
    localStorage.setItem("code_services_catalog", JSON.stringify(defaultServices));
    return defaultServices;
  }
};
