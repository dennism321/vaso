import type { PracticeArea } from "@/lib/practice-areas";

export const statsEn = [
  { value: 20, suffix: "+", label: "years in the courtroom", noAnimate: false },
  { value: 8, suffix: "", label: "areas of legal expertise", noAnimate: false },
  { value: 4, suffix: "", label: "lawyers on our team", noAnimate: false },
  { value: 2014, suffix: "", label: "year the firm was founded", noAnimate: true },
];

export const credentialsEn = [
  "Counsel before the Supreme Court (Areios Pagos)",
  "Member of the Athens Bar Association",
  "Member of the Association of Criminal and Trial Lawyers",
  "Speaker at legal conferences",
  "Regular legal commentator in the media",
];

export const valuesEn = [
  {
    icon: "user",
    title: "Personal attention",
    text: "Every case has a responsible lawyer who knows it in depth and is available when you need them.",
  },
  {
    icon: "target",
    title: "Strategy from day one",
    text: "We design the defence from the pre-trial stage, because that is where so much of what follows is decided.",
  },
  {
    icon: "lock",
    title: "Absolute confidentiality",
    text: "Legal privilege is not a formality for us — it is a personal commitment to you.",
  },
  {
    icon: "scale",
    title: "Honest advice",
    text: "We explain options, risks and cost clearly, before every important decision.",
  },
];

export const processStepsEn = [
  {
    title: "Contact",
    text: "By phone, through the form, or by booking online. For urgent criminal matters, call the mobile number directly.",
  },
  {
    title: "Assessment",
    text: "We study the documents and the facts, and explain clearly where you stand in law.",
  },
  {
    title: "Strategy",
    text: "We set a plan with realistic goals, a timeline and a written fee agreement.",
  },
  {
    title: "Representation",
    text: "We represent you at every stage, with continuous updates until the final decision.",
  },
];

export const notableCasesEn = [
  {
    tag: "Victim representation",
    title: "Trial for the Tempi railway disaster",
    text: "Representation of victims’ relatives in the trial for the 2023 disaster.",
  },
  {
    tag: "State liability",
    title: "First judgment holding the State liable for post-vaccination injury",
    text: "A court decision recognising the Greek State’s liability for serious injury to a citizen after vaccination.",
  },
  {
    tag: "Criminal defence",
    title: "Acquittal on appeal after nine years in custody",
    text: "Defence of a taekwondo coach who was acquitted at second instance.",
  },
  {
    tag: "Serious crime",
    title: "The Suzanne Eaton homicide case in Crete",
    text: "Handling of the case concerning the murder of the American biologist, which drew international attention.",
  },
  {
    tag: "Criminal defence",
    title: "Acquittal of a cleric on a rape charge",
    text: "Defence of a cleric of a Holy Metropolis in Crete, who was acquitted by the court.",
  },
];

export const teamEn = [
  {
    role: "Founder · Counsel before the Supreme Court",
    focus: ["Criminal Law", "Criminal defence", "Victim representation"],
    bio: "In the courtroom since 2004, she personally handles high-complexity cases of public interest throughout Greece.",
  },
  {
    role: "Lawyer",
    focus: ["Criminal Law", "Civil & Commercial", "Administrative", "Immigration law"],
    bio: "A member of the team since 2019. She began as a trainee and now handles criminal cases as well as civil, commercial, administrative and immigration matters.",
  },
  {
    role: "Lawyer",
    focus: ["Criminal Law", "Criminology"],
    bio: "Graduate of the Law School of Democritus University of Thrace (2017), with a master’s in Criminal and Criminological Studies, specialising in criminal law.",
  },
  {
    role: "Lawyer",
    focus: ["Administrative Law", "Commercial Law", "Civil Law", "Enforcement"],
    bio: "Handles damages claims against the State (Arts. 105–106 of the Introductory Law of the Civil Code), public contracts, recovery of commercial debts, property, associations and press matters.",
  },
];

