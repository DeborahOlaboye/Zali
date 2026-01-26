# Frontend Component Hierarchy & Relationships

This document provides detailed component diagrams and relationships for the Zali frontend.

---

## 1. Route Structure

```mermaid
graph TD
    Layout["App Layout<br/>RootLayout"]
    Providers["Providers<br/>Web3, Query, AppKit"]
    Navigation["Navigation<br/>Navbar + MobileMenu"]
    
    Home["Home<br/>/"]
    Play["Play<br/>/play"]
    Leaderboard["Leaderboard<br/>/leaderboard"]
    Profile["Profile<br/>/profile/[address]"]
    Admin["Admin<br/>/admin"]
    Faucet["Faucet<br/>/faucet"]
    Results["Results<br/>/results"]
    Auth["Auth Pages<br/>/signin, /register"]
    
    Layout --> Providers
    Providers --> Navigation
    Navigation --> Home
    Navigation --> Play
    Navigation --> Leaderboard
    Navigation --> Profile
    Navigation --> Admin
    Navigation --> Faucet
    Navigation --> Results
    Navigation --> Auth

    style Layout fill:#e1f5ff
    style Providers fill:#f3e5f5
    style Navigation fill:#fff3e0
```

---

## 2. Play Page Component Tree

```mermaid
graph TD
    PlayPage["PlayPage<br/>/play"]
    
    subgraph GameContainer["Game Container"]
        GameLayout["GameLayout<br/>Grid structure"]
        GameContent["GameContent<br/>Main area"]
    end
    
    subgraph MainArea["Main Game Area"]
        QuestionCard["QuestionCard<br/>Question display"]
        QuestionText["Question Text<br/>Markdown support"]
        CategoryBadge["Category Badge<br/>Visual indicator"]
        DifficultyBadge["Difficulty Badge<br/>Color coded"]
    end
    
    subgraph OptionsArea["Options Area"]
        OptionButtons["OptionButtons<br/>Container"]
        ButtonEach["Option Button<br/>(Multiple)"]
        SelectedState["Selected State<br/>Visual feedback"]
    end
    
    subgraph MetaArea["Meta Information"]
        QuestionInfo["Question Info<br/>ID, Category"]
        Timer["Timer<br/>Countdown"]
        ScoreDisplay["Score Display<br/>Current score"]
    end
    
    subgraph ResultsArea["Results Area"]
        ResultCard["ResultCard<br/>Show result"]
        CorrectMessage["Correct Message<br/>Success"]
        IncorrectMessage["Incorrect Message<br/>Try again"]
        RewardDisplay["Reward Display<br/>USDC amount"]
    end
    
    subgraph Actions["Action Buttons"]
        NextButton["Next Question<br/>Button"]
        SkipButton["Skip Question<br/>Button"]
        ExitButton["Exit Game<br/>Button"]
    end
    
    PlayPage --> GameContainer
    GameContainer --> GameLayout
    GameLayout --> MainArea
    GameLayout --> OptionsArea
    GameLayout --> MetaArea
    GameLayout --> ResultsArea
    GameLayout --> Actions
    
    MainArea --> QuestionCard
    QuestionCard --> QuestionText
    QuestionCard --> CategoryBadge
    QuestionCard --> DifficultyBadge
    
    OptionsArea --> OptionButtons
    OptionButtons --> ButtonEach
    ButtonEach --> SelectedState
    
    style PlayPage fill:#e1f5ff
    style GameContainer fill:#c8e6c9
    style MainArea fill:#fff9c4
    style OptionsArea fill:#ffccbc
    style MetaArea fill:#f3e5f5
    style ResultsArea fill:#c5cae9
```

---

## 3. Leaderboard Component Structure

