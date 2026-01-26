# Zali Architecture Diagrams

## Overview

This document provides visual architecture diagrams for the Zali trivia game application. These diagrams help new contributors understand the system structure, data flow, and component interactions.

**Tools Used:**
- Mermaid.js for interactive diagrams (embedded in markdown)
- SVG-compatible for rendering in GitHub

---

## 1. System Architecture Diagram

Overall application structure showing frontend, backend, blockchain, and external services.

```mermaid
graph TB
    subgraph Frontend["Frontend Layer (Next.js)"]
        UI["React Components"]
        Store["Zustand Store<br/>(State Management)"]
        Hooks["Custom Hooks"]
        UI -->|state| Store
        UI -->|logic| Hooks
    end
    
    subgraph Web3["Web3 Layer"]
        Wagmi["Wagmi/Viem<br/>(Web3 SDK)"]
        AppKit["AppKit<br/>(Wallet Connection)"]
        Contract["Smart Contracts<br/>(Solidity)"]
        AppKit -->|connect| Wagmi
        Wagmi -->|interact| Contract
    end
    
    subgraph Blockchain["Blockchain (Base Network)"]
        SC["SimpleTriviaGame<br/>Contract"]
        USDC["USDC Token"]
        SC -->|transfer| USDC
    end
    
    subgraph External["External Services"]
        Faucet["USDC Faucet"]
        Analytics["Analytics"]
        Storage["IPFS/Cloud"]
    end
    
    Frontend -->|queries| Web3
    Web3 -->|deployed on| Blockchain
    Frontend -->|events from| Blockchain
    Frontend -->|track| Analytics
    Frontend -->|store data| Storage
    USDC -.->|rewards| Frontend
    Faucet -.->|drip| USDC

    style Frontend fill:#e1f5ff
    style Web3 fill:#f3e5f5
    style Blockchain fill:#e8f5e9
    style External fill:#fff3e0
```

---

## 2. Data Flow Diagram

How data flows from user action through the application to blockchain and back.

```mermaid
graph LR
    subgraph UserAction["User Action"]
        A["Player connects<br/>wallet"]
    end
    
    subgraph FrontendProcessing["Frontend Processing"]
        B["UI Component<br/>renders"]
        C["User selects<br/>answer"]
        D["Zustand store<br/>updates"]
    end
    
    subgraph Web3Interaction["Web3 Interaction"]
        E["Wagmi prepares<br/>transaction"]
        F["AppKit shows<br/>signature request"]
        G["Wallet signs<br/>transaction"]
    end
    
    subgraph BlockchainExecution["Blockchain Execution"]
        H["SimpleTriviaGame<br/>verifies answer"]
        I["Check if correct"]
        J["Transfer USDC<br/>reward"]
        K["Update score<br/>mapping"]
    end
    
    subgraph EventHandling["Event Handling"]
        L["Contract emits<br/>AnswerSubmitted event"]
        M["Frontend listens<br/>for event"]
        N["Update local state<br/>& UI"]
    end
    
    A --> B --> C --> D --> E --> F --> G
    G --> H --> I
    I -->|correct| J --> K
    I -->|incorrect| K
    K --> L --> M --> N

    style UserAction fill:#ffebee
    style FrontendProcessing fill:#e1f5ff
    style Web3Interaction fill:#f3e5f5
    style BlockchainExecution fill:#e8f5e9
    style EventHandling fill:#fce4ec
```

---

## 3. Smart Contract Interactions Diagram

How the frontend interacts with smart contracts on the blockchain.

