# Landing Page: Promoted Events Display Strategy

## Overview

Promoted events are featured prominently across the platform to drive visibility and conversions. This document shows where and how they appear.

---

## 1. LANDING PAGE LAYOUT

### Current Section Flow (Public Page)

```
[Header]

[Hero Section - Large Banner]
  - Upcoming hot event
  - High-quality image
  - CTA: "Learn More" / "Get Tickets"

[Browse Events Section]
  ├── Search Bar
  └── Category Filter

[Featured/Promoted Section]           👈 NEW
  ├── Carousel of 5-6 promoted events
  ├── Auto-rotate every 5 seconds
  └── Click to event details

[Trending Events Section]
  └── Curated list based on popularity

[Event Categories Section]
  └── Browse by category

[Footer]
```

---

## 2. PROMOTED EVENTS SECTION DESIGN

### 2.1 Desktop Layout (Hero Carousel)

```
════════════════════════════════════════════════════════════════════════════════
 FEATURED EVENTS PROMOTED BY ORGANIZERS
════════════════════════════════════════════════════════════════════════════════

   [Image]                    Event Title
   [Promoted] 🔥              📅 March 25, 2026
                              📍 Manila, Philippines
                              ⭐ 4.8 (234 reviews)

                              [View Event] [Add to Cart]


   ◀ ─────────────────────────────────────────────────────── ▶
     ●  ○  ○  ○  ○
```

**Features:**

- Large image (1200x600px minimum)
- Event title, date, location prominently displayed
- Star rating visible
- "Promoted" badge with flame icon
- Navigation dots (pagination)
- Auto-rotate with pause on hover
- Right/Left arrow navigation

---

### 2.2 Mobile Layout (Stack View)

```
┌──────────────────────────┐
│    FEATURED EVENTS       │
├──────────────────────────┤
│ ┌────────────────────┐   │
│ │   [Image]          │   │
│ │   ────────────     │   │
│ │ 🔥 PROMOTED        │   │
│ │                    │   │
│ │ Tech Conference    │   │
│ │ Mar 25 • Manila    │   │
│ │ ⭐ 4.8 (234)      │   │
│ │                    │   │
│ │ [View Details]     │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │   [Image]          │   │
│ │ 🔥 PROMOTED        │   │
│ │ Art Summit 2026    │   │
│ └────────────────────┘   │
│  ◀  Swipe to see more ▶  │
└──────────────────────────┘
```

**Features:**

- Vertical card stack
- Swipeable for mobile
- Promoted badge overlay
- Compact but clear

---

## 3. PROMOTED EVENT CARD COMPONENTS

### 3.1 Card Structure (Reusable)

```
┌─────────────────────────────────────────────┐
│ [Featured Event Card]                       │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │         EVENT IMAGE                 │   │
│  │     (High quality, 16:9)           │   │
│  │         [Promoted Badge]            │   │
│  │    🔥 PROMOTED • Runs until Mar 31  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Tech Innovation Summit 2026                │
│  By: Innovate Labs Inc.                    │
│                                             │
│  📅 March 25, 2026  |  ⏰ 9:00 AM - 6 PM   │
│  📍 SMX Convention, Pasay City              │
│                                             │
│  ⭐⭐⭐⭐⭐ 4.8/5 (234 attendees reviewed)  │
│                                             │
│  💰 From PHP 1,500  |  🎫 350/400 sold    │
│                                             │
│  Quick Tags: #tech #startup #networking    │
│                                             │
│ [View Event Details]  [Add to Favorites]   │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 Promoted Badge Design

```
Option 1: Simple Flame Badge
┌─────────────────┐
│ 🔥 PROMOTED      │ ← Top-left corner
│ Runs until Mar31 │
└─────────────────┘
(Semi-transparent background, solid text)

Option 2: Trending Badge
┌──────────────────┐
│ 📈 TRENDING NOW  │ ← Blue/cyan color
│ 234 views today  │
└──────────────────┘

Option 3: Organizer Ad Label
┌──────────────────┐
│ 🎯 AD              │ ← Gray/subtle
│ Promoted by       │
│ Organizer Name    │
└──────────────────┘
```

---

## 4. WHERE PROMOTED EVENTS APPEAR

### 4.1 Landing Page (Public)

```
1. Hero/Featured Carousel Section
   - 5-6 promoted events rotating
   - Takes up 60% of viewport
   - High visibility

2. "Trending Now" Sub-Section
   - Organically mixed with trending
   - Marked with 🔥 badge
```

### 4.2 Category Pages

```
[Sports] [Music] [Tech] [Art] ...

