# Promoted Events: Eventbrite-Style Implementation

## Key Findings from Eventbrite

**How Eventbrite displays promoted events:**

1. ✅ Simple "Promoted" badge/label on event cards
2. ✅ Entire card is clickable (leads to event details page)
3. ✅ NO separate action buttons
4. ✅ Organic mix in event listings/grids
5. ✅ Minimal visual change - just a small badge

---

## 1. UPDATED PROMOTED EVENT CARD DESIGN

### Desktop Event Card (Grid View)

```
┌────────────────────────────────────────────┐
│                                            │
│         [Event Image - High Quality]       │
│              16:9 Aspect Ratio             │
│                                            │
│  [Promoted Badge - Top Right]              │
│                                            │
├────────────────────────────────────────────┤  ← Entire card is clickable
│                                            │
│ Event Title (Bold, Large Text)             │
│                                            │
│ Organization Name (Gray, smaller)          │
│                                            │
│ 📅 Date & Time  |  📍 Location            │
│                                            │
│ ⭐ 4.8/5 (234)  |  💰 From PHP 1,500      │
│                                            │
│ [PROMOTED] tag indicator                   │
│ Running until: Mar 31, 2026                │
│                                            │
└────────────────────────────────────────────┘
```

**CSS: Make entire card clickable**

```css
.promoted-event-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.promoted-event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(56, 189, 242, 0.15);
  border-color: #38bdf2;
}
```

### Promoted Badge Design

```
Option A (Minimal - Like Eventbrite):
┌─────────────────┐
│ Promoted        │  ← Gray text, small
└─────────────────┘

Option B (Branded - With Icon):
┌─────────────────┐
│ 🔥 Promoted     │  ← Orange/flame color
└─────────────────┘

Option C (With Timeline):
┌──────────────────────┐
│ 🔥 Promoted          │
│ Until Mar 31, 2026   │  ← Smaller text
└──────────────────────┘

RECOMMENDATION: Use Option B or C
- More visual appeal than plain text
- Clear distinguishment from regular events
```

---

## 2. LANDING PAGE LAYOUT (EVENTBRITE STYLE)

### Full Landing Page Flow

```
┌─────────────────────────────────────────────────────┐
│ [Search Bar - Find Events]                          │
│                                                      │
│ [For You] [Today] [This Weekend] [All Events]       │
└─────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════
   FEATURED EVENTS (Hero Showcase - Optional)
═══════════════════════════════════════════════════════


═══════════════════════════════════════════════════════
   PROMOTED SECTION (Organic Grid Mix)
═══════════════════════════════════════════════════════

[Event Card]     [Event Card]     [Event Card]
🔥 PROMOTED      Regular Event    🔥 PROMOTED
Concert NYC      Tech Workshop    Art Exhibition

[Event Card]     [Event Card]     [Event Card]
Regular Event    🔥 PROMOTED      Regular Event
Sports Game      Workshop         Music Fest


═══════════════════════════════════════════════════════
   MORE EVENTS
═══════════════════════════════════════════════════════

[Event Card]     [Event Card]     [Event Card]
Regular Event    Regular Event    Regular Event

[See More Events →]
```

**Key Points:**

- Promoted events are **mixed naturally** in the grid
- NOT separated into a dedicated section
- Just a badge distinguishing them
- Same card size, layout, styling
- Entire card is clickable anywhere

---

## 3. HOW PROMOTED EVENT DETAILS PAGE DIFFERS

When attendee clicks on a promoted event:

### Event Details Page (Enhanced Layout)

```
[Hero Section - Large Image]
  - Larger, higher quality image
  - [Promoted] badge visible
  - "Promoted by Organizer" subtitle

[Event Information]
  ├─ Rating & Reviews (Prominent)
  ├─ Organizer Profile (Featured)
  ├─ Event Highlights (Icons)
  │   ✅ Fully Booked Status
  │   ✅ High Demand (234 views this week)
  │   ✅ 4.8/5 Rating
  │   ✅ Limited Tickets Remaining
  ├─ Detailed Description
  ├─ Attendee List (Sample)
  ├─ Similar Events (Recommendations)
  └─ Customer Reviews & Photos
```

### Extra Details on Promoted Event Pages

```
[Social Proof Section]
└─ "234 people viewed this event this week"
└─ "45 people bought tickets today"
└─ "Trending in Your Area"

[Organizer Spotlight]
├─ Organizer name + logo
├─ "This organizer has held 23 successful events"
├─ Recent attendee reviews
└─ [Follow Organizer Button]

[Media Gallery]
├─ Event photos from past attendees
├─ Organizer samples
└─ "See 50+ photos from attendees"

[Attendee Reviews Section]
├─ "Amazing experience!" ⭐⭐⭐⭐⭐
├─ "Best event of the year" ⭐⭐⭐⭐⭐
├─ "Highly recommend" ⭐⭐⭐⭐
└─ [View all 234 reviews]

[Frequently Asked Questions]
├─ "What time should I arrive?"
├─ "What's included?"
├─ "Can I bring guests?"
└─ [More FAQs]
```

**This builds trust and encourages purchase!**

---

## 4. DATABASE QUERIES

### 4.1 Get Mixed Events Feed (Promoted Mixed In)

```sql
-- Get events for landing page feed (promoted mixed naturally)
SELECT
  e.eventId,
  e.name,
  e.description,
  e.startDate,
  e.endDate,
  e.location,
  e.image_url,
  e.price_min,
  e.total_tickets,
  e.tickets_sold,
  o.organizerId,
  o.organizerName,

  -- Promotion data
  CASE
    WHEN pc.campaignId IS NOT NULL THEN true
    ELSE false
  END as is_promoted,
  pc.campaignId,
  pc.promotionEndDate,

  -- Metrics
  COALESCE(el.like_count, 0) as like_count,
  COALESCE(r.avg_rating, 0) as avg_rating,
  COALESCE(r.review_count, 0) as review_count,

FROM events e
JOIN organizers o ON e.organizerId = o.organizerId
LEFT JOIN promotionCampaigns pc ON e.eventId = pc.eventId
  AND pc.status = 'active'
  AND NOW() BETWEEN pc.promotionStartDate AND pc.promotionEndDate
LEFT JOIN event_likes el ON e.eventId = el.eventId
LEFT JOIN (
  SELECT eventId, AVG(rating) as avg_rating, COUNT(*) as review_count
  FROM reviews
  GROUP BY eventId
) r ON e.eventId = r.eventId

WHERE
  e.isActive = true
  AND e.startDate >= NOW()
  AND e.location LIKE '%{userCity}%'  -- User's location

ORDER BY
  is_promoted DESC,                    -- Promoted first
  e.startDate ASC,                      -- Earlier dates
  COALESCE(r.review_count, 0) DESC    -- Highly reviewed

LIMIT 30;  -- Paginate in 30s
```

### 4.2 Get Event Details (With Promoted Enhancements)

```sql
SELECT
  e.*,
  o.*,

  -- Promotion stats
  pc.campaignId,
  pc.platform,
  pc.promotionEndDate,

  -- Engagement stats
  COUNT(DISTINCT el.userId) as total_likes,
  COUNT(DISTINCT ord.orderId) as total_orders,
  COUNT(DISTINCT rev.reviewId) as total_reviews,
  AVG(rev.rating) as avg_rating,

  -- View stats (from analytics)
  (SELECT COUNT(*) FROM event_analytics
   WHERE eventId = e.eventId
   AND DATE = CURRENT_DATE) as views_today,

  (SELECT COUNT(*) FROM event_analytics
   WHERE eventId = e.eventId
   AND DATE >= CURRENT_DATE - INTERVAL 7 DAY) as views_week

FROM events e
JOIN organizers o ON e.organizerId = o.organizerId
LEFT JOIN promotionCampaigns pc ON e.eventId = pc.eventId AND pc.status = 'active'
LEFT JOIN event_likes el ON e.eventId = el.eventId
LEFT JOIN orders ord ON e.eventId = ord.eventId AND ord.status = 'completed'
LEFT JOIN reviews rev ON e.eventId = rev.eventId

WHERE e.eventId = '{eventId}'

GROUP BY e.eventId, o.organizerId;
```