```mermaid
graph TB
    subgraph Frontend["Frontend Application"]
        UI["React UI"]
        Wagmi["Wagmi Hook"]
        WriteContract["useContractWrite"]
        ReadContract["useContractRead"]
    end
    
    subgraph SmartContracts["Smart Contracts (Base Network)"]
        STG["SimpleTriviaGame<br/>Contract"]
        Events["Events:<br/>QuestionAdded<br/>AnswerSubmitted"]
    end
    
    subgraph Functions["Contract Functions"]
        AddQ["addQuestion<br/>(Owner only)"]
        Submit["submitAnswer"]
        GetQ["getQuestion"]
        GetScore["getUserScore"]
        Deactivate["deactivateQuestion"]
    end
    
    subgraph Storage["Contract Storage"]
        Questions["questions mapping<br/>ID → Question"]
        Scores["userScores mapping<br/>Address → Score"]
        Counter["questionId counter"]
    end
    
    UI -->|calls| WriteContract
    UI -->|queries| ReadContract
    WriteContract -->|execute| AddQ
    WriteContract -->|execute| Submit
    WriteContract -->|execute| Deactivate
    ReadContract -->|read| GetQ
    ReadContract -->|read| GetScore
    
    AddQ --> Questions
    AddQ --> Counter
    Submit --> Scores
    Submit --> Questions
    Deactivate --> Questions
    
    STG -->|contains| Functions
    STG -->|emits| Events
    STG -->|manages| Storage
    
    Events -->|listen| UI

    style Frontend fill:#e1f5ff
    style SmartContracts fill:#e8f5e9
    style Functions fill:#c8e6c9
    style Storage fill:#a5d6a7
```

---

## 4. Component Hierarchy Diagram

Frontend component tree showing parent-child relationships and data flow.

```mermaid
graph TD
    App["App<br/>layout.tsx"]
    Providers["Providers<br/>App providers<br/>Wagmi, Query, AppKit"]
    
    MainLayout["MainLayout<br/>Main page.tsx"]
    Navbar["Navbar<br/>Header navigation"]
    
    Pages["Pages"]
    PlayPage["Play Page<br/>/play"]
    LeaderboardPage["Leaderboard<br/>/leaderboard"]
    ProfilePage["Profile<br/>/profile"]
    AdminPage["Admin<br/>/admin"]
    FaucetPage["Faucet<br/>/faucet"]
    
    PlayComponents["Play Page Components"]
    QuestionCard["QuestionCard<br/>Display question"]
    OptionButtons["Option Buttons<br/>Answer choices"]
    RewardCard["RewardCard<br/>Show reward"]
    Timer["Timer<br/>Time tracking"]
    
    SharedComponents["Shared Components"]
    Button["ResponsiveButton"]
    Container["ResponsiveContainer"]
    ErrorBoundary["ErrorBoundary"]
    LoadingSpinner["LoadingSpinner"]
    
    App --> Providers
    Providers --> MainLayout
    MainLayout --> Navbar
    MainLayout --> Pages
    
    Pages --> PlayPage
    Pages --> LeaderboardPage
    Pages --> ProfilePage
    Pages --> AdminPage
    Pages --> FaucetPage
    
    PlayPage --> PlayComponents
    PlayComponents --> QuestionCard
    PlayComponents --> OptionButtons
    PlayComponents --> RewardCard
    PlayComponents --> Timer
    
    QuestionCard --> SharedComponents
    OptionButtons --> Button
    RewardCard --> Container
    Timer --> SharedComponents
    
    PlayPage --> ErrorBoundary
    
    style App fill:#e1f5ff
    style Providers fill:#f3e5f5
    style Pages fill:#fff3e0
    style PlayComponents fill:#c8e6c9
    style SharedComponents fill:#ffccbc
```

---

## 5. State Management Architecture

Zustand store structure and state slices.