```mermaid
graph TD
    LeaderboardPage["LeaderboardPage<br/>/leaderboard"]
    
    subgraph Container["Container"]
        Header["Leaderboard Header<br/>Title + filters"]
        Filters["Filters<br/>Time range"]
        Sorting["Sorting<br/>By points/name"]
    end
    
    subgraph TableSection["Table Section"]
        TableContainer["Table Container<br/>Responsive"]
        TableHeader["Table Header<br/>Rank, Name, Score"]
        TableBody["Table Body<br/>Rows"]
        Row["Row Item<br/>(Multiple)"]
        RankCell["Rank Cell<br/>Position"]
        UserCell["User Cell<br/>Name/Address"]
        ScoreCell["Score Cell<br/>Points"]
    end
    
    subgraph Pagination["Pagination"]
        PageNav["Page Navigation<br/>Previous/Next"]
        PageSize["Page Size<br/>10/25/50"]
        CurrentPage["Current Page<br/>Indicator"]
    end
    
    subgraph Loading["Loading States"]
        Skeleton["Loading Skeleton<br/>Placeholder"]
        Empty["Empty State<br/>No data"]
        Error["Error State<br/>Failed to load"]
    end
    
    LeaderboardPage --> Container
    Container --> Header
    Header --> Filters
    Header --> Sorting
    
    Container --> TableSection
    TableSection --> TableContainer
    TableContainer --> TableHeader
    TableContainer --> TableBody
    TableBody --> Row
    
    Row --> RankCell
    Row --> UserCell
    Row --> ScoreCell
    
    TableSection --> Pagination
    Pagination --> PageNav
    Pagination --> PageSize
    Pagination --> CurrentPage
    
    LeaderboardPage --> Loading
    Loading --> Skeleton
    Loading --> Empty
    Loading --> Error

    style LeaderboardPage fill:#e1f5ff
    style Container fill:#c8e6c9
    style TableSection fill:#fff9c4
    style Pagination fill:#ffccbc
    style Loading fill:#ffebee
```

---

## 4. Profile Page Components

```mermaid
graph TD
    ProfilePage["ProfilePage<br/>/profile/[address]"]
    
    subgraph ProfileHeader["Profile Header"]
        UserInfo["User Info<br/>Name, Address"]
        Avatar["Avatar<br/>Profile picture"]
        Stats["Stats Summary<br/>Total score"]
    end
    
    subgraph ProfileTabs["Profile Tabs"]
        TabContainer["Tab Navigation<br/>Overview, History"]
        OverviewTab["Overview Tab<br/>Summary"]
        HistoryTab["History Tab<br/>Game history"]
        AchievementsTab["Achievements Tab<br/>Badges"]
    end
    
    subgraph Overview["Overview Content"]
        TotalScore["Total Score<br/>Card"]
        TotalGames["Total Games<br/>Card"]
        Winrate["Win Rate<br/>Card"]
        AverageReward["Avg Reward<br/>Card"]
    end
    
    subgraph History["Game History"]
        HistoryList["History List<br/>Vertical"]
        HistoryItem["History Item<br/>(Multiple)"]
        QuestionPlayed["Question<br/>Metadata"]
        ResultStatus["Result Status<br/>✓/✗"]
        RewardEarned["Reward<br/>Amount"]
    end
    
    subgraph Achievements["Achievements"]
        AchievementGrid["Achievement Grid<br/>Multiple columns"]
        Badge["Achievement Badge<br/>(Multiple)"]
        BadgeInfo["Badge Info<br/>Name, description"]
        LockedBadge["Locked Badge<br/>Greyed out"]
    end
    
    ProfilePage --> ProfileHeader
    ProfileHeader --> UserInfo
    ProfileHeader --> Avatar
    ProfileHeader --> Stats
    
    ProfilePage --> ProfileTabs
    ProfileTabs --> TabContainer
    TabContainer --> OverviewTab
    TabContainer --> HistoryTab
    TabContainer --> AchievementsTab
    
    OverviewTab --> Overview
    Overview --> TotalScore
    Overview --> TotalGames
    Overview --> Winrate
    Overview --> AverageReward
    
    HistoryTab --> History
    History --> HistoryList
    HistoryList --> HistoryItem
    HistoryItem --> QuestionPlayed
    HistoryItem --> ResultStatus
    HistoryItem --> RewardEarned
    
    AchievementsTab --> Achievements
    Achievements --> AchievementGrid
    AchievementGrid --> Badge
    AchievementGrid --> LockedBadge
    Badge --> BadgeInfo

    style ProfilePage fill:#e1f5ff
    style ProfileHeader fill:#f3e5f5
    style ProfileTabs fill:#c8e6c9
    style Overview fill:#fff9c4
    style History fill:#ffccbc
    style Achievements fill:#c5cae9
```

