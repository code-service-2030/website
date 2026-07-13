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
  bgColor: string; // e.g. bg-primary, bg-emerald-600, etc.
}

export const defaultCategories: Category[] = [
  {
    id: "business",
    nameAr: "🏢 خدمات مركز الأعمال",
    nameEn: "🏢 Business Center",
    descAr: "تأسيس السجلات، حجز الأسماء التجارية، وإدارة الشركات الكترونياً.",
    descEn: "Establish registers, reserve trade names, and manage business entities online.",
    icon: "Briefcase",
    visible: true,
    order: 1
  },
  {
    id: "absher",
    nameAr: "👤 خدمات أبشر للأفراد",
    nameEn: "👤 Absher Services",
    descAr: "تفعيل الحسابات، تجديد الرخص والمواعيد الحكومية بيسر وسهولة.",
    descEn: "Activate accounts, renew driver licenses and book government appointments easily.",
    icon: "UserCheck",
    visible: true,
    order: 2
  },
  {
    id: "hr",
    nameAr: "💼 خدمات الموارد البشرية",
    nameEn: "💼 Human Resources",
    descAr: "تسجيل الضمان الاجتماعي، وثيقة العمل الحر، وحساب المواطن وعقود العمل.",
    descEn: "Register social security, freelance certificates, citizen account and labor agreements.",
    icon: "Users",
    visible: true,
    order: 3
  },
  {
    id: "qiwa",
    nameAr: "⚙️ خدمات منصة قوى",
    nameEn: "⚙️ Qiwa Platform",
    descAr: "إصدار تأشيرات العمل للمؤسسات، نقل الكفالة، وتوثيق عقود العمل والشهادات.",
    descEn: "Issue corporate work visas, transfer sponsorships, and attest contracts and certificates.",
    icon: "Settings",
    visible: true,
    order: 4
  },
  {
    id: "student",
    nameAr: "🎓 الخدمات الطلابية",
    nameEn: "🎓 Student Services",
    descAr: "التسجيل في نور للمدارس، كتابة البحوث والتقارير الجامعية، والتسجيل في طاقات.",
    descEn: "Register in Noor for schools, prepare academic research/reports, and register in Taqat.",
    icon: "GraduationCap",
    visible: true,
    order: 5
  },
  {
    id: "printing",
    nameAr: "🖨️ خدمات الطباعة والتصوير",
    nameEn: "🖨️ Printing & Copying",
    descAr: "طباعة عادية وملونة، سكانر، تجليد الكتب وتقسيم المذكرات بأفضل جودة.",
    descEn: "Color and black & white laser printing, scanning, book binding and splitting.",
    icon: "Printer",
    visible: true,
    order: 6
  }
];

