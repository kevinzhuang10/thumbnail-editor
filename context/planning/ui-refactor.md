# UI Refactor Execution Plan

## Project Goal
Refactor thumbnail editor to full-screen, Claude-like interface using a new prototype page approach with new top nav header.

## Design Requirements (From Analysis)
- **New Top Nav Header**: ~48px fixed height, minimal Claude-style design
- **3-column layout**: Collapsible left sidebar | History panel | Main content area
- **Full viewport usage** - no containers/padding like Claude chat
- **Responsive design** with collapsible panels
- **Professional SaaS feel** matching modern app standards

## Development Approach
**Strategy**: Build new UI from scratch on separate prototype page, then integrate later

**Benefits**:
- Risk-free development (current app untouched)
- Focus purely on UI/UX without backend complexity
- Easy iteration and A/B testing
- Cleaner code built with new structure from day 1

## Implementation Plan

### Phase 1: Prototype Page Creation
- Create new route (e.g., `/prototype` or `/new-design`)
- Build static layout with new top nav + 3-column structure
- Use mock data for all components
- No API integration needed initially

### Phase 2: UI Component Development

#### 1. New Top Nav Header (~48px fixed height)
- App title/logo (left)
- User info/email (center/right)
- Sign out button (far right)
- Clean, minimal styling like Claude

#### 2. Collapsible Left Sidebar (~280px expanded, ~60px collapsed)
- Project list with thumbnails
- "New Project" button
- Toggle functionality

#### 3. History Panel (~300px fixed width, middle column)
- Edit history with visual hierarchy
- Always visible on desktop

#### 4. Main Content Area (flexible width, rightmost)
- Image display area
- Prompt input at bottom
- Clean, borderless design

### Phase 3: Responsive Behavior
- **Desktop**: All panels visible with new top nav
- **Tablet**: History becomes overlay/drawer
- **Mobile**: Sidebar becomes slide-out drawer

### Phase 4: Integration (Later)
- Connect real Supabase APIs
- Replace mock data with actual functionality
- Migrate auth integration
- Switch routes when UI approved

## Key Technical Details
- **Layout**: `h-screen` with fixed top nav + flex columns below
- **Height calc**: Main content uses `calc(100vh - 48px)`
- **No containers**: Remove `max-w-7xl mx-auto` patterns
- **Component order**: TopNav → (Sidebar | History | Main)
- **Full-screen experience**: True viewport utilization

## Updated Component Structure
```
AppLayout (h-screen)
├── NewTopNav (48px fixed, full width)
└── MainContent (calc(100vh - 48px), flex row)
    ├── CollapsibleSidebar (~280px / ~60px)
    ├── HistoryPanel (~300px fixed)
    └── MainArea (flex-1)
```

## Design References
- `/context/design-reference/homepage-design.png` - Target layout mockup
- `/context/design-reference/claude-chat-expanded.png` - Expanded sidebar reference
- `/context/design-reference/claude-chat-collapsed.png` - Collapsed sidebar reference

## Next Steps
1. Create prototype page route
2. Build new top nav component
3. Create 3-column layout structure
4. Implement collapsible sidebar
5. Add mock content and interactions

## Status
- [x] Design analysis completed
- [x] Plan created and documented
- [ ] Prototype page creation
- [ ] UI component development
- [ ] Responsive implementation
- [ ] Integration with existing functionality

---

*Last updated: 2025-01-14*
*Ready to proceed with prototype development with new top nav header design.*