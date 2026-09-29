const fs = require('fs');
const path = require('path');

const extractedPath = 'C:/Users/XPRISTO/.gemini/antigravity/scratch/abu_suhail_extracted_data.json';
const translationsPath = path.join(__dirname, '../src/data/translations.ts');

const extractedData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

// Helper for slug generation
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Arabic to English dictionary & mapping rules
const translationDict = {
  // Reef
  'دعم المواشي': { en: 'Livestock Farming Support', descEn: 'Comprehensive livestock registration and follow-up support.', cat: 'reef-feasibility', docsAr: 'الهوية الوطنية، شهادة صحية، وثيقة عمل حر أو سجل مواشي', docsEn: 'National ID, Health Cert, Livestock Registry' },
  'دراسة جدوى زيت التين الشوكي | ريف': { en: 'Prickly Pear Oil Feasibility Study | Reef', descEn: 'Professional Reef feasibility study for prickly pear oil production.', cat: 'reef-feasibility' },
  'دراسة جدوى كماليات الجلدية | ريف': { en: 'Leather Goods Feasibility Study | Reef', descEn: 'Professional Reef feasibility study for leather accessories & goods.', cat: 'reef-feasibility' },
  'دراسة جدوى أنتاج العبكر (البروبلس ) | ريف': { en: 'Propolis Production Feasibility Study | Reef', descEn: 'Professional feasibility study for bee propolis production and extraction.', cat: 'reef-feasibility' },
  'دراسة جدوى انتاج الخل الطبيعي | ريف': { en: 'Natural Vinegar Feasibility Study | Reef', descEn: 'Feasibility study for natural fruit and agricultural vinegar brewing.', cat: 'reef-feasibility' },
  'دراسة جدوى المعجنات | ريف': { en: 'Pastries & Bakery Feasibility Study | Reef', descEn: 'Feasibility study for artisanal and rural pastry and bakery production.', cat: 'reef-feasibility' },
  'دراسة جدوى السجاد من الصوفي الحيواني | ريف': { en: 'Wool Carpet Weaving Feasibility Study | Reef', descEn: 'Feasibility study for handmade wool rugs and carpet crafting.', cat: 'reef-feasibility' },
  'دراسة جدوى الأسماك المجففة | ريف': { en: 'Dried Fish Production Feasibility Study | Reef', descEn: 'Feasibility study for artisanal dried fish preservation and processing.', cat: 'reef-feasibility' },
  'دراسة جدوى الأحذية | ريف': { en: 'Handcrafted Footwear Feasibility Study | Reef', descEn: 'Feasibility study for handmade and traditional leather footwear production.', cat: 'reef-feasibility' },
  'دراسة جدوى الأثاث | ريف': { en: 'Rural Furniture Crafting Feasibility Study | Reef', descEn: 'Feasibility study for artisanal wooden and woven rural furniture.', cat: 'reef-feasibility' },
  'دراسة جدوى النعناع والحبق ريف': { en: 'Mint & Basil Farming Feasibility Study | Reef', descEn: 'Feasibility study for mint, basil, and aromatic herbs cultivation.', cat: 'reef-feasibility' },
  'دراسة جدوى مخلفات النباتات والروث': { en: 'Compost & Organic Fertilizer Feasibility Study', descEn: 'Feasibility study for recycling plant residues into organic compost.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف للمربيات': { en: 'Fruit Jams Production Feasibility Study | Reef', descEn: 'Feasibility study for artisanal natural fruit jams and preserves.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف للمخللات': { en: 'Artisanal Pickles Feasibility Study | Reef', descEn: 'Feasibility study for traditional and commercial pickle production.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف للعطور': { en: 'Natural Perfumes & Essential Oils Feasibility Study', descEn: 'Feasibility study for botanical perfumery and floral essences.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف للشموع': { en: 'Handmade Scented Candles Feasibility Study | Reef', descEn: 'Feasibility study for soy and beeswax artisanal candle crafting.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف للاقط': { en: 'Dried Curd (Eqt) Feasibility Study | Reef', descEn: 'Feasibility study for traditional fermented dried yogurt & dairy (Eqt).', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - زيت اللوز': { en: 'Almond Oil Extraction Feasibility Study | Reef', descEn: 'Feasibility study for cold-pressed natural sweet & bitter almond oil.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - جلود': { en: 'Leather Tanning & Goods Feasibility Study | Reef', descEn: 'Feasibility study for natural leather tanning and artisan products.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - الخياطة والحياكة والتطريز': { en: 'Sewing, Knitting & Embroidery Feasibility Study | Reef', descEn: 'Feasibility study for bespoke sewing, tailoring, and traditional embroidery.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - التحف': { en: 'Handmade Antiques & Souvenirs Feasibility Study | Reef', descEn: 'Feasibility study for cultural handicrafts, pottery, and decorative antiques.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - دبس الرمان': { en: 'Pomegranate Molasses Feasibility Study | Reef', descEn: 'Feasibility study for artisanal pure pomegranate syrup & molasses.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - الفواكه المجففة': { en: 'Dried Fruits Processing Feasibility Study | Reef', descEn: 'Feasibility study for solar and dehydrated fruit snacks production.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - العصائر': { en: 'Fresh Natural Juices Feasibility Study | Reef', descEn: 'Feasibility study for farm-fresh bottled natural fruit juices.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - الصابون': { en: 'Natural Soap Crafting Feasibility Study | Reef', descEn: 'Feasibility study for artisan olive oil and herbal natural soaps.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - السمن': { en: 'Traditional Clarified Ghee Feasibility Study | Reef', descEn: 'Feasibility study for authentic country ghee and butter production.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - السدو': { en: 'Traditional Sadu Weaving Feasibility Study | Reef', descEn: 'Feasibility study for authentic heritage Sadu textile weaving.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - الزيوت العطرية': { en: 'Aromatic Essential Oils Feasibility Study | Reef', descEn: 'Feasibility study for floral and herbal essential oils distillation.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - الحناء': { en: 'Henna Processing & Grinding Feasibility Study | Reef', descEn: 'Feasibility study for natural henna leaf processing and packaging.', cat: 'reef-feasibility' },
  'دراسة جدوى ريف - الخوص من سعف النخل': { en: 'Palm Frond Weaving (Khoos) Feasibility Study | Reef', descEn: 'Feasibility study for artisanal palm leaf basketry and mats.', cat: 'reef-feasibility' },

  // Grants & Support
  'التسجيل في دعم ريف | دعم ريف يصل الى 4500 شهرياً': { en: 'Reef Rural Support Registration (Up to 4,500 SAR/mo)', descEn: 'Full registration and eligibility filing for the Ministry of Environment Reef grant.', cat: 'government-grants' },
  'دعم ريف يصل الى 4500 شهرياً .': { en: 'Reef Rural Support Program (Up to 4,500 SAR/mo)', descEn: 'Reef agricultural grant application and documentation review.', cat: 'government-grants' },
  'التسجيل في حافز | اعانة البحث عن عمل': { en: 'Hafiz Job Seekers Grant Registration', descEn: 'Official registration for the HRDF Hafiz employment search monthly allowance.', cat: 'government-grants' },
  'دعم توصيل الطلبات يصل الى 3000 شهرياً .': { en: 'Delivery Drivers Support Program (Up to 3,000 SAR/mo)', descEn: 'Registration in the Ministry of Transport gig delivery income incentive grant.', cat: 'government-grants' },
  'دعم وصول يصل الى 1100 شهرياً .': { en: 'Wusool Working Women Transport Subsidy (Up to 1,100 SAR/mo)', descEn: 'Transportation support program registration for female workforce in private sector.', cat: 'government-grants' },
  'دعم ساند يصل الى 5400 شهرياً .': { en: 'Saned Unemployment Insurance Grant (Up to 5,400 SAR/mo)', descEn: 'Application and claim filing for GOSI Saned temporary unemployment compensation.', cat: 'government-grants' },
  'التسجيل في برنامج دعم النقل الموجه': { en: 'Ride-Hailing Transport Support Registration', descEn: 'HRDF incentive program for full-time ride-hailing drivers (Uber/Careem).', cat: 'government-grants' },
  'تمهير يصل الى 3000 شهرياً .': { en: 'Tamheer On-The-Job Training Program (Up to 3,000 SAR/mo)', descEn: 'Application for Tamheer graduate practical training stipend program.', cat: 'government-grants' },
  'برنامج قرة .': { en: 'Qurrah Childcare Childcare Support Program', descEn: 'HRDF Qurrah child care center subsidy for working mothers in private sector.', cat: 'government-grants' },
  'توطين .': { en: 'Tawteen Saudization Incentive Program', descEn: 'Enrollment in wage subsidies for localized Saudi workforce roles.', cat: 'government-grants' },
  'دعم حساب المواطن يصل الى 720 شهريا .': { en: 'Citizen Account Support Enrollment (Up to 720 SAR/mo)', descEn: 'Citizen Account household registry, bank linkage, and income verification.', cat: 'social-security' },
  'التسجيل في طاقات': { en: 'Taqat National Labor Portal Registration', descEn: 'Job seeker profile registration and CV publishing on the Taqat HRDF portal.', cat: 'remote-jobs' },
  'التسجيل في التأهيل الشامل': { en: 'Comprehensive Rehabilitation Support Registration', descEn: 'Medical aid and financial support registration for special care beneficiaries.', cat: 'government-grants' },

  // Rental Contracts
  'إلغاء عقد الإيجار .': { en: 'Cancel Tenancy Rental Contract', descEn: 'Official digital termination and closure of active residential/commercial lease in Ejar.', cat: 'contracts-ops' },
  'تجديد عقد الإيجار | إصدار عقد جديد': { en: 'Renew or Issue Unified Rental Lease', descEn: 'Drafting and registering unified digital tenancy contract via Ejar network.', cat: 'contracts-ops' },
  'أصدار عقد ايجار سكني': { en: 'Issue Residential Ejar Lease Contract', descEn: 'Certified residential rental agreement documentation and lessor-tenant approvals.', cat: 'contracts-ops' },

  // Official Documents & Licenses
  'معروف .': { en: 'Maroof E-Commerce Registration', descEn: 'Official store verification and linkage with Ministry of Commerce Maroof certificate.', cat: 'freelance-licenses' },
  'أستخراج مشهد ضمان .': { en: 'Extract Social Security Proof Certificate', descEn: 'Issuing official electronic statement of social insurance beneficiary status.', cat: 'social-security' },
  'أستخراج شهادة خلو سوابق .': { en: 'Police Clearance Certificate (Criminal Record Check)', descEn: 'Official digital non-conviction certificate issuance via Absher and Ministry of Interior.', cat: 'freelance-licenses' },
  'أستخراج شهادة شطب السجل التجاري': { en: 'Commercial Registration Cancellation Certificate', descEn: 'Official clearance and closure proof for liquidated commercial records.', cat: 'commerce-business' },
  'أستخراج وثيقة العمل الحر للاسر المنتجة .': { en: 'Cottage Industries Freelance Certificate', descEn: 'Issuing Ministry of Human Resources freelance license for productive families.', cat: 'freelance-licenses' },
  'أستخراج رخصة الوساطة العقارية': { en: 'Real Estate Brokerage License (Val)', descEn: 'Official Real Estate General Authority (REGA) Val brokerage license issuance.', cat: 'freelance-licenses' },
  'أستخراج شهادة وافي .': { en: 'Wafi Off-Plan Sales & Marketing Certificate', descEn: 'Certification for marketing off-plan property developments through Wafi portal.', cat: 'freelance-licenses' },
  'أستخراج شهادة الأجر الخاضع للأشتراك .': { en: 'Contributory Wage Certificate (GOSI)', descEn: 'Official GOSI insured wage breakdown statement for banking and immigration.', cat: 'gosi' },
  'أستخراج شهادة مدد واجور المشترك في التأمينات الأجتماعية .': { en: 'GOSI Contribution Periods & Wages Record', descEn: 'Detailed service history and contribution period transcript from Social Insurance.', cat: 'gosi' },
  'أستخراج سجل تجاري .': { en: 'Issue New Commercial Registration (CR)', descEn: 'Instant electronic company & establishment CR registration via Ministry of Commerce.', cat: 'commerce-business' },
  'أستخراج وثيقة رقمن .': { en: 'Reqman Digital Translation / Transcription License', descEn: 'Certified digital document transcribing and digitizing freelance credential.', cat: 'freelance-licenses' },
  'أستخراج شهادة توثيق متجرك الإلكتروني .': { en: 'E-Commerce Store Verification Certificate (BCI)', descEn: 'Official store authentication badge via Saudi Business Center (SBC).', cat: 'freelance-licenses' },
  'أستخراج رخصة حرفي | الحرف اليدوية .': { en: 'Handicrafts Artisan Professional License', descEn: 'Certified artisan and craftsman accreditation from the Heritage Commission.', cat: 'freelance-licenses' },
  'أستخراج رخصة نحال .': { en: 'Beekeeper Professional License', descEn: 'Ministry of Environment certified beekeeping and honey apiary permit.', cat: 'freelance-licenses' },
  'أستخراج رخصة فال العقارية .': { en: 'Val Real Estate Practitioner License', descEn: 'Official individual and corporate Val property management and brokerage license.', cat: 'freelance-licenses' },
  'أستخراج رخصة مرشد سياحي .': { en: 'Tourist Tour Guide Professional License', descEn: 'Ministry of Tourism certified tourist guiding accreditation.', cat: 'freelance-licenses' },
  'أستخراج شهادة تسجيل ضريبة القيمة المضافة .': { en: 'VAT Tax Registration Certificate (ZATCA)', descEn: 'Official Value Added Tax taxpayer registration certificate from ZATCA.', cat: 'zatca' },

  // Appeals & Complaints
  'تقديم أعتراض في حساب المواطن .': { en: 'Submit Citizen Account Appeal', descEn: 'Filing legal appeals against ineligibility or reduced monthly entitlement amounts.', cat: 'appeals-complaints' },
  'تقديم أعتراض في الضمان الأجتماعي .': { en: 'Submit Social Security Ineligibility Appeal', descEn: 'Filing documentation appeal for rejected or incomplete Social Security files.', cat: 'appeals-complaints' },
  'تقديم شكوى في بنك التنمية .': { en: 'Submit Social Development Bank Complaint', descEn: 'Official dispute and delay resolution claim with SDB administration.', cat: 'appeals-complaints' },
  'تقديم شكوى في منصة العمل الحر .': { en: 'Submit Freelance Portal Complaint', descEn: 'Resolution filing for document verification or credential issues on Freelance portal.', cat: 'appeals-complaints' },
  'تقديم شكوى في طاقات .': { en: 'Submit Taqat Portal Complaint', descEn: 'Addressing account suspension, job matching penalties, or profile verification errors.', cat: 'appeals-complaints' },
  'تقديم شكوى في ساند .': { en: 'Submit Saned Unemployment Insurance Dispute', descEn: 'Appealing rejected compensation requests or delayed monthly payments in Saned.', cat: 'appeals-complaints' },
  'رفع مطالبة تعويض لشركات التأمين': { en: 'Submit Insurance Claim Compensation', descEn: 'Lodging motor and health accident compensation claims with approved insurers.', cat: 'health-insurance' },
  'رفع اعتراض في حساب المواطن | تحديث ملفك في حساب المواطن': { en: 'Citizen Account Appeal & Profile Update', descEn: 'Comprehensive data rectification and appeal submission on Citizen Account.', cat: 'appeals-complaints' },
  'رفع اعتراض في الضمان الاجتماعي': { en: 'Submit Social Security Appeal', descEn: 'Filing formal review and supporting paperwork for Social Security eligibility.', cat: 'appeals-complaints' },

  // Corporate & SME Financing
  'التقديم في تمويل امتياز تجاري " الفرنشايز': { en: 'Franchise Business Financing Application', descEn: 'Financing facilitation for acquiring recognized commercial franchises via SDB.', cat: 'financing-loans' },
  'التقديم في تمويل مشاريع الأختراع': { en: 'Patents & Inventions Project Financing', descEn: 'Specialized enterprise funding for patented inventions and creative technologies.', cat: 'financing-loans' },
  'التقديم في تمويل التميز': { en: 'Excellence Enterprise Financing (Tamayuz)', descEn: 'Financing up to 4 million SAR for high-potential and distinguished business ventures.', cat: 'financing-loans' },
  'التقديم في تمويل سيولة': { en: 'Liquidity SME Working Capital Financing', descEn: 'Short-term operational liquidity funding for established enterprises and suppliers.', cat: 'financing-loans' },
  'التقديم في تمويل الألعاب الأكترونية': { en: 'Gaming & Esports Industry Financing', descEn: 'Funding program tailored for video game development studios and gaming lounges.', cat: 'financing-loans' },
  'التقديم في تمويل ريادة': { en: 'Riyadah Entrepreneurship Startup Financing', descEn: 'National Entrepreneurship Institute (Riyadah) business funding application.', cat: 'financing-loans' },

  // Jobs & Employment
  'تصميم CV باللغة العربية .': { en: 'Professional ATS Arabic Resume / CV Design', descEn: 'Customized ATS-compatible CV formatting tailored for Saudi corporate recruiters.', cat: 'remote-jobs' },
  'التقديم في وظائف شفتات .': { en: 'Shift & Part-Time Job Applications', descEn: 'Direct submission to shift-based retail and hospitality job openings.', cat: 'remote-jobs' },
  'التقديم في وظائف العمل عن بعد .': { en: 'Telework & Remote Job Applications', descEn: 'Verified telework employment program registration with accredited Saudi employers.', cat: 'remote-jobs' },
  'التقديم في وظائف جدارات .': { en: 'Jadarat Unified Employment Platform Application', descEn: 'Registration and application for Saudi government and private sector jobs in Jadarat.', cat: 'remote-jobs' },
  'التقديم في وظائف طاقات .': { en: 'Taqat National Job Matching Application', descEn: 'Active application and matching for vacancies listed on Taqat HRDF portal.', cat: 'remote-jobs' },
  'التقديم في وظائف كادر .': { en: 'Kader Employment Platform Application', descEn: 'Submission for verified administrative and executive roles across the Kingdom.', cat: 'remote-jobs' },
  'التقديم في رقمن .': { en: 'Reqman Digital Data Entry Tasks Signup', descEn: 'Registration in government and corporate digital archiving freelance tasks.', cat: 'remote-jobs' },
  'التقديم في وظائف صبار .': { en: 'Sabbar Flexible Jobs Applications', descEn: 'Hourly and daily flexible shifts registration across major brands in Saudi Arabia.', cat: 'remote-jobs' },
  'التقديم في وظائف مستقل .': { en: 'Mostaql Freelancer Profile & Proposal Setup', descEn: 'Creating and optimizing professional freelancer gig profile on Mostaql.', cat: 'remote-jobs' },
  'التقديم في وظائف Job Plus': { en: 'Job Plus Employment Application', descEn: 'Targeted resume submission for corporate listings on Job Plus.', cat: 'remote-jobs' },
  'التقديم في وظائف بيت كوم .': { en: 'Bayt.com Saudi Careers Profile & Applications', descEn: 'Creating and optimizing top-ranking Bayt.com candidate profile with auto-applies.', cat: 'remote-jobs' },
  'التقديم في وظائف كفيل .': { en: 'Kafeel Micro-Services Platform Setup', descEn: 'Setting up and publishing digital micro-services on Kafeel platform.', cat: 'remote-jobs' },
  'التقديم في وظائف لكند إن .': { en: 'LinkedIn Saudi Professional Profile Optimization', descEn: 'Complete LinkedIn headline, summary, and experience polish with recruiter visibility.', cat: 'remote-jobs' },
  'التقديم في وظائف جزئي .': { en: 'Part-Time & Student Jobs Application', descEn: 'Targeted registration for flexible student and evening part-time vacancies.', cat: 'remote-jobs' },
  'التقديم في وظائف وظيفتك علينا .': { en: 'Wadheeftak Alaina Job Search Registration', descEn: 'Assisted CV broadcast and application across executive search agencies.', cat: 'remote-jobs' },
  'التقديم في وظائف نسعى .': { en: 'Nas\'aa Employment Portal Application', descEn: 'Direct registration and skill testing on Nas\'aa job placement network.', cat: 'remote-jobs' },
  'التقديم في وظائف مرن .': { en: 'Marn Flexible Hourly Jobs Application', descEn: 'Onboarding and background checks for Marn flexible part-time workforce.', cat: 'remote-jobs' },
  'التقديم في وظائف أسعى .': { en: 'As\'aa Careers Registration', descEn: 'Registering candidate credentials for regional recruitment campaigns.', cat: 'remote-jobs' },
  'بكج الوظائف .': { en: 'All-in-One Comprehensive Career Package', descEn: 'Full package: Professional CV, LinkedIn revamp, and submission to 10+ Saudi job portals.', cat: 'remote-jobs' },

  // Gig Economy & Delivery Driver Registrations
  'التسجيل في أوبر .': { en: 'Uber Captain Driver Registration', descEn: 'Driver account setup, vehicle approval, and license verification on Uber.', cat: 'remote-jobs' },
  'التسجيل في هنقرستيشن .': { en: 'HungerStation Rider Registration', descEn: 'Fast-track food delivery rider onboarding on HungerStation.', cat: 'remote-jobs' },
  'التسجيل في شقردي .': { en: 'Shaqardi Courier Registration', descEn: 'Courier onboarding and identity verification for Shaqardi delivery app.', cat: 'remote-jobs' },
  'التسجيل في مرسول .': { en: 'Mrsool Captain Driver Registration', descEn: 'Merchant & parcel delivery captain account setup on Mrsool.', cat: 'remote-jobs' },
  'التسجيل في كريم .': { en: 'Careem Captain Driver Registration', descEn: 'Driver onboarding and vehicle inspection filing for Careem ride-hailing.', cat: 'remote-jobs' },
  'التسجيل في تويو .': { en: 'Toyou Courier Driver Registration', descEn: 'Delivery rider registration on ToYou on-demand lifestyle app.', cat: 'remote-jobs' },
  'التسجيل في جاهز .': { en: 'Jahez Food Delivery Rider Registration', descEn: 'Courier onboarding and work permit registration for Jahez.', cat: 'remote-jobs' },
  'التسجيل في إيجو .': { en: 'Ego Ride-Hailing Driver Registration', descEn: 'Captain profile setup and documents upload for Ego ride app.', cat: 'remote-jobs' },
  'التسجيل في بولت .': { en: 'Bolt Driver Registration', descEn: 'Fast vehicle registration and identity check for Bolt drivers in Saudi Arabia.', cat: 'remote-jobs' },
  'التسجيل في جيني .': { en: 'Jeeny Driver & Taxi Registration', descEn: 'Driver account setup and vehicle linkage on Jeeny.', cat: 'remote-jobs' },
  'التسجيل في نعناع .': { en: 'Nana Grocery Shopper & Courier Registration', descEn: 'Grocery shopping and delivery courier registration on Nana.', cat: 'remote-jobs' },
  'التسجيل في مستر مندوب .': { en: 'Mr Mandoob Delivery Driver Registration', descEn: 'Logistics and parcel delivery onboarding on Mr Mandoob app.', cat: 'remote-jobs' },
  'التسجيل في ذا شفز .': { en: 'The Chefz Fine Food Delivery Registration', descEn: 'Gourmet delivery driver registration and onboarding on The Chefz.', cat: 'remote-jobs' },
  'التسجيل في وصليني .': { en: 'Wasaleny Women Transport Driver Registration', descEn: 'Specialized female-only ride-hailing driver registration on Wasaleny.', cat: 'remote-jobs' },

  // Ministry of Justice
  'إصدار صك حضانة': { en: 'Issue Child Custody Deed (Najiz)', descEn: 'Electronic application and judge endorsement for child custody proof deed.', cat: 'najiz-justice' },
  'إنشاء سند لأمر': { en: 'Create Promissory Note (Nafith)', descEn: 'Digital Nafith promissory note issuance with legally enforceable executive power.', cat: 'najiz-justice' },
  'رفع دعوى': { en: 'File a Court Lawsuit (Najiz)', descEn: 'Drafting and filing formal lawsuit statements in commercial, general, or labor courts.', cat: 'najiz-justice' },
  'توثيق الطلاق': { en: 'Divorce Registration & Certification (Najiz)', descEn: 'Electronic documentation of mutual or verified divorce proceedings on Najiz.', cat: 'najiz-justice' },
  'إصدار وكالة فردية | إصدار وكالة جماعية': { en: 'Issue Individual or Collective Legal POA', descEn: 'Instant digital Power of Attorney issuance with authorized notary permissions.', cat: 'najiz-justice' },

  // Consultation & Eligibility Studies
  'أطلع على مشكلة في دعمك': { en: 'Support Grant Ineligibility & Issue Diagnostic', descEn: 'Deep-dive review into reasons for grant rejections, deductions, or holds.', cat: 'social-security' },
  'دراسة حالتك الأجتماعية لمعرفة الدعم المناسب لك': { en: 'Social Profile Evaluation for Matching Grants', descEn: 'Comprehensive assessment to identify all non-conflicting government aid programs.', cat: 'social-security' },
  'أطلع على مشكلة في تمويلك': { en: 'Financing Obstacles Diagnostic & Credit Check', descEn: 'Simah debt-burden review and resolution of financing application rejections.', cat: 'financing-loans' },
  'دراسة حالتك الأجتماعية لمعرفة التمويل المناسب لك': { en: 'Personal Financial Assessment for Optimal Loans', descEn: 'Determining your maximum loan eligibility across development and private banks.', cat: 'financing-loans' },

  // Updates & Maintenance
  'تحديث البيانات في حساب المواطن': { en: 'Update Citizen Account Profile & Records', descEn: 'Updating family dependents, rental leases, and declared income on Citizen Account.', cat: 'social-security' },
  'تحديث البيانات في الضمان الأجتماعي': { en: 'Update Social Security Beneficiary Data', descEn: 'Updating household members, address, bank IBAN, and asset disclosures in HRSD.', cat: 'social-security' },
  'تحديث قرة .': { en: 'Update Qurrah Childcare Subsidy Data', descEn: 'Refreshing daycare invoice records and child attendance for Qurrah support.', cat: 'government-grants' },
  'تحديث التأهيل الشامل': { en: 'Update Comprehensive Rehabilitation Records', descEn: 'Submitting updated medical reports and re-evaluating disability allowance.', cat: 'government-grants' },
  'تحديث حافز': { en: 'Hafiz Weekly Activity & Tasks Update', descEn: 'Handling required weekly logins, training modules, and activity completion.', cat: 'government-grants' },
  'تحديث وصول': { en: 'Update Wusool Working Women Commute Logs', descEn: 'Updating workplace location, commuting hours, and trip balance on Wusool.', cat: 'government-grants' },
  'تحديث بيانات حساب المواطن و الضمان الاجتماعي المطور': { en: 'Dual Update: Citizen Account & Social Security', descEn: 'Synchronized profile and income updates across both social welfare programs.', cat: 'social-security' },
  'التسجيل في الضمان الاجتماعي المطور': { en: 'Register in Developed Social Security (HRSD)', descEn: 'Complete household eligibility filing and lease linkage for Social Security.', cat: 'social-security' },
  'التسجيل في حساب المواطن': { en: 'Register in Citizen Account Program', descEn: 'New household registration and entitlement calculation in Citizen Account.', cat: 'social-security' },

  // Personal Financing & Microloans
  'التقديم في تمويل الموسمي .': { en: 'Seasonal Business Loan Application', descEn: 'Financing for seasonal trading activities during Hajj, Ramadan, and festivals.', cat: 'financing-loans' },
  'التقديم على بطاقة بسيطة': { en: 'Baseeta Digital Credit Card Application', descEn: 'Application for Sharia-compliant digital installment credit card.', cat: 'financing-loans' },
  'التقديم في تمويل الزواج .': { en: 'Marriage Interest-Free Social Loan (SDB)', descEn: 'Up to 60,000 SAR interest-free marriage financing from Social Development Bank.', cat: 'financing-loans' },
  'التقديم في تمويل ترميم .': { en: 'Home Renovation Interest-Free Loan (SDB)', descEn: 'Up to 60,000 SAR residential renovation financing for homeowners.', cat: 'financing-loans' },
  'التقديم في تمويل الأسرة .': { en: 'Family Interest-Free Social Loan (SDB)', descEn: 'Up to 100,000 SAR interest-free loan for low-income and middle-income families.', cat: 'financing-loans' },
  'التقديم في تمويل كنف .': { en: 'Kanaf Widow & Divorced Women Loan (SDB)', descEn: 'Up to 30,000 SAR interest-free financing dedicated for widows and divorcees.', cat: 'financing-loans' },
  'التقديم في تمويل العمل الحر | النقدي .': { en: 'Freelance Cash Financing (Up to 120,000 SAR)', descEn: 'Interest-free cash financing for certified freelancers from Social Development Bank.', cat: 'financing-loans' },
  'التقديم في تمويل السيارات .': { en: 'Freelance Vehicle / Transport Financing (SDB)', descEn: 'Financing for new vehicle acquisition dedicated to ride-hailing and logistics.', cat: 'financing-loans' },
  'التقديم في تمويل إمكان .': { en: 'Emkan Digital Personal Financing', descEn: 'Instant personal loans and debt consolidation with flexible tenures via Emkan.', cat: 'financing-loans' },
  'التقديم في تمويل جنى .': { en: 'Jana Micro-Enterprise Women Financing', descEn: 'Non-profit microloans and financial empowerment for female entrepreneurs.', cat: 'financing-loans' },
  'التقديم في تمويل الأسر المنتجة .': { en: 'Productive Families Development Financing', descEn: 'Low-cost funding for home-based craft and catering micro-businesses.', cat: 'financing-loans' },
  'التقديم في تمويل سلفة .': { en: 'Sulfah Fast Digital Microloan', descEn: 'Instant micro-financing up to 20,000 SAR approved within minutes.', cat: 'financing-loans' },
  'التقديم في تمويل تمام .': { en: 'Tamam Instant Fintech Microloan', descEn: 'Fast digital microloan compliant with Sharia without salary transfer.', cat: 'financing-loans' },
  'التقديم في تمويل تسهيل .': { en: 'Tasheel Personal & Consumer Financing', descEn: 'Flexible consumer finance solutions up to 100,000 SAR.', cat: 'financing-loans' }
};

// New Categories to add to defaultCategories
const newCategories = [
  {
    id: "reef-feasibility",
    nameAr: "🌾 دعم ريف ودراسات الجدوى",
    nameEn: "Reef Program & Feasibility Studies",
    icon: "Sprout",
    order: 170,
    descAr: "دراسات جدوى متخصصة لبرنامج ريف ودعم مشاريع التنمية الريفية وتربية المواشي.",
    descEn: "Feasibility studies for the Reef program and agricultural / livestock support.",
    visible: true
  },
  {
    id: "government-grants",
    nameAr: "🎁 برامج الدعم الحكومي والتمكين",
    nameEn: "Government Grants & Aid Programs",
    icon: "Gift",
    order: 180,
    descAr: "التسجيل في برامج الدعم غير المسترد (حافز، ساند، وصول، النقل الموجه، قرة، تمهير، طاقات، التأهيل الشامل).",
    descEn: "Registration in government grant programs (Hafiz, Saned, Wusool, Tamheer, Taqat).",
    visible: true
  },
  {
    id: "freelance-licenses",
    nameAr: "📑 وثائق العمل الحر والتراخيص المهنية",
    nameEn: "Freelance Documents & Professional Licenses",
    icon: "FileCheck",
    order: 190,
    descAr: "استخراج وثائق العمل الحر، رخصة الوساطة العقارية (فال)، رخصة نحال، شهادات خلو السوابق، وتوثيق المتاجر.",
    descEn: "Freelance certificates, Real Estate brokerage licenses, Beekeeper licenses, and Store verification.",
    visible: true
  },
  {
    id: "financing-loans",
    nameAr: "💳 برامج التمويل الشخصي وتمويل المنشآت",
    nameEn: "Personal & Business Financing",
    icon: "CreditCard",
    order: 200,
    descAr: "التقديم على تمويل بنك التنمية (الأسرة، كنف، آهل، العمل الحر، ريادة، سيارات) والتمويل الشخصي الرقمي (إمكان، تمام، سلفة).",
    descEn: "Social Development Bank loans (Family, Kanaf, Freelance, Riyadah) and digital personal loans.",
    visible: true
  },
  {
    id: "remote-jobs",
    nameAr: "💼 التوظيف والعمل الحر والمنصات",
    nameEn: "Employment, Remote Jobs & Gig Economy",
    icon: "Briefcase",
    order: 210,
    descAr: "تصميم السير الذاتية الاحترافية ATS، التقديم على وظائف جدارات وطاقات والعمل عن بعد، والتسجيل في تطبيقات التوصيل والنقل.",
    descEn: "ATS CV writing, Jadarat/Taqat applications, remote jobs, and delivery app driver registrations.",
    visible: true
  },
  {
    id: "social-security",
    nameAr: "🛡️ الضمان الاجتماعي وحساب المواطن",
    nameEn: "Social Security & Citizen Account",
    icon: "Shield",
    order: 220,
    descAr: "التسجيل والتحديث في الضمان الاجتماعي المطور وحساب المواطن، تقديم الاعتراضات ودراسة الأهلية.",
    descEn: "Registration and data updates in Social Security and Citizen Account, with appeal submissions.",
    visible: true
  },
  {
    id: "appeals-complaints",
    nameAr: "⚖️ الشكاوى والاعتراضات الرسمية",
    nameEn: "Official Complaints & Appeals",
    icon: "Scale",
    order: 230,
    descAr: "رفع الشكاوى والاعتراضات لدى بنك التنمية، منصة العمل الحر، طاقات، ساند، وحساب المواطن.",
    descEn: "Submitting official objections and complaints to Development Bank, Freelance portal, and Taqat.",
    visible: true
  }
];

// Load existing translations file
const fileContent = fs.readFileSync(translationsPath, 'utf8');

// Parse existing defaultCategories
const catMatch = fileContent.match(/export const defaultCategories: Category\[\] = (\[[\s\S]*?\n\];)/);
let existingCategories = eval(catMatch[1].replace(/;$/, ''));

// Add missing categories
newCategories.forEach(nCat => {
  if (!existingCategories.some(c => c.id === nCat.id)) {
    existingCategories.push(nCat);
  }
});

// Parse existing defaultServices
const servMatch = fileContent.match(/export const defaultServices: ServiceItem\[\] = (\[[\s\S]*?\n\];)/);
let existingServices = eval(servMatch[1].replace(/;$/, ''));

console.log('Existing services before update:', existingServices.length);

const existingTitlesSet = new Set(existingServices.map(s => s.titleAr.trim().replace(/[.|\-_،]/g, '')));

let addedCount = 0;
let updatedCount = 0;
let lastOrder = existingServices.reduce((max, s) => Math.max(max, s.order || 0), 0);

// Iterate through extracted products
extractedData.categories.forEach(cat => {
  cat.products.forEach(p => {
    const rawName = p.name.trim();
    const cleanName = rawName.replace(/^[.\s]+|[.\s]+$/g, '');
    const normName = cleanName.replace(/[.|\-_،]/g, '');

    // Check if already in existing services
    const existingIndex = existingServices.findIndex(s => {
      const sNorm = s.titleAr.trim().replace(/[.|\-_،]/g, '');
      return sNorm === normName;
    });

    const info = translationDict[rawName] || translationDict[cleanName] || {};
    const catId = info.cat || "general";
    const titleEn = info.en || cleanName;
    const descAr = info.descAr || (p.promotion_title ? `${p.promotion_title}. تقديم ومتابعة رسمية عبر كود خدمات.` : `إنجاز معاملة ${cleanName} رسمياً وبأعلى دقة ومتابعة مستمرة حتى الانتهاء.`);
    const descEn = info.descEn || `Official processing and dedicated follow-up for ${titleEn} via Code Services.`;
    const priceFormatted = p.sale_price ? `${p.sale_price} ريال` : (p.regular_price ? `${p.regular_price} ريال` : "حسب الاتفاق");

    if (existingIndex >= 0) {
      // Update image / price if not set
      if (p.image && !existingServices[existingIndex].image) {
        existingServices[existingIndex].image = p.image;
        updatedCount++;
      }
      if (p.sale_price) {
        existingServices[existingIndex].salePrice = `${p.sale_price} ريال`;
      }
      if (p.regular_price) {
        existingServices[existingIndex].regularPrice = `${p.regular_price} ريال`;
      }
    } else {
      // Create new ServiceItem
      lastOrder += 10;
      const slugId = `serv-${p.id || slugify(titleEn) || Date.now()}`;
      
      const newService = {
        id: slugId,
        titleAr: cleanName,
        titleEn: titleEn,
        descAr: descAr,
        descEn: descEn,
        categoryId: catId,
        price: priceFormatted,
        docsAr: info.docsAr || "الهوية الوطنية وبيانات الحساب الرسمي للتنفيذ",
        docsEn: info.docsEn || "National ID and necessary account credentials",
        completionTimeAr: "خلال 24-48 ساعة عمل",
        completionTimeEn: "Within 24-48 business hours",
        keywords: [
          cleanName,
          titleEn,
          catId,
          ...(p.promotion_title ? [p.promotion_title] : [])
        ],
        featured: false,
        visible: true,
        order: lastOrder,
        image: p.image || undefined,
        salePrice: p.sale_price ? `${p.sale_price} ريال` : undefined,
        regularPrice: p.regular_price ? `${p.regular_price} ريال` : undefined,
        promotionTitle: p.promotion_title || undefined
      };

      existingServices.push(newService);
      existingTitlesSet.add(normName);
      addedCount++;
    }
  });
});

console.log('Services added:', addedCount);
console.log('Services updated:', updatedCount);
console.log('Total services now:', existingServices.length);

// Generate updated translations file content
let newContent = fileContent;

// 1. Ensure ServiceItem interface has image and pricing properties
newContent = newContent.replace(
  /export interface ServiceItem \{[\s\S]*?\}/,
  `export interface ServiceItem {
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
  image?: string;
  salePrice?: string;
  regularPrice?: string;
  promotionTitle?: string;
}`
);

// 2. Replace defaultCategories
const formattedCategories = JSON.stringify(existingCategories, null, 2);
newContent = newContent.replace(
  /export const defaultCategories: Category\[\] = \[[\s\S]*?\n\];/,
  `export const defaultCategories: Category[] = ${formattedCategories};`
);

// 3. Replace defaultServices
const formattedServices = JSON.stringify(existingServices, null, 2);
newContent = newContent.replace(
  /export const defaultServices: ServiceItem\[\] = \[[\s\S]*?\n\];/,
  `export const defaultServices: ServiceItem[] = ${formattedServices};`
);

fs.writeFileSync(translationsPath, newContent, 'utf8');
console.log('Successfully written updated catalog to src/data/translations.ts');