```mermaid
graph TB
    Store["useStore<br/>Zustand Store"]
    
    subgraph Middleware["Middleware"]
        Devtools["Devtools<br/>Dev tools"]
        Persist["Persist<br/>localStorage"]
        Immer["Immer<br/>Immutable updates"]
    end
    
    subgraph Slices["State Slices"]
        Auth["AuthSlice<br/>User, isAuthenticated"]
        Game["GameSlice<br/>currentQuestion,<br/>userScore"]
        UI["UISlice<br/>theme, notifications,<br/>isLoading"]
        Achievement["AchievementSlice<br/>achievements,<br/>badges"]
    end
    
    subgraph StateData["State Data"]
        User["User: {<br/>address, username<br/>}"]
        Question["Question: {<br/>text, options,<br/>reward<br/>}"]
        Theme["Theme: light|dark"]
        Notifications["Notifications: []"]
    end
    
    Store --> Middleware
    Store --> Slices
    
    Auth --> User
    Game --> Question
    UI --> Theme
    UI --> Notifications
    Achievement --> StateData
    
    Middleware -->|enable| Devtools
    Middleware -->|save| Persist
    Middleware -->|draft| Immer

    style Store fill:#f3e5f5
    style Middleware fill:#e0bee7
    style Slices fill:#c5cae9
    style StateData fill:#b0bec5
```

---

## 6. API and Data Layer

External APIs and data fetching patterns.

```mermaid
graph TB
    UI["Frontend UI"]
    
    subgraph DataFetching["Data Fetching"]
        ReactQuery["React Query<br/>Cache management"]
        Hooks["Custom Hooks<br/>useQuestion,<br/>useLeaderboard"]
    end
    
    subgraph Services["Services Layer"]
        QuestionService["Question Service<br/>fetch, add, update"]
        UserService["User Service<br/>profile, scores"]
        ContractService["Contract Service<br/>read/write ops"]
    end
    
    subgraph DataSources["Data Sources"]
        BlockchainRPC["Base RPC<br/>JSON-RPC calls"]
        LocalStorage["LocalStorage<br/>Client cache"]
        IPFS["IPFS/Cloud<br/>Media storage"]
    end
    
    UI -->|queries| ReactQuery
    ReactQuery -->|manages cache| Hooks
    
    Hooks -->|fetch| Services
    
    QuestionService -->|read| BlockchainRPC
    UserService -->|read| BlockchainRPC
    ContractService -->|read/write| BlockchainRPC
    
    Services -->|cache| LocalStorage
    Services -->|store media| IPFS

    style UI fill:#e1f5ff
    style DataFetching fill:#c5cae9
    style Services fill:#c8e6c9
    style DataSources fill:#ffccbc
```

---

## 7. Authentication & Authorization Flow

User authentication and permission system.

```mermaid
graph TB
    UserConnectsWallet["User clicks<br/>Connect Wallet"]
    
    AppKitDialog["AppKit Dialog<br/>Wallet selection"]
    
    WalletExtension["Wallet Extension<br/>MetaMask, etc"]
    
    SignatureRequest["Request signature<br/>from wallet"]
    
    UserSigns["User signs in<br/>wallet"]
    
    VerifySignature["Frontend verifies<br/>signature"]
    
    subgraph Authenticated["Authenticated State"]
        SaveAddress["Save wallet<br/>address"]
        SetAuthTrue["Set isAuthenticated<br/>to true"]
        StoreUser["Store user in<br/>Zustand"]
    end
    
    subgraph Routes["Routes Access"]
        AuthRoutes["Protected routes<br/>available"]
        GuestRoutes["Guest routes<br/>available"]
    end
    
    UserConnectsWallet --> AppKitDialog
    AppKitDialog --> WalletExtension
    WalletExtension --> SignatureRequest
    SignatureRequest --> UserSigns
    UserSigns --> VerifySignature
    VerifySignature -->|valid| Authenticated
    
    SaveAddress --> AuthRoutes
    SetAuthTrue --> AuthRoutes
    StoreUser --> AuthRoutes
    
    AuthRoutes -->|play| Play["Play Game"]
    AuthRoutes -->|profile| Profile["View Profile"]
    GuestRoutes -->|info| Info["About page"]

    style UserConnectsWallet fill:#ffebee
    style Authenticated fill:#c8e6c9
    style Routes fill:#c5cae9
```

---

## 8. Error Handling Architecture

How errors are caught and handled throughout the application.