---

## 5. Admin Dashboard Components

```mermaid
graph TD
    AdminPage["AdminPage<br/>/admin"]
    
    subgraph AdminNav["Admin Navigation"]
        NavTabs["Tab Navigation<br/>Multiple sections"]
        QuestionsTab["Questions Tab"]
        UsersTab["Users Tab"]
        StatsTab["Stats Tab"]
    end
    
    subgraph QuestionMgmt["Question Management"]
        QuestionTable["Question Table<br/>List all"]
        AddButton["Add Question<br/>Button"]
        EditButton["Edit Question<br/>Button"]
        DeleteButton["Delete Question<br/>Button"]
        QuestionForm["Question Form<br/>Modal"]
    end
    
    subgraph UserMgmt["User Management"]
        UserTable["User Table<br/>All users"]
        UserSearch["User Search<br/>By address"]
        BanButton["Ban User<br/>Button"]
        ResetScore["Reset Score<br/>Button"]
    end
    
    subgraph Analytics["Analytics"]
        TotalQuestions["Total Questions<br/>Card"]
        TotalUsers["Total Users<br/>Card"]
        TotalRewards["Total Rewards<br/>Card"]
        Chart["Analytics Chart<br/>Graph"]
    end
    
    AdminPage --> AdminNav
    AdminNav --> NavTabs
    NavTabs --> QuestionsTab
    NavTabs --> UsersTab
    NavTabs --> StatsTab
    
    QuestionsTab --> QuestionMgmt
    QuestionMgmt --> QuestionTable
    QuestionMgmt --> AddButton
    QuestionMgmt --> EditButton
    QuestionMgmt --> DeleteButton
    AddButton --> QuestionForm
    EditButton --> QuestionForm
    
    UsersTab --> UserMgmt
    UserMgmt --> UserTable
    UserMgmt --> UserSearch
    UserMgmt --> BanButton
    UserMgmt --> ResetScore
    
    StatsTab --> Analytics
    Analytics --> TotalQuestions
    Analytics --> TotalUsers
    Analytics --> TotalRewards
    Analytics --> Chart

    style AdminPage fill:#e1f5ff
    style AdminNav fill:#f3e5f5
    style QuestionMgmt fill:#c8e6c9
    style UserMgmt fill:#fff9c4
    style Analytics fill:#ffccbc
```

---

## 6. Shared Component Categories

```mermaid
graph TB
    SharedComponents["Shared Components<br/>40+ components"]
    
    subgraph Buttons["Button Components"]
        RespButton["ResponsiveButton"]
        LoadingButton["LoadingButton"]
        SkipButton["SkipButton"]
    end
    
    subgraph Cards["Card Components"]
        RespCard["ResponsiveCard"]
        QuestionCard["QuestionCard"]
        RewardCard["RewardCard"]
        LoadingCard["LoadingCard"]
    end
    
    subgraph Forms["Form Components"]
        RespForm["ResponsiveForm"]
        FormError["FormErrorBoundary"]
        Input["Input fields"]
    end
    
    subgraph Feedback["Feedback Components"]
        Spinner["LoadingSpinner"]
        Dots["LoadingDots"]
        Overlay["LoadingOverlay"]
        Progress["ProgressBar"]
    end
    
    subgraph Navigation["Navigation Components"]
        Navbar["Navbar"]
        MobileMenu["MobileMenu"]
        ContextMenu["ContextMenu"]
    end
    
    subgraph Tables["Table Components"]
        DataTable["DataTable"]
        TableSkeleton["DataTableSkeleton"]
        ResponsiveTable["ResponsiveTable"]
    end
    
    subgraph ErrorHandling["Error Boundaries"]
        ErrorBoundary["ErrorBoundary"]
        ContractEB["ContractErrorBoundary"]
        WalletEB["WalletErrorBoundary"]
        QueryEB["QueryErrorBoundary"]
    end
    
    SharedComponents --> Buttons
    SharedComponents --> Cards
    SharedComponents --> Forms
    SharedComponents --> Feedback
    SharedComponents --> Navigation
    SharedComponents --> Tables
    SharedComponents --> ErrorHandling

    style SharedComponents fill:#e1f5ff
    style Buttons fill:#c8e6c9
    style Cards fill:#fff9c4
    style Forms fill:#ffccbc
    style Feedback fill:#f3e5f5
    style Navigation fill:#c5cae9
    style Tables fill:#ffe0b2
    style ErrorHandling fill:#ffebee
```

