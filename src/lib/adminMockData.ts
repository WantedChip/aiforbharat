export const ADMIN_OVERVIEW_STATS = {
    totalGrievances: 1234,
    pending: 456,
    inProgress: 312,
    resolved: 778,
    todayNew: 23,
    avgResolutionDays: 4.2,
    totalSubscribers: 184392,
    subscribersThisWeek: 2147,
    activeBroadcasts: 23,
    scheduledBroadcasts: 8,
    upcomingEvents: 7,
    pendingApprovals: 5,
    deliveryRate: 96.4,
    readRate: 73.2,
    totalReplies: 1847,
    schemesPublished: 142,
    schemesThisMonth: 12,
};

export const RECENT_ACTIVITY = [
    {
        id: 1,
        type: "scheme_published",
        title: "Scheme Published",
        subtitle: "PM Kisan Yojana — Phase III",
        time: "12 min ago",
        status: "Published",
        statusColor: "green",
        dot: "green",
    },
    {
        id: 2,
        type: "broadcast_sent",
        title: "Broadcast Sent",
        subtitle: "Water Supply Advisory → 14,200 subscribers",
        time: "1 hr ago",
        status: "Sent",
        statusColor: "blue",
        dot: "blue",
    },
    {
        id: 3,
        type: "event_created",
        title: "Event Created",
        subtitle: "District Health Camp — Pune",
        time: "3 hrs ago",
        status: "Scheduled",
        statusColor: "amber",
        dot: "amber",
    },
    {
        id: 4,
        type: "scheme_updated",
        title: "Scheme Updated",
        subtitle: "Rural Housing Scheme — Status changed to Published",
        time: "5 hrs ago",
        status: "Published",
        statusColor: "green",
        dot: "green",
    },
    {
        id: 5,
        type: "notice_issued",
        title: "Notice Issued",
        subtitle: "Road Closure Notification — NH48",
        time: "Yesterday",
        status: "Urgent",
        statusColor: "red",
        dot: "red",
    },
    {
        id: 6,
        type: "grievance_resolved",
        title: "Grievance Resolved",
        subtitle: "GRV-2024-1234 — Water supply disruption, Lucknow",
        time: "Yesterday",
        status: "Resolved",
        statusColor: "green",
        dot: "green",
    },
];

export const PENDING_APPROVALS = [
    { type: "scheme", label: "3 Schemes", link: "/admin/schemes" },
    { type: "notice", label: "2 Notices", link: "/admin/events" },
];

export const BROADCAST_REACH_CHART = [
    { day: "Mon", messages: 18000 },
    { day: "Tue", messages: 22000 },
    { day: "Wed", messages: 19500 },
    { day: "Thu", messages: 31000 },
    { day: "Fri", messages: 28000 },
    { day: "Sat", messages: 14000 },
    { day: "Sun", messages: 48291 },
];

export const MONTHLY_TREND = [
    { month: "Aug", submitted: 89, resolved: 72 },
    { month: "Sep", submitted: 102, resolved: 88 },
    { month: "Oct", submitted: 134, resolved: 98 },
    { month: "Nov", submitted: 118, resolved: 112 },
    { month: "Dec", submitted: 156, resolved: 134 },
    { month: "Jan", submitted: 189, resolved: 145 },
];

export const CATEGORY_DISTRIBUTION = [
    { name: "Roads", value: 312, percentage: 25, fill: "#22c55e" },
    { name: "Water", value: 284, percentage: 23, fill: "#10b981" },
    { name: "Electricity", value: 197, percentage: 16, fill: "#059669" },
    { name: "Sanitation", value: 160, percentage: 13, fill: "#047857" },
    { name: "Others", value: 281, percentage: 24, fill: "#065f46" },
];

export const TOP_SCHEMES_BY_ENGAGEMENT = [
    { rank: 1, name: "PM Kisan Samman Nidhi", views: 34200, engagement: 78, state: "National" },
    { rank: 2, name: "Rural Housing Assistance", views: 28100, engagement: 72, state: "National" },
    { rank: 3, name: "Youth Skill Development", views: 22400, engagement: 65, state: "National" },
    { rank: 4, name: "Women Entrepreneurship Fund", views: 18900, engagement: 71, state: "National" },
    { rank: 5, name: "Clean Water Initiative", views: 15300, engagement: 58, state: "National" },
];

export const STATE_BREAKDOWN = [
    { state: "Uttar Pradesh", subscribers: 42800, active: 91, grievances: 312 },
    { state: "Maharashtra", subscribers: 38100, active: 89, grievances: 278 },
    { state: "Bihar", subscribers: 29400, active: 84, grievances: 198 },
    { state: "West Bengal", subscribers: 24600, active: 87, grievances: 167 },
    { state: "Rajasthan", subscribers: 19200, active: 81, grievances: 143 },
    { state: "Tamil Nadu", subscribers: 16700, active: 77, grievances: 136 },
];