```mermaid
graph TB
    subgraph ErrorSources["Error Sources"]
        ContractError["Smart Contract<br/>Error"]
        WalletError["Wallet Error<br/>Rejection"]
        NetworkError["Network Error<br/>RPC failure"]
        ValidationError["Validation Error<br/>Invalid input"]
        UIError["UI Error<br/>Component crash"]
    end
    
    subgraph ErrorBoundaries["Error Boundaries"]
        ContractEB["ContractErrorBoundary"]
        WalletEB["WalletErrorBoundary"]
        TransactionEB["TransactionErrorBoundary"]
        FormEB["FormErrorBoundary"]
        GeneralEB["ErrorBoundary"]
    end
    
    subgraph ErrorHandling["Error Handling"]
        Log["Log to console"]
        Display["Display to user"]
        Retry["Offer retry option"]
        Fallback["Show fallback UI"]
    end
    
    subgraph UserFeedback["User Feedback"]
        Toast["Toast notification"]
        Modal["Error modal"]
        Inline["Inline message"]
    end
    
    ContractError --> ContractEB
    WalletError --> WalletEB
    NetworkError --> TransactionEB
    ValidationError --> FormEB
    UIError --> GeneralEB
    
    ContractEB --> ErrorHandling
    WalletEB --> ErrorHandling
    TransactionEB --> ErrorHandling
    FormEB --> ErrorHandling
    GeneralEB --> ErrorHandling
    
    ErrorHandling --> UserFeedback

    style ErrorSources fill:#ffebee
    style ErrorBoundaries fill:#ffccbc
    style ErrorHandling fill:#fff9c4
    style UserFeedback fill:#c8e6c9
```

---

## 9. Request/Response Cycle

Complete cycle of a user answering a question.

```mermaid
sequenceDiagram
    participant User as User
    participant UI as React UI
    participant Store as Zustand Store
    participant Wagmi as Wagmi/Web3
    participant Contract as Smart Contract
    participant Blockchain as Base Network
    
    User->>UI: Selects answer option
    UI->>Store: Update selectedAnswer
    UI->>UI: Show loading state
    
    UI->>Wagmi: Call submitAnswer()
    Wagmi->>Contract: Execute transaction
    Contract->>Blockchain: Verify answer
    Blockchain->>Contract: Execute transfer if correct
    Contract-->>Blockchain: Emit AnswerSubmitted event
    
    Blockchain-->>Wagmi: Transaction confirmed
    Wagmi-->>UI: Return receipt
    
    UI->>Store: Update userScore
    UI->>Store: Clear selectedAnswer
    UI->>UI: Show result (correct/incorrect)
    
    Note over UI: Event listener picks up event
    UI->>UI: Update UI with new state
    
    UI-->>User: Display reward & next question
```

---

## 10. File Structure Organization

```
Zali/
├── contracts/
│   ├── src/
│   │   ├── SimpleTriviaGame.sol          ← Main trivia game contract
│   │   ├── Faucet.sol                    ← USDC faucet
│   │   └── MockVRFCoordinatorV3.sol      ← Testing VRF
│   ├── script/
│   │   └── DeploySimpleMainnet.s.sol     ← Deployment script
│   └── test/
│       ├── Faucet.t.sol
│       ├── TriviaGame.t.sol
│       └── TestUtils.sol
│
├── frontend/
│   ├── src/
│   │   ├── app/                          ← Next.js app router
│   │   │   ├── page.tsx                  ← Home page
│   │   │   ├── play/                     ← Game play page
│   │   │   ├── leaderboard/              ← Rankings
│   │   │   ├── profile/                  ← User profile
│   │   │   ├── admin/                    ← Admin panel
│   │   │   └── providers.tsx             ← Provider setup
│   │   ├── components/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── *.ErrorBoundary.tsx       ← Error boundaries
│   │   │   └── ...                       ← 40+ components
│   │   ├── hooks/
│   │   │   ├── useContract.ts
│   │   │   └── ...
│   │   ├── store/
│   │   │   ├── index.ts                  ← Zustand store
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── gameSlice.ts
│   │   │       ├── uiSlice.ts
│   │   │       └── achievementSlice.ts
│   │   ├── services/
│   │   │   ├── questionService.ts
│   │   │   ├── contractService.ts
│   │   │   └── ...
│   │   ├── types/
│   │   │   └── index.ts                  ← TypeScript types
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   ├── config/
│   │   ├── contracts.ts
│   │   └── web3.ts                       ← Wagmi config
│   ├── public/
│   │   └── ...
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE_DIAGRAMS.md          ← This file
│   ├── README.md
│   └── ...
│
└── README.md
```