────────────────────────────────────
🔥 PROMOTED IN THIS CATEGORY

[Card] [Card] [Card]  ← Top 3 promoted events

Regular events below...
```

### 4.3 Search Results

```
Search: "tech events"

Filters: Date, Location, Price, ...

[PROMOTED SECTION]
🔥 Featured Tech Events for You
└── [Card] [Card] [Card]

[REGULAR SECTION]
All Results (1,234)
└── [Card] [Card] [Card]
    [Card] [Card] [Card]
```

### 4.4 Event Recommendations (Sidebar)

```
Desktop Sidebar:
┌─────────────────────┐
│ FEATURED EVENTS     │
├─────────────────────┤
│ [Compact Card]      │
│ 🔥 Tech Summit      │
│ Mar 25 • 1,500php   │
│                     │
│ [Compact Card]      │
│ 🔥 Art Exhibition   │
│ Apr 5 • 500php      │
└─────────────────────┘
```

---

## 5. DATABASE QUERY: GET PROMOTED EVENTS

### 5.1 Backend Query Logic

```sql
-- Get active promoted events for landing page
SELECT
  e.eventId,
  e.name,
  e.description,
  e.startDate,
  e.location,
  e.image_url,
  e.price_min,
  e.total_tickets,
  e.tickets_sold,
  o.organizerId,
  o.organizerName,
  o.logo_url,

  -- Promotion campaign data
  pc.campaignId,
  pc.platform,
  pc.promotionStartDate,
  pc.promotionEndDate,
  pc.budget,

  -- Event metrics
  (SELECT COUNT(*) FROM event_likes WHERE eventId = e.eventId) as like_count,
  (SELECT AVG(rating) FROM reviews WHERE eventId = e.eventId) as avg_rating,
  (SELECT COUNT(*) FROM reviews WHERE eventId = e.eventId) as review_count

FROM events e
JOIN organizers o ON e.organizerId = o.organizerId
LEFT JOIN promotionCampaigns pc ON e.eventId = pc.eventId
  AND pc.status = 'active'
  AND pc.promotionStartDate <= NOW()
  AND pc.promotionEndDate >= NOW()

WHERE
  e.isActive = true
  AND e.startDate >= NOW()
  AND pc.campaignId IS NOT NULL  -- Only promoted events

ORDER BY
  pc.dailyBudget DESC,          -- Higher budget = higher priority
  e.startDate ASC,              -- Earlier events first
  like_count DESC               -- Most liked second

LIMIT 6;  -- Show 6 promoted events max
```

### 5.2 Organizer Subscription Check

```typescript
// Frontend: Show promotion campaign badge only if organizer has active plan

const canShowPromotion = (plan: AdminPlan): boolean => {
  return (
    plan.limits?.max_promoted_events > 0 && plan.limits.max_promoted_events > 0 // Has remaining promotions
  );
};

// Backend: Enforce in middleware