export const timelineEn = [
  {
    year: "Studies",
    title: "Zosimaia School of Ioannina & Athens Law School",
    text: "Raised with the values of the Epirus tradition, she studied Law at the University of Athens.",
  },
  {
    year: "2004",
    title: "Lead counsel at Alexis Kougias’s firm",
    text: "A decade on the front line, handling some of the country’s most demanding criminal cases.",
  },
  {
    year: "2014",
    title: "Founding of her own law firm",
    text: "She established the practice with criminal law at its core and a philosophy of personal attention to every case.",
  },
  {
    year: "2014–15",
    title: "Scientific associate at the Hellenic Parliament",
    text: "Experience in the legislative process that enriches her approach to interpreting and applying the law.",
  },
  {
    year: "2019+",
    title: "Growing the team",
    text: "The firm expands with new colleagues into related fields: administrative, civil and commercial law, and mediation.",
  },
  {
    year: "Today",
    title: "Cases of national importance",
    text: "From representing victims’ families in the Tempi trial to the first judgment holding the State liable for post-vaccination injury.",
  },
];

export const faqsEn = [
  {
    q: "I have been arrested or summoned to give a statement. What should I do?",
    a: "Do not make any statement before speaking to a lawyer. You have the right to counsel from the first moment, the right to remain silent, and the right to ask for time to prepare. Call us immediately on the mobile number for urgent assistance.",
  },
  {
    q: "How are the firm’s fees set?",
    a: "Fees are agreed in writing before we take on the case, based on the subject-matter, complexity and expected work. There are no hidden charges.",
  },
  {
    q: "Can I have a remote meeting?",
    a: "Yes. In addition to meetings at our office, we offer video calls and telephone advice. You can book a time that suits you online.",
  },
  {
    q: "Is what we discuss confidential?",
    a: "Absolutely. Everything you share with us is covered by legal professional privilege, which is protected by law — even if you do not ultimately instruct us.",
  },
  {
    q: "Do you take cases outside Athens?",
    a: "Yes. We represent clients before courts throughout Greece, from Thessaly to Crete, and before the Supreme Court.",
  },
  {
    q: "What should I bring to the first meeting?",
    a: "Any document related to the case: summonses, indictments, judgments, contracts, correspondence, and a short timeline of events. If you do not have something, do not worry — we will guide you.",
  },
];