---

## 11. Component Communication Pattern

How components communicate with each other and share state.

```mermaid
graph TB
    subgraph Parent["Parent Component<br/>PlayPage"]
        direction LR
        State["Local State"]
        StoreState["Zustand Store"]
    end
    
    subgraph Children["Child Components"]
        QC["QuestionCard"]
        OB["OptionButtons"]
        RC["RewardCard"]
    end
    
    subgraph Sharing["Data Sharing Methods"]
        Props["Props<br/>Down"]
        Events["Events<br/>Up"]
        Store["Zustand<br/>Shared"]
        Context["Context<br/>Optional"]
    end
    
    Parent -->|via Props| QC
    Parent -->|via Props| OB
    Parent -->|via Props| RC
    
    QC -->|update via| Events
    OB -->|update via| Events
    RC -->|update via| Events
    
    Events -->|setState| Parent
    
    Parent -->|read| StoreState
    QC -->|read| StoreState
    OB -->|read/write| StoreState
    RC -->|read| StoreState
    
    Store -->|manages| Sharing
    Store -.->|broadcast| Children

    style Parent fill:#e1f5ff
    style Children fill:#c8e6c9
    style Sharing fill:#fff9c4
```

---

## 12. Dependency Flow

External dependencies and their relationships.

```mermaid
graph TB
    App["Zali Application"]
    
    subgraph BlockchainStack["Blockchain Stack"]
        Wagmi["Wagmi<br/>Web3 abstraction"]
        Viem["Viem<br/>Eth library"]
        AppKit["AppKit<br/>Wallet connect"]
    end
    
    subgraph FrontendStack["Frontend Stack"]
        React["React 18<br/>UI framework"]
        NextJS["Next.js<br/>SSR & routing"]
        TailwindCSS["Tailwind CSS<br/>Styling"]
    end
    
    subgraph StateManagement["State Management"]
        Zustand["Zustand<br/>State store"]
        ReactQuery["React Query<br/>Cache"]
    end
    
    subgraph UILibraries["UI Libraries"]
        RadixUI["Radix UI<br/>Components"]
        Heroicons["Heroicons<br/>Icons"]
    end
    
    subgraph Utilities["Utilities"]
        Ethers["ethers.js<br/>Contract ABI"]
        Zod["Zod<br/>Validation"]
    end
    
    App --> BlockchainStack
    App --> FrontendStack
    App --> StateManagement
    App --> UILibraries
    App --> Utilities
    
    Wagmi --> Viem
    Wagmi --> AppKit
    
    NextJS --> React
    React --> TailwindCSS
    
    Zustand --> ReactQuery
    
    RadixUI --> Heroicons

    style App fill:#ffe0b2
    style BlockchainStack fill:#e8f5e9
    style FrontendStack fill:#e1f5ff
    style StateManagement fill:#f3e5f5
    style UILibraries fill:#fce4ec
    style Utilities fill:#fff3e0
```

---

## Key Architectural Decisions

### 1. **Zustand for State Management**
- ✅ Lightweight and simple
- ✅ No boilerplate
- ✅ Built-in TypeScript support
- ✅ Easy to persist to localStorage

### 2. **Wagmi for Web3 Integration**
- ✅ React hooks for contract interaction
- ✅ Automatic wallet connection management
- ✅ Built-in caching with TanStack Query
- ✅ TypeScript support

