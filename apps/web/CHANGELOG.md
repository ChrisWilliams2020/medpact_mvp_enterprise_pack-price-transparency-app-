# MedPact Practice Intelligence - Changelog

## Version 2.1.0 - Competitive Intelligence & Staff Automation Release
**Release Date:** March 17, 2026  
**Release Name:** "Competitive Intelligence & Staff Automation Release"

### 🎯 New Feature: Competitive Intelligence with Google Maps
A comprehensive competitive analysis platform integrated with Google Maps for geographic-based competitor tracking.

#### Map View Features
- **Interactive Google Maps Integration**: Visual competitor mapping with practice locations
- **Geographic Radius Search**: 5, 10, 25, 50 mile radius options
- **Your Practice Centered**: Radius circle overlay showing competitive landscape
- **Click-to-Select Competitors**: Detailed competitor profile panel on selection
- **Market Trend Indicators**: Growing (red), Stable (yellow), Declining (green) markers

#### Multi-Platform Rating Tracking
- **Google Ratings**: Stars + review count
- **Yelp Ratings**: Stars + review count  
- **Healthgrades Ratings**: Stars + review count
- **Aggregated Overall Rating**: Combined score across platforms
- **Rating Comparison**: Your practice vs competitors

#### Competitor Profiles Include
- Practice name, address, phone, distance
- Market share percentage
- Number of providers
- Year established
- Services offered (LASIK, Cataract Surgery, etc.)
- Specialties (Cornea, Retina, Glaucoma, etc.)
- Insurance networks accepted
- Market trend indicator

#### Market Analysis Tab
- Rating comparison bar charts
- Market share distribution visualization
- Service overlap analysis (color-coded by competition level)
- Competitive threats identification (growing practices nearby)

#### Notification Settings
- 🆕 New Competitor Alert
- ⭐ Rating Change Notifications
- 💬 Review Alerts
- 📈 Market Trend Alerts
- 📊 Weekly Analytics Report

---

### 🤖 New Feature: AI Staff Assistants
Role-specific AI assistants for every staff function with 20+ automations per role.

#### 6 AI Assistant Roles
1. **👔 Practice Manager AI**
   - Daily ops briefing, staff scheduling, revenue optimization
   - Performance analytics, compliance tracking, workflow automation

2. **📞 Receptionist AI**
   - Appointment scheduling, patient check-in, insurance verification
   - Phone call handling, waitlist management, reminder automation

3. **🔬 Medical Technician AI**
   - Pre-exam prep, equipment scheduling, diagnostic review
   - Patient history summary, test result management

4. **💰 Billing Specialist AI**
   - Claim submission, denial management, payment posting
   - AR follow-up, coding optimization, revenue recovery

5. **✅ Checkout Coordinator AI**
   - Follow-up scheduling, payment collection, recall management
   - Patient instructions, referral coordination

6. **📋 Insurance Verification AI**
   - Eligibility verification, benefits breakdown, prior auth
   - Coverage analysis, network status, deductible tracking

#### AI Assistant Features
- Chat interface for natural language queries
- Quick action buttons for common tasks
- Capability toggles for enabling/disabling features
- Real-time processing indicators

---

### 👥 Enhanced Staff Intelligence

#### Add Staff Modal (NEW)
- **Form Fields**: Full name, Role (dropdown), Email, Phone (SMS)
- **Survey Options**:
  - Toggle to send onboarding survey immediately
  - Delivery method selector: 📧 Email | 📱 SMS | 📧📱 Both
  - Survey type dropdown (Role Alignment, Time Allocation, Effectiveness, Onboarding)
- **Message Preview**: Live preview of invitation message
- **Success Animation**: Confirms staff added and survey sent

#### Survey Response Tracker (NEW)
- **Stats Dashboard**: Completion rate, completed, pending, overdue counts
- **Filter Options**: All, ✅ Completed, ⏳ Pending, ⚠️ Overdue
- **Response Table**:
  - Staff member name
  - Survey name
  - Sent via (📧/📱/📧📱)
  - Sent date
  - Status badge
  - Response time
  - Actions (🔄 Resend / 👁️ View)
- **Bulk Action**: "Send Reminders to All Pending" button

---

### ⏰ Overnight Build Automation

#### Build Scripts Added
- `scripts/overnight-build.sh` - Main automated build script
- `scripts/setup-overnight-build.sh` - Installation script
- `scripts/com.medpact.overnight-build.plist` - macOS launchd config
- `scripts/cron-config.txt` - Alternative cron configuration

#### Build Process
- Scheduled for 2:00 AM daily
- Clean build environment
- npm ci for fresh dependencies
- ESLint validation
- Test suite execution
- Production build with bundle analysis
- Build report generation
- Log files stored in `/logs/build_YYYYMMDD_HHMMSS.log`

---

### 📊 Platform Statistics

| Feature | Count |
|---------|-------|
| Metric Packages | 6 |
| Total Metrics | 71 |
| AI Staff Assistants | 6 |
| Competitor Tracking | ✅ |
| Market Regions | 5 |
| KCN Chatrooms | 6 |
| Negotiation Stages | 5 |

---

### 🔧 Technical Details

- **Framework**: React 18.2.0 with Vite 5.2.0
- **Bundle Size**: ~776KB total (index.js 609KB, vendor.js 159KB)
- **Port**: localhost:3000 (Vite dev server)
- **Branch**: ci/production-mvp

---

## Previous Versions

### Version 2.0.8 - Market Intelligence Release
**Release Date:** March 15, 2026

- MedPact SaaS + Gold: Complete market intelligence platform
- 5 regional market analysis: Northeast, Southeast, Midwest, Southwest, West
- Competitor tracking with threat level assessment
- Pricing intelligence with percentile rankings

### Version 2.0.5 - Enterprise Analytics
**Release Date:** March 2026

- 6 metric packages (Practice, PE-10, KPI-25, ASC-25, PE+ASC, Pricing)
- AI Insights panel with actionable recommendations
- Forecasting dashboard with cash flow projections
- Peer benchmarking and multi-practice rollup

---

## Roadmap

### Version 2.2.0 (Planned)
- Real Google Maps API integration
- Live competitor data feeds
- Automated review monitoring
- Market trend predictions with ML

### Version 2.3.0 (Planned)
- Patient acquisition intelligence
- Referral network mapping
- Marketing ROI analytics
- Social media monitoring

---

**MedPact Practice Intelligence**  
*Enterprise Analytics Platform for Ophthalmology*  
© 2026 MedPact. All rights reserved.