---

## 7. Error Boundary Hierarchy

```mermaid
graph TD
    RootLayout["Root Layout"]
    
    WalletEB["WalletErrorBoundary<br/>Level 1"]
    QueryEB["QueryErrorBoundary<br/>Level 2"]
    ContractEB["ContractErrorBoundary<br/>Level 3"]
    TransactionEB["TransactionErrorBoundary<br/>Level 4"]
    FormEB["FormErrorBoundary<br/>Level 4"]
    RouteEB["RouteErrorBoundary<br/>Level 4"]
    
    RootLayout --> WalletEB
    WalletEB --> QueryEB
    QueryEB --> ContractEB
    ContractEB --> TransactionEB
    ContractEB --> FormEB
    ContractEB --> RouteEB
    
    TransactionEB -->|catches| WalletReject["Wallet Rejection"]
    TransactionEB -->|catches| NetworkFail["Network Failure"]
    TransactionEB -->|catches| GasEstimate["Gas Estimation Error"]
    
    FormEB -->|catches| ValidationErr["Validation Error"]
    FormEB -->|catches| SubmitErr["Submit Error"]
    
    RouteEB -->|catches| ComponentErr["Component Error"]
    RouteEB -->|catches| NotFound["Not Found (404)"]

    style RootLayout fill:#ffe0b2
    style WalletEB fill:#ffccbc
    style QueryEB fill:#ffccbc
    style ContractEB fill:#ffccbc
    style TransactionEB fill:#ffebee
    style FormEB fill:#ffebee
    style RouteEB fill:#ffebee
```

---

## 8. Custom Hooks Organization

```mermaid
graph TB
    Hooks["Custom Hooks"]
    
    subgraph ContractHooks["Contract Hooks"]
        UseContract["useContract<br/>Contract instance"]
        UseContractRead["useContractRead<br/>Read data"]
        UseContractWrite["useContractWrite<br/>Write data"]
        UseUserScore["useUserScore<br/>Get user score"]
    end
    
    subgraph WalletHooks["Wallet Hooks"]
        UseAccount["useAccount<br/>Account info"]
        UseBalance["useBalance<br/>Token balance"]
        UseConnect["useConnect<br/>Connect wallet"]
        UseDisconnect["useDisconnect"]
    end
    
    subgraph StateHooks["State Hooks"]
        UseGameState["useGameState<br/>Zustand"]
        UseAuthState["useAuthState<br/>Zustand"]
        UseUIState["useUIState<br/>Zustand"]
        UseAchievements["useAchievements<br/>Zustand"]
    end
    
    subgraph DataHooks["Data Hooks"]
        UseQuestions["useQuestions<br/>Fetch questions"]
        UseLeaderboard["useLeaderboard<br/>Fetch rankings"]
        UseUserProfile["useUserProfile<br/>User data"]
        UseGameHistory["useGameHistory<br/>Past games"]
    end
    
    subgraph UtilityHooks["Utility Hooks"]
        UseAsync["useAsync<br/>Async handling"]
        UseLocalStorage["useLocalStorage<br/>Persistence"]
        UsePrevious["usePrevious<br/>Track previous"]
        UseDebounce["useDebounce<br/>Debounce value"]
    end
    
    Hooks --> ContractHooks
    Hooks --> WalletHooks
    Hooks --> StateHooks
    Hooks --> DataHooks
    Hooks --> UtilityHooks

    style Hooks fill:#e1f5ff
    style ContractHooks fill:#c8e6c9
    style WalletHooks fill:#fff9c4
    style StateHooks fill:#ffccbc
    style DataHooks fill:#f3e5f5
    style UtilityHooks fill:#c5cae9
```