export const BROADCASTS = [
    {
        id: "BC-001",
        title: "Water Supply Advisory — Nagpur East",
        subscribers: 14200,
        date: "Feb 26, 2026 · 10:42 AM",
        status: "Delivered",
        deliveryRate: 97.1,
        readRate: 68.4,
        category: "Infrastructure",
    },
    {
        id: "BC-002",
        title: "PM Kisan Phase III Enrollment Open",
        subscribers: 42800,
        date: "Feb 25, 2026 · 9:00 AM",
        status: "Delivered",
        deliveryRate: 96.8,
        readRate: 72.1,
        category: "Agriculture",
    },
    {
        id: "BC-003",
        title: "Road Closure Notification — NH48",
        subscribers: 8900,
        date: "Feb 28, 2026 · 8:00 AM",
        status: "Scheduled",
        deliveryRate: null,
        readRate: null,
        category: "Infrastructure",
    },
    {
        id: "BC-004",
        title: "Health Camp Reminder — Pune District",
        subscribers: 21500,
        date: "Mar 3, 2026 · 9:00 AM",
        status: "Draft",
        deliveryRate: null,
        readRate: null,
        category: "Health",
    },
    {
        id: "BC-005",
        title: "Solar Subsidy Program Launch",
        subscribers: 35100,
        date: "Feb 22, 2026 · 11:15 AM",
        status: "Delivered",
        deliveryRate: 95.3,
        readRate: 61.7,
        category: "Energy",
    },
    {
        id: "BC-006",
        title: "Aadhaar Seeding Drive — Rural Areas",
        subscribers: 18700,
        date: "Feb 20, 2026 · 10:00 AM",
        status: "Delivered",
        deliveryRate: 94.2,
        readRate: 59.8,
        category: "Identity",
    },
];

export const EVENTS_AND_NOTICES = [
    {
        id: "EV-001",
        type: "Event" as const,
        priority: null,
        title: "District Health Camp — Pune",
        description:
            "Free health checkup camp for rural residents of Pune district. Expected footfall: 2,000+",
        date: "Mar 3, 2026",
        location: "Pune Municipal Corporation Hall",
        status: "Upcoming",
    },
    {
        id: "NT-001",
        type: "Notice" as const,
        priority: "URGENT",
        title: "Road Closure Notice — NH48",
        description:
            "Temporary closure for maintenance work. Alternative routes available via SH166.",
        date: "Feb 28, 2026",
        location: "NH48, Km 120-145",
        status: "Active",
    },
    {
        id: "NT-002",
        type: "Notice" as const,
        priority: "HIGH",
        title: "Water Supply Interruption Advisory",
        description:
            "Pipeline repair work — water supply interruption expected for 8 hours.",
        date: "Mar 1, 2026",
        location: "Nagpur East Division",
        status: "Scheduled",
    },
    {
        id: "EV-002",
        type: "Event" as const,
        priority: null,
        title: "Farmer Training Workshop",
        description:
            "Workshop on modern irrigation and crop rotation techniques.",
        date: "Mar 8, 2026",
        location: "Agricultural Training Center, Nashik",
        status: "Upcoming",
    },
    {
        id: "NT-003",
        type: "Notice" as const,
        priority: "HIGH",
        title: "Property Tax Assessment Deadline",
        description:
            "Last date for property tax assessment filing for FY 2025-26.",
        date: "Mar 31, 2026",
        location: "All Municipal Corporations",
        status: "Active",
    },
    {
        id: "EV-003",
        type: "Event" as const,
        priority: null,
        title: "Digital Literacy Drive — Rural Phase",
        description:
            "Digital skills training for rural youth and senior citizens.",
        date: "Mar 15, 2026",
        location: "Gram Panchayat Centers, Kolhapur",
        status: "Upcoming",
    },
    {
        id: "NT-004",
        type: "Notice" as const,
        priority: "MEDIUM",
        title: "Voter ID Correction Camp",
        description:
            "Correction and update camp for voter ID cards at district offices.",
        date: "Mar 10, 2026",
        location: "All District Collector Offices",
        status: "Upcoming",
    },
];

export const ADMIN_SCHEMES = [
    { name: "PM Kisan Samman Nidhi", category: "Agriculture", status: "Published", lastUpdated: "Feb 26, 2026", beneficiaries: 12400 },
    { name: "Rural Housing Assistance Scheme", category: "Housing", status: "Published", lastUpdated: "Feb 24, 2026", beneficiaries: 8910 },
    { name: "Digital Literacy Mission — Phase IV", category: "Education", status: "Scheduled", lastUpdated: "Feb 23, 2026", beneficiaries: null },
    { name: "Clean Water Initiative", category: "Infrastructure", status: "Draft", lastUpdated: "Feb 22, 2026", beneficiaries: null },
    { name: "Women Entrepreneurship Fund", category: "Finance", status: "Published", lastUpdated: "Feb 20, 2026", beneficiaries: 3200 },
    { name: "Solar Subsidy Program", category: "Energy", status: "Scheduled", lastUpdated: "Feb 18, 2026", beneficiaries: null },
    { name: "Tribal Welfare Healthcare Access", category: "Healthcare", status: "Draft", lastUpdated: "Feb 15, 2026", beneficiaries: null },
    { name: "Youth Skill Development Program", category: "Education", status: "Published", lastUpdated: "Feb 12, 2026", beneficiaries: 6750 },
];

export const ADMIN_USERS = [
    { name: "Ramesh Kumar", phone: "+91 98XXX XXXXX", state: "Uttar Pradesh", registered: "Jan 15", grievances: 3, status: "Active" },
    { name: "Priya Sharma", phone: "+91 87XXX XXXXX", state: "Maharashtra", registered: "Jan 18", grievances: 1, status: "Active" },
    { name: "Suresh Patel", phone: "+91 76XXX XXXXX", state: "Gujarat", registered: "Jan 20", grievances: 2, status: "Active" },
    { name: "Anita Devi", phone: "+91 99XXX XXXXX", state: "Bihar", registered: "Jan 22", grievances: 4, status: "Active" },
    { name: "Kavitha R", phone: "+91 94XXX XXXXX", state: "Tamil Nadu", registered: "Jan 24", grievances: 1, status: "Active" },
];