export const defaultServices: ServiceItem[] = [
  // Business Center
  {
    id: "comm-reg-issue",
    titleAr: "إصدار سجل تجاري",
    titleEn: "Issue Commercial Registration",
    descAr: "تأسيس وإصدار السجلات التجارية وتراخيص الأعمال إلكترونياً وبسرعة فائقة.",
    descEn: "Establish and issue commercial registrations and business licenses online with speed.",
    categoryId: "business",
    price: "250 ريال",
    docsAr: "رقم الهوية الوطنية للشركاء، عقد التأسيس (إن وجد)",
    docsEn: "National ID cards of partners, Articles of Association (if available)",
    completionTimeAr: "يوم عمل واحد",
    completionTimeEn: "1 working day",
    keywords: ["سجل", "تجاري", "مؤسسة", "شركة", "تأسيس", "business", "commercial", "registration", "company"],
    featured: true,
    featuredOrder: 1,
    visible: true,
    order: 1
  },
  {
    id: "comm-reg-cancel",
    titleAr: "شطب سجل تجاري",
    titleEn: "Cancel Commercial Registration",
    descAr: "إلغاء وشطب السجلات التجارية للمؤسسات والشركات وإنهاء النشاط التجاري.",
    descEn: "Delete and cancel commercial registrations for establishments/companies and terminate business activities.",
    categoryId: "business",
    price: "150 ريال",
    docsAr: "رقم السجل التجاري، تصفية الحقوق والالتزامات للبلدية",
    docsEn: "Commercial Registration Number, clearance of municipal liabilities",
    completionTimeAr: "1 - 2 أيام عمل",
    completionTimeEn: "1 - 2 working days",
    keywords: ["شطب", "إلغاء", "سجل", "تجاري", "cancel", "delete", "registration"],
    featured: false,
    visible: true,
    order: 2
  },
  {
    id: "comm-reg-renew",
    titleAr: "تجديد سجل تجاري",
    titleEn: "Renew Commercial Registration",
    descAr: "تجديد صلاحية السجل التجاري إلكترونياً لضمان استمرارية الأنشطة التجارية.",
    descEn: "Renew validity of commercial registration online to ensure continuous business activity.",
    categoryId: "business",
    price: "100 ريال",
    docsAr: "رقم السجل التجاري المراد تجديده",
    docsEn: "Commercial Registration Number to renew",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["تجديد", "سجل", "تجاري", "renew", "commercial", "registration"],
    featured: true,
    featuredOrder: 2,
    visible: true,
    order: 3
  },
  {
    id: "comm-reg-edit",
    titleAr: "تعديل سجل تجاري",
    titleEn: "Edit Commercial Registration",
    descAr: "تغيير وتحديث بيانات السجل التجاري (الاسم التجاري، الأنشطة، العنوان، رأس المال).",
    descEn: "Update commercial registration details (trade name, activities, address, capital).",
    categoryId: "business",
    price: "150 ريال",
    docsAr: "رقم السجل التجاري، تفاصيل التعديلات المطلوبة",
    docsEn: "Commercial Registration Number, list of changes required",
    completionTimeAr: "يوم عمل واحد",
    completionTimeEn: "1 working day",
    keywords: ["تعديل", "تغيير", "سجل", "تجاري", "edit", "update", "commercial"],
    featured: false,
    visible: true,
    order: 4
  },
  {
    id: "comm-reg-transfer",
    titleAr: "نقل ملكية سجل تجاري",
    titleEn: "Transfer Commercial Registration",
    descAr: "نقل ملكية السجل التجاري وتنازل صاحب السجل للطرف الجديد بصورة قانونية.",
    descEn: "Transfer commercial registration ownership and legally assign it to the new party.",
    categoryId: "business",
    price: "250 ريال",
    docsAr: "عقد المبايعة الإلكتروني، الهوية الوطنية للمشتري والبائع",
    docsEn: "Electronic bill of sale, National IDs of both buyer and seller",
    completionTimeAr: "2 - 3 أيام عمل",
    completionTimeEn: "2 - 3 working days",
    keywords: ["نقل", "ملكية", "تنازل", "سجل", "تجاري", "transfer", "ownership"],
    featured: false,
    visible: true,
    order: 5
  },
  {
    id: "comm-reg-reserve",
    titleAr: "حجز اسم تجاري",
    titleEn: "Reserve Trade Name",
    descAr: "حجز اسم تجاري مميز للمؤسسة عبر موقع وزارة التجارة الكترونياً.",
    descEn: "Reserve a distinct trade name for the establishment online through the Ministry of Commerce website.",
    categoryId: "business",
    price: "100 ريال",
    docsAr: "الاسم التجاري المقترح، رقم الهوية الوطنية لصاحب الطلب",
    docsEn: "Proposed trade name, National ID of applicant",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["حجز", "اسم", "تجاري", "reserve", "trade name", "brand"],
    featured: false,
    visible: true,
    order: 6
  },

  // Absher Services
  {
    id: "absher-activate",
    titleAr: "تفعيل أبشر",
    titleEn: "Activate Absher Account",
    descAr: "مساعدة في إنشاء وتفعيل الحساب الشخصي بمنصة أبشر الحكومية.",
    descEn: "Assistance in creating and activating personal accounts on the governmental Absher platform.",
    categoryId: "absher",
    price: "50 ريال",
    docsAr: "رقم الهوية الوطنية، رقم الجوال النشط",
    docsEn: "National ID Card, active mobile number",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["تفعيل", "أبشر", "حساب", "أفراد", "activate", "absher", "account"],
    featured: false,
    visible: true,
    order: 1
  },
  {
    id: "absher-appoint",
    titleAr: "حجز موعد حكومي",
    titleEn: "Book Appointment",
    descAr: "حجز مواعيد في المرور، الجوازات، الأحوال المدنية، أو فروع الخارجية.",
    descEn: "Book appointments for Traffic, Passports, Civil Status, or Foreign Affairs branches.",
    categoryId: "absher",
    price: "30 ريال",
    docsAr: "رقم الهوية الوطنية وتاريخ الميلاد، تحديد القطاع المناسب للموعد",
    docsEn: "National ID and Date of Birth, selected sector details",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["حجز", "موعد", "مرور", "جوازات", "أحوال", "book", "appointment", "date"],
    featured: false,
    visible: true,
    order: 2
  },
  {
    id: "absher-license-renew",
    titleAr: "تجديد رخصة قيادة",
    titleEn: "Renew Driving License",
    descAr: "إنهاء متطلبات تجديد رخصة القيادة وإصدارها وتحديد مدة الصلاحية.",
    descEn: "Complete driver license renewal requirements, issue the card, and select validity period.",
    categoryId: "absher",
    price: "100 ريال",
    docsAr: "نتيجة الفحص الطبي المعتمد، سداد المخالفات المرورية والرسوم الحكومية",
    docsEn: "Attested medical test results, payment of traffic violations & fees",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["تجديد", "رخصة", "قيادة", "مرور", "سيارة", "renew", "license", "driving"],
    featured: true,
    featuredOrder: 3,
    visible: true,
    order: 3
  },
  {
    id: "absher-lost-replace",
    titleAr: "إصدار بدل فاقد",
    titleEn: "Issue Lost ID/License Replacement",
    descAr: "تقديم طلب إصدار رخصة قيادة أو بطاقة هوية وطنية بدل تالف أو مفقود الكترونياً.",
    descEn: "Submit request to issue replacement driving license or national ID card for lost/damaged cards online.",
    categoryId: "absher",
    price: "100 ريال",
    docsAr: "صورة فوتوغرافية حديثة، بلاغ الفقدان الموثق عبر أبشر",
    docsEn: "Recent passport photo, lost report documented through Absher",
    completionTimeAr: "1 - 2 أيام عمل",
    completionTimeEn: "1 - 2 working days",
    keywords: ["بدل فاقد", "رخصة", "هوية", "استبدال", "replace", "lost", "license"],
    featured: false,
    visible: true,
    order: 4
  },
  {
    id: "absher-vehicle-transfer",
    titleAr: "نقل ملكية مركبة",
    titleEn: "Transfer Vehicle Ownership",
    descAr: "نقل ملكية السيارات والمركبات وتعديل بيانات الاستمارة للبائع والمشتري.",
    descEn: "Transfer car/vehicle ownership and update registration (Istimara) for buyer and seller.",
    categoryId: "absher",
    price: "200 ريال",
    docsAr: "فحص دوري ساري، تأمين ساري، الهوية الوطنية للطرفين",
    docsEn: "Valid periodic inspection, valid insurance, National IDs of both parties",
    completionTimeAr: "يوم عمل واحد",
    completionTimeEn: "1 working day",
    keywords: ["نقل", "ملكية", "مركبة", "سيارة", "مرور", "transfer", "vehicle", "car"],
    featured: false,
    visible: true,
    order: 5
  },

  // Human Resources
  {
    id: "hr-social-security",
    titleAr: "تسجيل الضمان الاجتماعي المطور",
    titleEn: "Register Developed Social Security",
    descAr: "دراسة وتعبئة طلب التقديم على الضمان المطور ورفع كافة مستندات الأهلية.",
    descEn: "Study and fill application for developed social security (Damaan) and upload eligibility papers.",
    categoryId: "hr",
    price: "150 ريال",
    docsAr: "صورة الهوية الوطنية، كشف حساب راتب، صك ملكية أو عقد إيجار موثق (إيجار)",
    docsEn: "National ID copy, bank salary statement, ownership deed or Ejar rent contract",
    completionTimeAr: "1 - 2 أيام عمل",
    completionTimeEn: "1 - 2 working days",
    keywords: ["ضمان", "مطور", "تسجيل", "دعم", "social security", "damaan"],
    featured: true,
    featuredOrder: 4,
    visible: true,
    order: 1
  },
  {
    id: "hr-freelance-cert",
    titleAr: "إصدار شهادة العمل الحر",
    titleEn: "Issue Freelance Certificate",
    descAr: "استخراج وثيقة العمل الحر لإثبات المزاولة وبدء مشاريعك أو فتح حساب بنكي تجاري.",
    descEn: "Obtain freelance certificate to prove activity and start projects or open corporate bank accounts.",
    categoryId: "hr",
    price: "150 ريال",
    docsAr: "إثبات المهنة، ملفات أعمال سابقة أو دورات تدريبية متخصصة",
    docsEn: "Professional proof, work portfolio or specialized training certificates",
    completionTimeAr: "1 - 2 أيام عمل",
    completionTimeEn: "1 - 2 working days",
    keywords: ["عمل حر", "وثيقة", "شهادة", "مستقل", "freelance", "certificate"],
    featured: true,
    featuredOrder: 5,
    visible: true,
    order: 2
  },
  {
    id: "hr-citizen-account",
    titleAr: "التسجيل في حساب المواطن",
    titleEn: "Citizen Account Registration",
    descAr: "التسجيل في حساب المواطن وإثبات الاستقلالية وتقديم التقارير المالية والاعتراضات.",
    descEn: "Register in Citizen Account program, prove independence, and submit bank info/appeals.",
    categoryId: "hr",
    price: "100 ريال",
    docsAr: "كشف إجمالي الدخل لرب الأسرة والتابعين، صك الملكية أو عقد الإيجار الموحد",
    docsEn: "Total household income statements, property deed or unified Ejar contract",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["حساب المواطن", "تسجيل", "دعم", "مواطن", "citizen account", "registration"],
    featured: false,
    visible: true,
    order: 3
  },
  {
    id: "hr-comp-rehab",
    titleAr: "التقديم على التأهيل الشامل",
    titleEn: "Apply for Comprehensive Rehabilitation",
    descAr: "تعبئة وتقديم طلب الإعانة المالية لذوي الاحتياجات الخاصة لدى وزارة الموارد البشرية.",
    descEn: "Fill and submit financial aid application for people with disabilities under HR Ministry.",
    categoryId: "hr",
    price: "150 ريال",
    docsAr: "تقرير طبي حديث ومعتمد، إثبات الدخل المالي للأسرة",
    docsEn: "Recent attested medical report, family income details",
    completionTimeAr: "2 - 3 أيام عمل",
    completionTimeEn: "2 - 3 working days",
    keywords: ["تأهيل شامل", "ذوي إعاقة", "إعانة", "تقديم", "rehabilitation", "comprehensive"],
    featured: false,
    visible: true,
    order: 4
  },
  {
    id: "hr-productive-families",
    titleAr: "إصدار شهادة الأسر المنتجة",
    titleEn: "Issue Productive Families Certificate",
    descAr: "إصدار شهادة تسجيل ودعم الأسر المنتجة لمزاولة الأنشطة المنزلية والحرفية قانونياً.",
    descEn: "Issue registration/support certificate for productive families to legally run home activities.",
    categoryId: "hr",
    price: "120 ريال",
    docsAr: "رقم الهوية الوطنية، تفاصيل النشاط المنزلي، العنوان الوطني المحدث",
    docsEn: "National ID Card, home business details, updated National Address",
    completionTimeAr: "يوم عمل واحد",
    completionTimeEn: "1 working day",
    keywords: ["أسر منتجة", "رخصة", "شهادة", "عمل منزلي", "productive families"],
    featured: false,
    visible: true,
    order: 5
  },

  // Qiwa Platform
  {
    id: "qiwa-issue-visa",
    titleAr: "إصدار تأشيرة عامل مؤسسة",
    titleEn: "Issue Institution Worker Visa",
    descAr: "طلب وإصدار التأشيرات المهنية لتوظيف العمالة الأجنبية لمنشأتك عبر منصة قوى.",
    descEn: "Apply and issue professional visas for foreign workers for your entity through Qiwa.",
    categoryId: "qiwa",
    price: "150 ريال",
    docsAr: "السجل التجاري للمنشأة، رخصة البلدية، ملف المنشأة المحدث بقوى",
    docsEn: "Entity Commercial Registration, municipal license, updated Qiwa profile",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["تأشيرة", "عامل", "قوى", "مؤسسة", "visa", "institution", "worker"],
    featured: false,
    visible: true,
    order: 1
  },
  {
    id: "qiwa-sponsorship-transfer",
    titleAr: "نقل كفالة عامل",
    titleEn: "Transfer Sponsorship",
    descAr: "إنهاء إجراءات نقل كفالة وتعديل اسم صاحب العمل للمنشأة الجديدة إلكترونياً.",
    descEn: "Complete worker transfer procedures and update employer record to the new entity online.",
    categoryId: "qiwa",
    price: "200 ريال",
    docsAr: "رقم إقامة العامل، خطاب موافقة المنشأة الجديدة، السجل التجاري",
    docsEn: "Worker residency ID (Iqama), approval letter of new entity, Commercial Registration",
    completionTimeAr: "1 - 2 أيام عمل",
    completionTimeEn: "1 - 2 working days",
    keywords: ["نقل كفالة", "خدمات قوى", "تنازل", "transfer", "sponsorship"],
    featured: true,
    featuredOrder: 6,
    visible: true,
    order: 2
  },
  {
    id: "qiwa-saudization-cert",
    titleAr: "إصدار شهادة سعودة",
    titleEn: "Issue Saudization Certificate",
    descAr: "استخراج شهادة سعودة الرسمية لتقديمها للمناقصات والجهات الحكومية لإثبات نطاق التوطين.",
    descEn: "Obtain official Saudization Certificate to present for tenders/gov entities to prove localization.",
    categoryId: "qiwa",
    price: "100 ريال",
    docsAr: "السجل التجاري، سداد اشتراكات التأمينات والملف خالي من الملاحظات",
    docsEn: "Commercial Registration, paid GOSI subscriptions, clean profile status",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["سعودة", "شهادة", "نتاقات", "قوى", "saudization", "certificate"],
    featured: false,
    visible: true,
    order: 3
  },

  // Student Services
  {
    id: "student-noor-reg",
    titleAr: "التسجيل في نور للمدارس",
    titleEn: "Register in Noor for Schools",
    descAr: "تسجيل الأطفال والطلاب المستجدين في الصف الأول الابتدائي أو رياض الأطفال بنظام نور.",
    descEn: "Register newly admitted children and students in 1st primary grade or kindergarten via Noor system.",
    categoryId: "student",
    price: "80 ريال",
    docsAr: "كرت العائلة أو إقامة الطالب، إثبات السكن (عقد إيجار أو فاتورة كهرباء)",
    docsEn: "Family ID or student residency card, residency proof (rent contract/electricity bill)",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["نور", "مدارس", "تسجيل طلاب", "نور الوزاري", "noor", "school", "registration"],
    featured: false,
    visible: true,
    order: 1
  },
  {
    id: "student-research",
    titleAr: "كتابة البحوث والواجبات",
    titleEn: "Write Research & Homework",
    descAr: "كتابة وصياغة البحوث الأكاديمية والواجبات المدرسية والجامعية وتنسيقها باحترافية.",
    descEn: "Write and compile academic research and homework for school/university and format professionally.",
    categoryId: "student",
    price: "150 ريال",
    docsAr: "عناوين البحوث المطلوبة، شروط الصياغة وحجم الصفحات المحدد",
    docsEn: "Required research topic titles, formatting criteria and page count limits",
    completionTimeAr: "2 - 4 أيام عمل",
    completionTimeEn: "2 - 4 working days",
    keywords: ["بحوث", "واجبات", "تقارير", "طلاب", "جامعي", "homework", "research", "reports"],
    featured: false,
    visible: true,
    order: 2
  },

  // Printing & Copying
  {
    id: "print-normal",
    titleAr: "طباعة مستندات عادية (أسود/أبيض)",
    titleEn: "Standard Black & White Printing",
    descAr: "طباعة ليزر سريعة وعالية الوضوح للأوراق والمستندات والخطابات الرسمية باللون الأسود.",
    descEn: "Fast B&W laser printing for documents, papers, and letters with high clarity.",
    categoryId: "printing",
    price: "1 ريال (للصفحة)",
    docsAr: "الملف المطلوب طباعته بصيغة PDF أو Word",
    docsEn: "File to print in PDF or Word format",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["طباعة", "مستندات", "أوراق", "أسود", "print", "document", "paper"],
    featured: false,
    visible: true,
    order: 1
  },
  {
    id: "print-color",
    titleAr: "طباعة ملونة",
    titleEn: "Color Printing",
    descAr: "طباعة ليزر ملونة عالية الدقة للمنشورات والصور والمستندات والتقارير الدراسية.",
    descEn: "High-resolution color laser printing for flyers, photos, documents, and academic reports.",
    categoryId: "printing",
    price: "3 ريال (للصفحة)",
    docsAr: "الملف المطلوب طباعته بصيغة PDF أو Word",
    docsEn: "File to print in PDF or Word format",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["طباعة", "ملون", "صور", "أوراق", "color print", "photos"],
    featured: false,
    visible: true,
    order: 2
  },
  {
    id: "print-binding",
    titleAr: "تجليد الكتب والملفات",
    titleEn: "Book & File Binding",
    descAr: "تجليد سلكي وبلاستيكي وحراري متين للتقارير، البحوث، والمذكرات الدراسية.",
    descEn: "Spiral, plastic, and thermal binding for reports, research papers, and studies.",
    categoryId: "printing",
    price: "15 ريال",
    docsAr: "الأوراق أو الملفات المطبوعة المطلوب تجليدها وتنسيقها",
    docsEn: "Printed papers or pages to bind and format",
    completionTimeAr: "فوري",
    completionTimeEn: "Instant",
    keywords: ["تجليد", "سلك", "تجليد حراري", "تجليد كتب", "book binding", "spiral"],
    featured: false,
    visible: true,
    order: 3
  }
];

export const defaultFAQs: FAQItem[] = [
  {
    id: "faq-1",
    qAr: "ما هي أوقات العمل في مكتب كود خدمات؟",
    qEn: "What are the working hours at Code Services?",
    aAr: "يسعدنا خدمتكم يومياً وحتى الساعة 11 مساءً لتلبية جميع متطلباتكم الإلكترونية والحكومية في جدة.",
    aEn: "We are pleased to serve you daily until 11:00 PM to meet all your electronic and governmental service needs in Jeddah.",
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
  textAr: "📢 أوقات عمل العيد: نسعد بخدمتكم من 9 صباحاً وحتى 11 مساءً طوال فترة الإجازة!",
  textEn: "📢 Holiday Working Hours: We are open from 9:00 AM to 11:00 PM throughout the Eid holidays!",
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
    contactHoursVal: "مفتوح حتى الساعة 11 مساءً",
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
    faqA1: "نحن نسعد بخدمتكم يومياً وحتى الساعة 11 مساءً لتلبية جميع احتياجاتكم الإلكترونية والحكومية.",
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
    contactHoursVal: "Open until 11:00 PM",
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
    faqA1: "We are pleased to serve you daily until 11:00 PM to meet all your electronic and governmental service needs.",
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