---

## 9. Service Layer Architecture

```mermaid
graph TB
    Services["Services Layer"]
    
    subgraph ContractServices["Contract Services"]
        QuestionSvc["questionService<br/>CRUD questions"]
        AnswerSvc["answerService<br/>Submit answers"]
        ScoreSvc["scoreService<br/>Get scores"]
    end
    
    subgraph UserServices["User Services"]
        ProfileSvc["profileService<br/>User profile"]
        AuthSvc["authService<br/>Authentication"]
        AchievementSvc["achievementService<br/>Badges"]
    end
    
    subgraph DataServices["Data Services"]
        LeaderboardSvc["leaderboardService<br/>Rankings"]
        AnalyticsSvc["analyticsService<br/>Tracking"]
        CacheSvc["cacheService<br/>Client cache"]
    end
    
    Services --> ContractServices
    Services --> UserServices
    Services --> DataServices
    
    ContractServices -->|calls| Web3["Web3 Layer<br/>Wagmi"]
    UserServices -->|calls| Web3
    DataServices -->|calls| Web3

    style Services fill:#e1f5ff
    style ContractServices fill:#c8e6c9
    style UserServices fill:#fff9c4
    style DataServices fill:#ffccbc
```

---

## 10. Data Flow Through Components

```mermaid
graph LR
    User["👤 User"]
    Component["React Component"]
    Store["Zustand Store"]
    Service["Service Layer"]
    Web3["Web3/Wagmi"]
    Contract["Smart Contract"]
    
    User -->|click| Component
    Component -->|dispatch| Store
    Store -->|call| Service
    Service -->|call| Web3
    Web3 -->|call| Contract
    Contract -->|event| Web3
    Web3 -->|return| Service
    Service -->|update| Store
    Store -->|notify| Component
    Component -->|render| User

    style User fill:#ffebee
    style Component fill:#e1f5ff
    style Store fill:#f3e5f5
    style Service fill:#c8e6c9
    style Web3 fill:#fff9c4
    style Contract fill:#e8f5e9
```

---

## Component Reusability Matrix

| Component | Type | Reusable | Location |
|-----------|------|----------|----------|
| QuestionCard | Specific | ❌ | /play |
| ResponsiveButton | Shared | ✅ | /components |
| ResponsiveCard | Shared | ✅ | /components |
| Leaderboard | Page | ❌ | /leaderboard |
| PointsHistory | Shared | ✅ | /components |
| ErrorBoundary | Shared | ✅ | /components |
| LoadingSpinner | Shared | ✅ | /components |
| Navbar | Shared | ✅ | /components |

---

## Best Practices for Component Development

### 1. Component Organization
```
component-name/
├── index.tsx          ← Export
├── Component.tsx      ← Main component
├── styles.module.css  ← Styles
├── types.ts          ← TypeScript types
└── hooks.ts          ← Component hooks
```

### 2. Props Interface Pattern
```typescript
interface ComponentProps {
  // Required props
  required: string;
  
  // Optional with defaults
  optional?: boolean;
  
  // Callbacks
  onAction?: (value: string) => void;
  
  // Children
  children?: React.ReactNode;
}
```

### 3. Error Boundary Wrapping
```typescript
// Always wrap components that interact with Web3
<ContractErrorBoundary>
  <TransactionComponent />
</ContractErrorBoundary>
```

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete
