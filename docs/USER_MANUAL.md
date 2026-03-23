# StartupLab Business Ticketing System - User Manual

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Getting Started](#getting-started)
4. [Attendee Guide](#attendee-guide)
5. [Organizer Guide](#organizer-guide)
6. [Admin Guide](#admin-guide)
7. [Troubleshooting](#troubleshooting)

---

## System Overview

The StartupLab Business Ticketing System is a comprehensive event management platform that enables:

- Event creation and management
- Ticket sales and registration
- Real-time analytics and reporting
- Multi-user team collaboration
- Payment processing via HitPay

---

## User Roles

| Role          | Description                                          | Access Level                         |
| ------------- | ---------------------------------------------------- | ------------------------------------ |
| **Attendee**  | Event participants who register and purchase tickets | Public pages + My Tickets            |
| **Organizer** | Event creators and managers                          | Attendee features + Event Management |
| **Admin**     | System administrators                                | Full system access                   |

---

## Getting Started

### Registration

1. Visit the platform homepage
2. Click **Sign Up**
3. Enter your email, password, and name
4. Verify your email address
5. Complete your profile

### Login

1. Click **Login**
2. Enter credentials
3. (Optional) Check "Remember me"
4. Access your dashboard

---

## Attendee Guide

### Home Page

- Browse featured and upcoming events
- Search events by name or category
- Filter by location (onsite, online, hybrid)
- View event categories

### Event Discovery

- **Event List**: Browse all public events
- **Category Events**: View events by category (Technology, Business, Music, etc.)
- **Search**: Find specific events using the search bar
- **Filters**: Filter by date, location type, and price

### Event Details

Click any event to view:

- Event name, description, and date/time
- Location (onsite address, online link, or both)
- Ticket types and pricing
- Organizer profile
- Capacity and availability

### Registering for Events

1. Select event → View Details
2. Choose ticket type and quantity
3. Fill registration form (name, email, phone)
4. Review order summary
5. Complete payment via HitPay
6. Receive confirmation email with ticket

### My Tickets

Access via **My Tickets** in navigation:

- View all purchased tickets
- See event details (date, location, organizer)
- Download ticket as PDF
- Show QR code for check-in

### Engagement Features

- **Like Events**: Save events to favorites
- **Follow Organizers**: Stay updated on organizer events
- **Liked Events**: View all liked events
- **Following**: View followed organizers

### Public Pages

- **About Us**: Learn about the platform
- **Contact Us**: Submit inquiries
- **Pricing**: View subscription plans for organizers
- **Info Pages**: Privacy Policy, Terms of Service, FAQ, Refund Policy

---

## Organizer Guide

### Dashboard (User Home)

After login, access the organizer dashboard with:

- Overview of your events
- Quick stats (total events, attendees, revenue)
- Recent activity
- Quick actions (create event, view reports)

### Event Management

#### Creating Events

1. Navigate to **My Events** or click "Create Event"
2. Fill in event details:
   - **Basic Info**: Event name, description
   - **Date & Time**: Start/end dates, timezone
   - **Location**: Onsite address, online platform, or hybrid
   - **Capacity**: Total attendee limit
   - **Registration**: Open/close dates
   - **Branding**: Custom color, logo
3. Save as draft or publish

#### Event Statuses

| Status    | Description                      |
| --------- | -------------------------------- |
| DRAFT     | Not visible to public            |
| PUBLISHED | Live and accepting registrations |
| LIVE      | Event is currently happening     |
| CLOSED    | Event ended                      |
| CANCELLED | Event cancelled                  |

#### Managing Events

- **Edit**: Modify event details
- **Duplicate**: Clone event for quick creation
- **Archive**: Move to archive (past events)
- **Cancel**: Cancel event with optional refund

### Ticket Management

#### Creating Ticket Types

1. Open event → **Tickets** tab
2. Click "Add Ticket Type"
3. Configure:
   - Name (e.g., "General Admission", "VIP")
   - Description
   - Price (free or paid)
   - Quantity available
   - Sales window (start/end dates)
   - Discount percentage
4. Save ticket type

#### Ticket Options

- **Capacity per ticket**: Bundle multiple attendees (e.g., 1 ticket = 5 people)
- **Discount codes**: Create promotional codes
- **Sales windows**: Set when tickets are available

### Registration Management

- **View Registrations**: See all attendees
- **Filter by status**: Paid, pending, failed
- **Export**: Download attendee list
- **Manual registration**: Add attendee manually
- **Check-in**: Mark attendees as arrived

### Reports & Analytics

#### Organizer Reports

Access via **Reports**:

- **Overview**: Total events, registrations, revenue
- **Event Performance**: Per-event breakdown
- **Revenue**: Payment summaries
- **Attendance**: Check-in rates
- **Export**: Generate CSV reports

### Team Management

#### Team Settings

1. Navigate to **Team** in settings
2. **Invite Members**: Add team members via email
3. **Roles**: Assign roles (Staff, Organizer)
4. **Manage**: Remove or modify team access

### Settings

#### Organizer Profile

- **Profile Info**: Name, bio, website
- **Social Links**: Facebook, Twitter
- **Branding**: Profile picture, cover image
- **Verification**: Verified badge status

#### Email Settings

- **Sender Name**: Display name in emails
- **Reply-To**: Email for replies
- **Templates**: Customize email notifications

#### Payment Settings

- **HitPay Configuration**: Connect payment gateway
- **API Keys**: Sandbox/live mode
- **Test Mode**: Verify payments without real charges

### Subscriptions

#### Plan Management

1. Navigate to **Subscription**
2. **View Current Plan**: Features and limits
3. **Upgrade/Downgrade**: Change plan
4. **Billing**: Monthly/yearly options
5. **Trial**: 14-day free trial

#### Plan Features

| Feature          | Starter | Professional | Enterprise |
| ---------------- | ------- | ------------ | ---------- |
| Max Events       | 3       | Unlimited    | Unlimited  |
| Paid Events      | 0       | Unlimited    | Unlimited  |
| Staff Accounts   | 1       | 5            | Unlimited  |
| Email Quota/Day  | 50      | 200          | Unlimited  |
| Custom Branding  | ❌      | ✅           | ✅         |
| Discount Codes   | ❌      | ✅           | ✅         |
| Advanced Reports | ❌      | ✅           | ✅         |
| Priority Support | ❌      | ❌           | ✅         |

### Support

- **Organizer Support**: Submit help tickets
- **Response Time**: Based on subscription plan

---

## Admin Guide

### Admin Dashboard

Access via **Admin** in navigation after login as admin:

- **Overview**: System-wide statistics
- **Total Events**: All published events
- **Total Registrations**: Platform-wide signups
- **Revenue**: Total platform revenue
- **Active Users**: Current users

### Events Management

#### All Events

- View all events across platform
- **Filter by status**: Draft, Published, Live, Closed, Cancelled
- **Search**: Find specific events
- **Actions**: Edit, Archive, Delete, Force Cancel

#### Event Details

- View event information
- See ticket types and sales
- View registrations
- Check analytics

### Registrations

#### All Registrations

- View all ticket purchases
- **Filter by**: Event, status, date
- **Search**: By attendee name/email
- **Export**: Download full list

### Check-In

#### Check-In System

1. Navigate to **Check-In**
2. Select event
3. **Scan QR**: Use camera to scan attendee QR
4. **Manual**: Enter ticket code
5. **Verify**: View attendee details
6. **Check In**: Mark as arrived

### Subscription Plans

#### Plan Management

- View all subscription plans
- **Create Plan**: Add new pricing tier
- **Edit Plan**: Modify features/pricing
- **Set Default**: Mark default plan
- **Activate/Deactivate**: Toggle availability

### Settings

#### System Settings

- **Platform Config**: General settings
- **Email Templates**: System emails
- **Payment Gateway**: HitPay admin config

### Support Tickets

#### Ticket Management

- View all support tickets
- **Filter by**: Status, priority, category
- **Assign**: Assign to admin/staff
- **Resolve**: Close resolved tickets
- **Reply**: Send responses to users

---

## Troubleshooting

### Common Issues

#### Payment Issues

- **Payment Failed**: Check card details, try different payment method
- **Pending Payment**: Wait for processing, contact support if persists

#### Registration Issues

- **Event Full**: Wait for cancellations or contact organizer
- **Registration Closed**: Event registration period ended

#### Login Issues

- **Wrong Password**: Use "Forgot Password" to reset
- **Account Not Found**: Check email or register new account

#### Ticket Issues

- **Ticket Not Received**: Check spam folder or contact support
- **QR Code Not Working**: Refresh page or contact organizer

### Support Contact

- **Email**: support@startuplab.com
- **Phone**: Available in Contact Us page
- **In-App**: Submit support ticket via Organizer Support

---

## Quick Reference

### Navigation Paths

| Action          | Path                        |
| --------------- | --------------------------- |
| Browse Events   | Home → Event List           |
| My Tickets      | Navigation → My Tickets     |
| Create Event    | My Events → Create Event    |
| View Reports    | Reports → Organizer Reports |
| Team Settings   | Settings → Team             |
| Admin Dashboard | Admin → Dashboard           |

### Keyboard Shortcuts

- **Search**: `/` or `Ctrl+K`
- **New Event**: `Ctrl+N` (Organizer)
- **Save**: `Ctrl+S`

---

_Document Version: 1.0_
_Last Updated: March 2026_