export const practiceAreasEn: Record<string, Omit<PracticeArea, "slug" | "icon">> = {
  "poiniko-dikaio": {
    title: "Criminal Law",
    category: "Criminal Law",
    short:
      "Defence of the accused and representation of victims at every stage of the criminal process, from the preliminary inquiry to the Supreme Court.",
    intro: [
      "Criminal law is the core of our practice. For more than two decades we have handled cases of every degree of difficulty — from in-flagrante procedures to complex felony trials that occupy public debate.",
      "We know that a criminal charge touches a person’s liberty, career and family. That is why we design the defence from the first moment, with a thorough study of the file, work with technical experts and careful preparation of every procedural step.",
    ],
    services: [
      "Appearance at the preliminary inquiry, investigation and trial",
      "Arrests and in-flagrante procedure",
      "Pre-trial detention, release applications and restrictive conditions",
      "Offences against life and bodily integrity",
      "Offences against sexual freedom",
      "Economic crime: fraud, embezzlement, money laundering",
      "Domestic violence",
      "Civil-party representation for victims",
      "Appeals, cassation and retrial",
    ],
    approach:
      "From the first contact to a final judgment, your case is in the hands of criminal lawyers with long experience in every criminal court in the country.",
    faqs: [
      {
        q: "When should I contact a criminal lawyer?",
        a: "As soon as possible — ideally before any statement or examination by the authorities. Choices made at the pre-trial stage often decide the course of the case.",
      },
      {
        q: "Can I ask for time before I give a statement?",
        a: "Yes. Before you give a statement to the investigating judge you have the right to ask for time to study the file and prepare with your lawyer.",
      },
      {
        q: "Do you also represent victims of crime?",
        a: "Yes. We file complaints and appear as civil party so that the victim takes an active part in the proceedings.",
      },
    ],
  },
  "epixeirimatiko-dikaio": {
    title: "Business Law",
    category: "Business Law",
    short:
      "Legal protection for businesses: contracts, corporate issues, commercial disputes and criminal liability of management.",
    intro: [
      "A business needs counsel who understands both the law and day-to-day commercial reality. We support companies and entrepreneurs from incorporation through to complex disputes.",
      "Our criminal-law expertise allows us to prevent and manage the criminal-liability risks of directors — a field where commercial and criminal law increasingly meet.",
    ],
    services: [
      "Formation, conversion and operation of companies",
      "Drafting and review of commercial contracts",
      "Commercial disputes and negotiations",
      "Recovery of commercial debts",
      "Corporate crime and directors’ liability",
      "Regulatory compliance and internal controls",
    ],
    approach:
      "Practical solutions with an eye on continuity and reputation — prevention where possible, determination where necessary.",
    faqs: [
      {
        q: "Can a company manager be criminally liable?",
        a: "Yes, in certain cases — for example debts to the State or economic crime. An early legal assessment helps prevent and manage those risks.",
      },
      {
        q: "Do you provide ongoing legal support for businesses?",
        a: "Yes. We offer retainers tailored to the needs of each business.",
      },
    ],
  },
  "trapeziko-dikaio": {
    title: "Banking & Financial Protection",
    category: "Banking Law",
    short:
      "Protection of consumers and businesses against banks, debt-servicers and financial institutions.",
    intro: [
      "Disputes with banks and servicers are often unequal: on one side an institution with specialist lawyers, on the other a citizen or a small business. Our aim is to restore that balance.",
      "We examine every contract and every account movement, identify unfair terms and unlawful charges, and pursue solutions — out of court or in court.",
    ],
    services: [
      "Disputes with banks and debt-servicers",
      "Debt restructuring and the out-of-court mechanism",
      "Unfair terms in loan agreements",
      "Unauthorised transactions and electronic fraud",
      "Objections to auctions and enforcement",
      "Protection of the primary residence",
    ],
    approach:
      "Documented claims, with a detailed review of contracts and figures, so that every argument rests on solid ground.",
    faqs: [
      {
        q: "I was defrauded and the bank refuses to refund me. What can I do?",
        a: "For unauthorised transactions the law generally requires the provider to refund, unless it proves fraud or gross negligence by the user. We assess your case and pursue the refund.",
      },
      {
        q: "Can I stop an auction?",
        a: "Depending on the case, there are remedies and restructuring procedures that can protect your property. Time is critical, so seek advice early.",
      },
    ],
  },
  "oikogeneiako-dikaio": {
    title: "Family Law",
    category: "Family Law",
    short:
      "Divorce, custody and contact with children, maintenance, and protection from domestic violence — with discretion and care.",
    intro: [
      "Family disputes are among the most charged matters anyone can face. They need legal precision and a human approach, especially when children are involved.",
      "Where possible we seek consensual solutions that protect relationships and the children’s best interests. When litigation is unavoidable, we pursue your rights with determination.",
    ],
    services: [
      "Consensual and contested divorce",
      "Custody, joint custody and contact with children",
      "Spousal and child maintenance",
      "Property disputes between spouses",
      "Domestic violence and protective measures",
      "Cohabitation agreements",
    ],
    approach:
      "Discretion, calm and a clear strategy — with your family’s safety and peace of mind as the priority.",
    faqs: [
      {
        q: "How long does a consensual divorce take?",
        a: "When the spouses fully agree, the process is completed relatively quickly. The exact time depends on document preparation and any agreements concerning children.",
      },
      {
        q: "What can I do if I am experiencing violence in the family?",
        a: "Your safety comes first: in immediate danger call 100 or 112. We then help with the complaint, protective measures and the necessary arrangements for the children.",
      },
    ],
  },
  "akiniti-periousia": {
    title: "Real Estate Law",
    category: "Real Estate",
    short: "Secure sales, title checks, leases, the cadastre, and property disputes.",
    intro: [
      "Real estate is often a lifetime’s most important investment. An error in the titles or the cadastre can be costly — prevention is the best protection.",
      "We thoroughly check the history of each property, draft and negotiate contracts, and represent you in every dispute concerning your assets.",
    ],
    services: [
      "Title checks at land registries and the cadastre",
      "Sales and parental gifts",
      "Residential and commercial leases",
      "Correction of inaccurate cadastral entries",
      "Co-ownership and horizontal property disputes",
      "Inheritance issues involving property",
    ],
    approach: "A full check before every signature, so that your transaction is safe today and tomorrow.",
    faqs: [
      {
        q: "Why do I need a lawyer for a sale?",
        a: "The lawyer checks ownership titles, encumbrances and registrations, so you do not acquire a property with legal problems that surface later.",
      },
      {
        q: "I found an error in the cadastre. What now?",
        a: "There are procedures to correct inaccurate entries, some with deadlines. Seek advice early so the right path is chosen.",
      },
    ],
  },
  "ilektroniko-egklima": {
    title: "Cybercrime",
    category: "Cybercrime",
    short: "Online fraud, account breaches, cyber-harassment, blackmail and digital defamation.",
    intro: [
      "Crime is moving ever more into the digital space: phishing, platform scams, account takeovers, leaks of private material. Victims often do not know where to start.",
      "We work with specialist technical experts to collect and preserve digital evidence, and we move quickly — because in cybercrime, time is decisive.",
    ],
    services: [
      "Computer fraud and phishing",
      "Account and personal-data breaches",
      "Online defamation",
      "Cyber-harassment and leaks of private material",
      "Online blackmail (sextortion)",
      "Digital evidence and technical expert reports",
    ],
    approach:
      "Immediate action, preservation of evidence and coordinated steps with banks, platforms and law-enforcement.",
    faqs: [
      {
        q: "What should I do the moment I realise I am a victim?",
        a: "Tell your bank to block cards and e-banking, keep screenshots and messages, and do not delete anything. We then take over the complaint and legal action.",
      },
      {
        q: "Can defamatory content be taken down?",
        a: "In many cases yes, through requests to platforms and, where needed, court measures. Criminal and civil claims can be brought in parallel.",
      },
    ],
  },
  "dioikitiko-dikaio": {
    title: "Administrative Law",
    category: "Administrative Law",
    short:
      "Damages claims against the State, public contracts, challenges to administrative acts, and immigration law.",
    intro: [
      "When the State is at fault, the citizen has the right to demand an account and redress. We represent individuals and businesses against the Administration in every administrative court.",
      "Our firm obtained the first judgment recognising the State’s liability for serious injury after vaccination — proof that persistence and documentation can open new paths.",
    ],
    services: [
      "Damages claims against the State (Arts. 105–106)",
      "Public-contract disputes",
      "Annulment applications and appeals against administrative acts",
      "Appeals against fines and administrative sanctions",
      "Immigration law and residence permits",
      "State liability in health matters",
    ],
    approach:
      "Methodical documentation and strict observance of deadlines — because in administrative law, procedure often decides the outcome.",
    faqs: [
      {
        q: "Can I claim damages from the State?",
        a: "Yes, when the harm is due to an unlawful act or omission of State organs. The claim is subject to limitation, so early assessment is critical.",
      },
      {
        q: "Do you handle residence-permit cases?",
        a: "Yes. We support third-country nationals with applications, renewals and appeals concerning their residence permit.",
      },
    ],
  },
  diamesolavisi: {
    title: "Mediation",
    category: "Mediation",
    short:
      "Faster, more economical and confidential dispute resolution, with legal support at every stage of mediation.",
    intro: [
      "Not every dispute needs to end in court. Mediation offers a structured, confidential way to find a solution with controlled time and cost.",
      "We represent you at the mandatory first session and throughout, so that any agreement truly protects your interests and is legally enforceable.",
    ],
    services: [
      "Mandatory initial mediation session",
      "Representation in family disputes",
      "Commercial and civil disputes",
      "Disputes between co-owners and heirs",
      "Drafting of the settlement record and enforceability",
    ],
    approach:
      "Solutions that come from dialogue, with legal security for the result and respect for the parties’ relationship.",
    faqs: [
      {
        q: "Is mediation mandatory?",
        a: "For certain categories of dispute the law requires a first session before going to court. Continuing the process is optional.",
      },
      {
        q: "Does the agreement we sign have legal force?",
        a: "Yes. The settlement record, if the legal requirements are met, can become as enforceable as a court judgment.",
      },
    ],
  },
};