app.get("/api/events/promoted", (req, res) => {
  // Only return promoted events for organizations with active plans
  // Verify plan.max_promoted_events > activePromotions count
});
```

---

## 6. VISUAL EXAMPLES (Tailwind Code)

### 6.1 Promoted Events Carousel Component

```tsx
export const PromotedEventsCarousel: React.FC = () => {
  const [promotedEvents, setPromotedEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="bg-gradient-to-r from-[#38BDF2]/10 to-transparent py-12 mb-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔥</span>
            <h2 className="text-3xl font-black text-[#2E2E2F]">
              FEATURED EVENTS
            </h2>
          </div>
          <p className="text-[#2E2E2F]/60 font-bold">
            Promoted by organizers • Curated deals
          </p>
        </div>

        {/* Carousel */}
        <div className="relative bg-white rounded-[2rem] overflow-hidden border border-[#2E2E2F]/10 shadow-lg">
          {/* Image & Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left: Large Image */}
            <div className="relative rounded-2xl overflow-hidden h-96 md:h-auto">
              <img
                src={promotedEvents[currentIndex]?.image}
                alt={promotedEvents[currentIndex]?.name}
                className="w-full h-full object-cover"
              />
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-[#38BDF2] text-white px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-lg">
                <span className="text-lg">🔥</span>
                PROMOTED
              </div>
            </div>

            {/* Right: Event Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black text-[#2E2E2F] mb-2">
                  {promotedEvents[currentIndex]?.name}
                </h3>
                <p className="text-[#2E2E2F]/60 font-bold mb-6">
                  By {promotedEvents[currentIndex]?.organizerName}
                </p>

                {/* Date, Location, Rating */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <span className="font-bold text-[#2E2E2F]">
                      {new Date(
                        promotedEvents[currentIndex]?.startDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <span className="font-bold text-[#2E2E2F]">
                      {promotedEvents[currentIndex]?.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="font-bold text-[#2E2E2F]">4.8</span>
                    <span className="text-[#2E2E2F]/60 text-sm">
                      (234 reviews)
                    </span>
                  </div>
                </div>

                {/* Price & Tickets */}
                <div className="flex gap-6 mb-8 text-sm font-black">
                  <div>
                    <p className="text-[#2E2E2F]/60 text-xs uppercase tracking-widest mb-1">
                      From
                    </p>
                    <p className="text-2xl text-[#38BDF2]">PHP 1,500</p>
                  </div>
                  <div>
                    <p className="text-[#2E2E2F]/60 text-xs uppercase tracking-widest mb-1">
                      Tickets
                    </p>
                    <p className="text-xl">
                      {350}/{400} Sold
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-[#38BDF2] text-white font-black py-4 rounded-xl hover:bg-[#2E2E2F] transition">
                  View Event
                </button>
                <button className="flex-1 border-2 border-[#38BDF2] text-[#38BDF2] font-black py-4 rounded-xl hover:bg-[#38BDF2]/10 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center px-8 py-6 bg-[#F2F2F2] border-t border-[#2E2E2F]/10">
            <button
              onClick={() =>
                setCurrentIndex(
                  (idx) =>
                    (idx - 1 + promotedEvents.length) % promotedEvents.length,
                )
              }
              className="w-12 h-12 rounded-full bg-white border-2 border-[#38BDF2] text-[#38BDF2] flex items-center justify-center hover:bg-[#38BDF2] hover:text-white transition"
            >
              ◀
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {promotedEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${
                    idx === currentIndex ? "bg-[#38BDF2]" : "bg-[#2E2E2F]/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentIndex((idx) => (idx + 1) % promotedEvents.length)
              }
              className="w-12 h-12 rounded-full bg-white border-2 border-[#38BDF2] text-[#38BDF2] flex items-center justify-center hover:bg-[#38BDF2] hover:text-white transition"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
```

---

## 7. IMPLEMENTATION CHECKLIST

### Backend

- [ ] Create `PromotedEventsController` for endpoint
- [ ] Update `events` table with `is_promoted` flag
- [ ] Create `promotionCampaigns` table
- [ ] Add query optimization (caching promoted events)
- [ ] Middleware: Check organizer plan for promotion eligibility
- [ ] Endpoint: `GET /api/events/promoted` (public)

### Frontend

- [ ] Create `PromotedEventsCarousel` component
- [ ] Add to landing page layout
- [ ] Mobile swipe navigation
- [ ] Auto-rotate functionality
- [ ] Analytics tracking (clicks, impressions)

### Analytics

- [ ] Track carousel views
- [ ] Track card clicks
- [ ] Track "View Event" conversions
- [ ] Log per-organizer promotion performance

---

## 8. PROMOTED EVENTS LIFECYCLE

```
┌─────────────────────────────────────────────────────────┐
│ 1. Organizer Chooses Event to Promote                  │
│    (In: My Events → Select Event → "Promote Event")    │
└────────────┬──────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Set Promotion Details                                │
│    - Duration: Start date → End date                   │
│    - Budget: Daily budget                              │
│    - Platforms: Facebook, Google, In-app               │
└────────────┬──────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. System Adds to Promoted Queue                        │
│    - Sets is_promoted = true                           │
│    - Creates promotionCampaign record                  │
│    - Pushes external ads to platforms                  │
└────────────┬──────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Event Appears in:                                    │
│    ✅ Landing page carousel                            │
│    ✅ Category pages                                   │
│    ✅ Search results (top)                             │
│    ✅ External platforms (Facebook, Google)            │
│    ✅ User recommendations                             │
└────────────┬──────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Promotion Ends                                       │
│    - Removes from carousel                             │
│    - Sets is_promoted = false                          │
│    - Pauses external campaigns                         │
│    - Generates performance report                      │
└─────────────────────────────────────────────────────────┘
```

---

## 9. MONETIZATION DISPLAY

Show organizers the ROI of their promotion investment:

```tsx
<PromotionPerformanceCard>
  💰 Your Promotion Performance Budget Spent: PHP 5,000 Clicks Generated: 1,234
  Conversions: 45 tickets Revenue: PHP 67,500 ROI: 1,350% 🚀 [View Detailed
  Report] [Extend Promotion]
</PromotionPerformanceCard>
```

---

Generated: March 12, 2026
For: StartupLab Business Ticketing System