---

## 5. REACT COMPONENTS

### 5.1 Event Card Component (Clickable)

```tsx
import { useNavigate } from "react-router-dom";

type EventCardProps = {
  event: Event;
  isPromoted: boolean;
  promotionEndDate?: string;
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isPromoted,
  promotionEndDate,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event.eventId}`)}
      className="cursor-pointer group rounded-2xl overflow-hidden border border-[#2E2E2F]/10 bg-white transition-all duration-300 hover:shadow-lg hover:border-[#38BDF2]/30"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 md:h-56 bg-[#F2F2F2]">
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Promoted Badge - Top Right */}
        {isPromoted && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-black text-[#2E2E2F] flex items-center gap-1.5 shadow-md">
            <span className="text-base">🔥</span>
            <span>PROMOTED</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-black text-[#2E2E2F] text-lg line-clamp-2 group-hover:text-[#38BDF2] transition-colors">
          {event.name}
        </h3>

        {/* Organizer */}
        <p className="text-xs text-[#2E2E2F]/60 font-bold">
          {event.organizerName}
        </p>

        {/* Date & Location */}
        <div className="space-y-1 text-sm text-[#2E2E2F]/70 font-bold">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
            <span>
              {new Date(event.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between text-sm font-bold pt-3 border-t border-[#2E2E2F]/10">
          <div className="flex items-center gap-1">
            <span className="text-warn">⭐</span>
            <span className="text-[#2E2E2F]">
              {event.avg_rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-[#2E2E2F]/60 text-xs">
              ({event.review_count})
            </span>
          </div>
          <div className="text-[#38BDF2]">
            {event.price_min === 0 ? (
              <span>FREE</span>
            ) : (
              <span>From ₱{event.price_min?.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Promoted Duration (if promoted) */}
        {isPromoted && promotionEndDate && (
          <p className="text-[9px] text-[#38BDF2] font-black uppercase tracking-widest">
            🔥 Promoted until {new Date(promotionEndDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
```

### 5.2 Landing Page Feed Component

```tsx
export const EventsFeed: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [page]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEventsFeed({ page, limit: 30 });
      if (page === 1) {
        setEvents(data.events);
      } else {
        setEvents([...events, ...data.events]);
      }
    } catch (error: any) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      {/* Search & Filter */}
      <div className="mb-12">
        <SearchBar />
        <FilterTabs />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            isPromoted={event.is_promoted}
            promotionEndDate={event.promotionEndDate}
          />
        ))}
      </div>

      {/* Load More */}
      {!loading && (
        <button
          onClick={() => setPage(page + 1)}
          className="mt-12 mx-auto block px-8 py-3 bg-[#38BDF2] text-white font-black rounded-xl hover:bg-[#2E2E2F] transition"
        >
          Load More Events
        </button>
      )}
    </div>
  );
};
```

### 5.3 Event Details Page (Enhanced for Promoted)

```tsx
export const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    const data = await apiService.getEventDetails(eventId);
    setEvent(data.event);
    setOrganizer(data.organizer);
    setReviews(data.reviews);
  };

  if (!event) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Hero Section - Large Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden bg-black">
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-full object-cover"
        />

        {/* Promoted Badge on Hero */}
        {event.is_promoted && (
          <div className="absolute top-8 left-8 bg-[#38BDF2] text-white px-5 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-lg">
            <span className="text-xl">🔥</span>
            <span>PROMOTED</span>
          </div>
        )}

        {/* Promoted Until Badge */}
        {event.is_promoted && event.promotionEndDate && (
          <div className="absolute top-8 right-8 bg-white/95 px-4 py-2 rounded-full text-xs font-black text-[#2E2E2F] shadow-lg">
            Running until{" "}
            {new Date(event.promotionEndDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Event Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Title & Key Info */}
            <div>
              <h1 className="text-4xl font-black text-[#2E2E2F] mb-4">
                {event.name}
              </h1>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-black text-lg text-[#2E2E2F]">
                    {event.avg_rating}
                  </span>
                  <span className="text-[#2E2E2F]/60 font-bold">
                    ({event.review_count} reviews)
                  </span>
                </div>

                {event.is_promoted && (
                  <div className="flex items-center gap-2 text-[#38BDF2] font-black">
                    <span className="text-lg">🔥</span>
                    <span>PROMOTED EVENT</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-lg font-bold text-[#2E2E2F]/70">
                <p>
                  📅 {new Date(event.startDate).toLocaleDateString()} at{" "}
                  {new Date(event.startDate).toLocaleTimeString()}
                </p>
                <p>📍 {event.location}</p>
              </div>
            </div>

            {/* Social Proof Section (Enhanced for Promoted) */}
            {event.is_promoted && (
              <div className="bg-gradient-to-r from-[#38BDF2]/10 to-transparent p-6 rounded-2xl border border-[#38BDF2]/20">
                <p className="font-black text-[#2E2E2F] text-sm uppercase tracking-widest mb-4">
                  📈 This Event is Popular
                </p>
                <div className="space-y-2 text-sm font-bold text-[#2E2E2F]/70">
                  <p>
                    ✅ {event.views_week} people viewed this event this week
                  </p>
                  <p>✅ {event.total_orders} people bought tickets</p>
                  <p>✅ Trending in {event.location}</p>
                </div>
              </div>
            )}

            {/* Organizer Spotlight */}
            <div className="bg-white p-8 rounded-2xl border border-[#2E2E2F]/10">
              <p className="text-xs font-black text-[#2E2E2F]/60 uppercase tracking-widest mb-4">
                About Organizer
              </p>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={organizer?.logo_url}
                  alt={organizer?.organizerName}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-black text-lg text-[#2E2E2F]">
                    {organizer?.organizerName}
                  </h3>
                  <p className="text-sm text-[#2E2E2F]/60">
                    Has hosted {organizer?.total_events} successful events
                  </p>
                </div>
              </div>
              <button className="w-full py-3 border-2 border-[#38BDF2] text-[#38BDF2] font-black rounded-xl hover:bg-[#38BDF2] hover:text-white transition">
                Follow {organizer?.organizerName}
              </button>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-black text-[#2E2E2F] mb-4">
                About This Event
              </h2>
              <p className="text-[#2E2E2F]/70 leading-relaxed font-bold">
                {event.description}
              </p>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-black text-[#2E2E2F] mb-6">
                Attendee Reviews
              </h2>
              <div className="space-y-6">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.reviewId}
                    className="border-b border-[#2E2E2F]/10 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={review.userImage}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-black text-[#2E2E2F]">
                          {review.userName}
                        </p>
                        <p className="text-sm text-[#2E2E2F]/60">
                          ⭐ {review.rating}/5
                        </p>
                      </div>
                    </div>
                    <p className="text-[#2E2E2F]/70 font-bold">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-8 text-[#38BDF2] font-black hover:underline">
                View all {event.review_count} reviews →
              </button>
            </div>
          </div>

          {/* Right: Sidebar - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white p-8 rounded-2xl border border-[#2E2E2F]/10 space-y-6">
              <div>
                <p className="text-xs font-black text-[#2E2E2F]/60 uppercase tracking-widest mb-2">
                  Price from
                </p>
                <p className="text-4xl font-black text-[#2E2E2F]">
                  {event.price_min === 0
                    ? "FREE"
                    : `₱${event.price_min?.toLocaleString()}`}
                </p>
              </div>

              <div className="space-y-2 text-sm font-bold text-[#2E2E2F]/70">
                <p>
                  🎫 {event.total_tickets - event.tickets_sold} of{" "}
                  {event.total_tickets} tickets available
                </p>
                <div className="w-full bg-[#F2F2F2] rounded-full h-2">
                  <div
                    className="bg-[#38BDF2] h-full rounded-full"
                    style={{
                      width: `${(event.tickets_sold / event.total_tickets) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <button className="w-full bg-[#38BDF2] text-white font-black py-4 rounded-xl hover:bg-[#2E2E2F] transition">
                Get Tickets
              </button>

              <button className="w-full border-2 border-[#38BDF2] text-[#38BDF2] font-black py-4 rounded-xl hover:bg-[#38BDF2]/10 transition">
                ❤️ Save for Later
              </button>

              {/* Promoted Badge in Sidebar */}
              {event.is_promoted && (
                <div className="bg-gradient-to-r from-[#38BDF2]/10 to-transparent p-4 rounded-xl border border-[#38BDF2]/20">
                  <p className="text-xs font-black text-[#38BDF2] uppercase tracking-widest mb-2">
                    🔥 Promoted
                  </p>
                  <p className="text-xs text-[#2E2E2F]/60 font-bold">
                    This event is being promoted by the organizer. High-demand
                    tickets!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 6. IMPLEMENTATION CHECKLIST

### Database Migrations

- [ ] Add `is_promoted` boolean to `events` table
- [ ] Add `promotion_start_date`, `promotion_end_date` to events
- [ ] Verify `promotionCampaigns` table exists
- [ ] Add index: `KEY (is_promoted, startDate)` for fast queries

### Backend API

- [ ] Create `/api/events/feed` endpoint (mixed promoted/regular)
- [ ] Create `/api/events/{id}/details` (enhanced with promotion data)
- [ ] Create `/api/promotions/{id}` (get promotion campaign details)
- [ ] Add middleware: Check promotion campaign status
- [ ] Add query optimization: Cache promoted events (5 min TTL)

### Frontend Components

- [ ] Create `EventCard` component (clickable entire card)
- [ ] Create `EventsFeed` component (paginated grid)
- [ ] Create `EventDetailsPage` (enhanced view)
- [ ] Add promoted badge UI
- [ ] Test hover/click interactions

### Analytics

- [ ] Track event card views
- [ ] Track "Get Tickets" clicks
- [ ] Track promoted event vs regular event conversion rates
- [ ] Dashboard: Compare promoted vs non-promoted ROI

---

## 7. KEY DIFFERENCES FROM PREVIOUS DESIGN

| Aspect               | Previous                     | New (Eventbrite-Style)  |
| -------------------- | ---------------------------- | ----------------------- |
| **Card buttons**     | "View Event" + "Add to Cart" | Entire card clickable   |
| **Promoted section** | Separate carousel            | Mixed naturally in feed |
| **Badge style**      | Large flame badge            | Simple corner badge     |
| **Details page**     | Same for all events          | Enhanced for promoted   |
| **Trust signals**    | Minimal                      | Social proof section    |
| **Complexity**       | Higher                       | Simpler, cleaner        |

---

## 8. NEXT STEPS

1. ✅ Update database schema (add `is_promoted` flag)
2. ✅ Create backend endpoints (`/feed`, `/details`)
3. ✅ Build `EventCard` component (clickable)
4. ✅ Build `EventsFeed` component (grid + pagination)
5. ✅ Enhance `EventDetailsPage` with promoted features
6. ✅ Add analytics tracking
7. ✅ Test on all device sizes
8. ✅ Deploy and monitor

---

Generated: March 12, 2026
Updated: Eventbrite-style approach (simpler, cleaner)