### 3. **Next.js App Router**
- ✅ Server components by default (performance)
- ✅ Built-in routing and middleware
- ✅ API routes for backend
- ✅ Image optimization

### 4. **Error Boundaries Strategy**
- ✅ Granular error boundaries per concern
- ✅ Graceful degradation
- ✅ User-friendly error messages
- ✅ Easy to test and maintain

### 5. **Component Hierarchy**
- ✅ Flat component structure where possible
- ✅ Shared components at top level
- ✅ Page-specific components in route folders
- ✅ Easy to refactor and reuse

---

## Data Flow Summary

```
User Action
    ↓
React Component
    ↓
Zustand Store (local state)
    ↓
Wagmi Hook (Web3 interaction)
    ↓
Smart Contract (blockchain)
    ↓
Event Emission
    ↓
Event Listener (frontend)
    ↓
Update Store
    ↓
Component Re-render
    ↓
UI Update
```

---

## Performance Considerations

### Frontend Optimization
- React Query caching prevents duplicate requests
- Zustand persistence reduces refetching
- Next.js image optimization for assets
- Code splitting at route level

### Blockchain Optimization
- Batch read operations where possible
- Minimal state writes
- Gas-efficient contract design
- Event-driven updates

### Network Optimization
- RPC call batching
- Connection pooling
- Request deduplication
- Fallback RPC endpoints

---

## Security Considerations

### Smart Contract Level
- Access control (Ownable)
- SafeERC20 for token transfers
- Input validation
- Reentrancy protection (inherent)

### Frontend Level
- Signature verification
- Input sanitization
- XSS prevention (React escaping)
- CSRF tokens (for API routes)

### Wallet Integration
- AppKit manages secure connections
- Private key never exposed to frontend
- Signature-based authentication
- Hardware wallet support

---

## Testing Architecture

```mermaid
graph TB
    subgraph UnitTests["Unit Tests"]
        CompTests["Component Tests<br/>Jest + React Testing Library"]
        UtilTests["Utility Tests<br/>Jest"]
        SliceTests["Slice Tests<br/>Zustand logic"]
    end
    
    subgraph ContractTests["Contract Tests"]
        FoundryTests["Foundry Tests<br/>Solidity"]
        IntegrationTests["Integration Tests<br/>Full flow"]
    end
    
    subgraph E2ETests["E2E Tests"]
        PlayflowE2E["Complete Gameplay<br/>Playwright"]
        AuthE2E["Auth Flow<br/>Playwright"]
    end
    
    UnitTests -->|run in CI| CI["GitHub Actions"]
    ContractTests -->|run in CI| CI
    E2ETests -->|run in CI| CI
    
    CI -->|on main| Mainnet["Deploy to Mainnet"]

    style UnitTests fill:#c8e6c9
    style ContractTests fill:#e8f5e9
    style E2ETests fill:#ffccbc
    style CI fill:#fff9c4
```

---

## Deployment Architecture

```mermaid
graph LR
    Dev["Development<br/>Local network"]
    Test["Testing<br/>Testnet"]
    Staging["Staging<br/>Base Testnet"]
    Prod["Production<br/>Base Mainnet"]
    
    Dev -->|merge PR| Test
    Test -->|release tag| Staging
    Staging -->|approval| Prod
    
    Style Dev fill:#e1f5ff
    Style Test fill:#fff9c4
    Style Staging fill:#ffccbc
    Style Prod fill:#c8e6c9
```

---

## Related Documentation

- [VERSION_COMPARISON.md](VERSION_COMPARISON.md) - Feature comparison
- [SIMPLE_TRIVIA_GAME_SPEC.md](contracts/SIMPLE_TRIVIA_GAME_SPEC.md) - Contract API
- [INTEGRATION_EXAMPLES.md](INTEGRATION_EXAMPLES.md) - Code examples
- [README.md](README.md) - Project overview

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

Keep these diagrams updated as the architecture evolves!
