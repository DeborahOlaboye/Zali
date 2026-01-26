# Data Flow & Deployment Architecture

Comprehensive data flow diagrams and deployment architecture for the Zali application.

---

## 1. Complete User Flow Diagram

```mermaid
graph TD
    Start["🟢 START:<br/>User visits app"]
    
    Connect["🔗 Connect Wallet"]
    SignMessage["📝 Sign message<br/>(Authentication)"]
    
    NavMenu["📍 Navigate to<br/>Play page"]
    
    ViewQuestion["👀 View Question"]
    SelectAnswer["✓ Select Answer"]
    SubmitTx["📤 Submit<br/>Transaction"]
    
    WalletApprove["👛 Wallet approves<br/>transaction"]
    BlockchainExec["⛓️ Contract<br/>executes"]
    
    CheckAnswer["🔍 Check if<br/>correct"]
    
    subgraph Correct["✅ Answer Correct"]
        TransferReward["💰 Transfer USDC<br/>reward"]
        UpdateScore["📊 Increment<br/>user score"]
        ShowSuccess["✨ Show success<br/>message"]
    end
    
    subgraph Incorrect["❌ Answer Incorrect"]
        ShowFail["😕 Show failure<br/>message"]
    end
    
    EventEmit["📢 Contract emits<br/>AnswerSubmitted"]
    FrontendUpdate["🔄 Frontend<br/>updates UI"]
    
    NextAction["⚡ User can:<br/>Next question or<br/>View profile"]
    
    Start --> Connect
    Connect --> SignMessage
    SignMessage -->|User authenticated| NavMenu
    
    NavMenu --> ViewQuestion
    ViewQuestion --> SelectAnswer
    SelectAnswer --> SubmitTx
    
    SubmitTx --> WalletApprove
    WalletApprove --> BlockchainExec
    BlockchainExec --> CheckAnswer
    
    CheckAnswer -->|Correct| Correct
    CheckAnswer -->|Incorrect| Incorrect
    
    TransferReward --> UpdateScore
    UpdateScore --> ShowSuccess
    ShowSuccess --> EventEmit
    
    ShowFail --> EventEmit
    
    EventEmit --> FrontendUpdate
    FrontendUpdate --> NextAction

    style Start fill:#c8e6c9
    style Connect fill:#fff9c4
    style Correct fill:#c8e6c9
    style Incorrect fill:#ffccbc
    style NextAction fill:#f3e5f5
```

---

## 2. Transaction Lifecycle

```mermaid
sequenceDiagram
    participant User as User<br/>Wallet
    participant UI as Frontend<br/>React
    participant Wagmi as Wagmi<br/>Web3 SDK
    participant Node as RPC Node
    participant Contract as Contract
    participant USDC as USDC Token
    participant Blockchain as Blockchain<br/>Base Network
    
    User->>UI: User selects answer
    UI->>UI: Update UI (loading state)
    UI->>Wagmi: Call submitAnswer hook
    Wagmi->>Node: Simulate transaction
    Node->>Contract: Call submitAnswer
    Contract->>USDC: Check balance (if correct)
    USDC-->>Node: Return balance
    Node-->>Wagmi: Return simulation result
    
    Wagmi->>User: Request signature
    User->>Wagmi: Approve & sign
    
    Wagmi->>Node: Send transaction
    Node->>Blockchain: Add to mempool
    Blockchain->>Blockchain: Mine transaction
    
    Blockchain->>Contract: Execute submitAnswer
    Contract->>Contract: Verify answer
    alt Answer Correct
        Contract->>USDC: Transfer reward
        USDC->>Blockchain: Update balance
    end
    Contract->>Blockchain: Update score mapping
    Contract->>Contract: Emit AnswerSubmitted
    Blockchain-->>Node: Transaction confirmed
    
    Node-->>Wagmi: Receipt with event logs
    Wagmi->>UI: Return receipt
    UI->>UI: Parse event
    UI->>UI: Update store
    UI->>UI: Render new state
    UI-->>User: Show result to user
```

---

## 3. State Synchronization Flow

```mermaid
graph TB
    subgraph UserAction["User Action"]
        Action["User interacts<br/>with UI"]
    end
    
    subgraph FrontendState["Frontend State"]
        UIComponent["React Component"]
        ZustandStore["Zustand Store"]
        LocalStorage["localStorage"]
    end
    
    subgraph BlockchainState["Blockchain State"]
        SmartContract["Contract State"]
        Mapping["Mappings:<br/>questions,<br/>userScores"]
    end
    
    subgraph EventSync["Event Synchronization"]
        EventListener["Event Listener"]
        EventCallback["Callback Handler"]
        StateUpdate["Update Store"]
    end
    
    subgraph DataSource["Data Sources"]
        RpcRead["RPC Read Call"]
        ReactQuery["React Query<br/>Cache"]
        Cache["Client Cache"]
    end
    
    Action -->|setState| UIComponent
    UIComponent -->|dispatch| ZustandStore
    ZustandStore -->|write| LocalStorage
    ZustandStore -->|trigger| SmartContract
    
    SmartContract -->|execute| Mapping
    Mapping -->|emit| EventSync
    
    EventListener -->|listen for| SmartContract
    EventListener -->|trigger| EventCallback
    EventCallback -->|update| StateUpdate
    StateUpdate -->|update| ZustandStore
    ZustandStore -->|notify| UIComponent
    
    UIComponent -->|query| ReactQuery
    ReactQuery -->|check| Cache
    Cache -->|miss| RpcRead
    RpcRead -->|call| SmartContract

    style UserAction fill:#e1f5ff
    style FrontendState fill:#f3e5f5
    style BlockchainState fill:#e8f5e9
    style EventSync fill:#ffe0b2
    style DataSource fill:#fff9c4
```

---

## 4. Data Request Patterns

```mermaid
graph TB
    subgraph Pattern1["Pattern 1: Read-Only Query"]
        direction LR
        UserRequests1["User needs<br/>data"]
        CheckCache1["Check cache"]
        IsCached1{"Cached?"}
        UseCached["Use cached<br/>data"]
        QueryRPC["Query RPC<br/>node"]
        CacheResult["Cache result<br/>for next 5min"]
        ReturnData1["Return data<br/>to UI"]
    end
    
    subgraph Pattern2["Pattern 2: State-Modifying"]
        direction LR
        UserAction2["User<br/>takes action"]
        ValidateInput["Validate<br/>input"]
        EstimateGas["Estimate<br/>gas"]
        RequestSig["Request wallet<br/>signature"]
        SendTx["Send<br/>transaction"]
        WaitConfirm["Wait for<br/>confirmation"]
        ParseEvents["Parse events"]
        UpdateState["Update local<br/>state"]
    end
    
    Pattern1 --> Flow1["Read Flow"]
    Pattern2 --> Flow2["Write Flow"]
    
    UserRequests1 --> CheckCache1
    CheckCache1 --> IsCached1
    IsCached1 -->|yes| UseCached
    IsCached1 -->|no| QueryRPC
    UseCached --> ReturnData1
    QueryRPC --> CacheResult
    CacheResult --> ReturnData1
    
    UserAction2 --> ValidateInput
    ValidateInput --> EstimateGas
    EstimateGas --> RequestSig
    RequestSig --> SendTx
    SendTx --> WaitConfirm
    WaitConfirm --> ParseEvents
    ParseEvents --> UpdateState

    style Pattern1 fill:#c8e6c9
    style Pattern2 fill:#fff9c4
    style Flow1 fill:#e8f5e9
    style Flow2 fill:#ffccbc
```

---

## 5. Error Recovery Flow

```mermaid
graph TB
    subgraph ErrorTypes["Error Types"]
        NetworkErr["Network Error<br/>RPC failure"]
        UserReject["User Rejection<br/>Wallet cancel"]
        ValidErr["Validation Error<br/>Invalid input"]
        ContractErr["Contract Error<br/>Revert"]
        GasErr["Gas Error<br/>Out of gas"]
    end
    
    subgraph Detection["Error Detection"]
        CatchErr["Catch error<br/>from try-catch"]
        ClassifyErr["Classify error<br/>type"]
        FindHandler["Find error<br/>handler"]
    end
    
    subgraph Recovery["Recovery Actions"]
        RetryErr["Retry operation"]
        ShowErr["Show user<br/>message"]
        LogErr["Log error<br/>to service"]
        SuggestFix["Suggest fix<br/>to user"]
    end
    
    subgraph Outcome["Outcome"]
        Success["✅ Recovered"]
        Fallback["⚠️ Fallback UI"]
        Manual["🆘 Manual<br/>intervention"]
    end
    
    ErrorTypes --> Detection
    Detection --> Recovery
    Recovery --> Outcome
    
    NetworkErr -->|automatic| RetryErr
    UserReject -->|manual| ShowErr
    ValidErr -->|automatic| SuggestFix
    ContractErr -->|display| ShowErr
    GasErr -->|suggest| SuggestFix
    
    RetryErr -->|success| Success
    RetryErr -->|fail| LogErr
    ShowErr --> Manual
    SuggestFix --> UserChoice["User tries again"]

    style ErrorTypes fill:#ffebee
    style Detection fill:#ffccbc
    style Recovery fill:#fff9c4
    style Outcome fill:#c8e6c9
```

---

## 6. Deployment Architecture - Development

```mermaid
graph TB
    subgraph LocalDev["Local Development"]
        direction LR
        LocalNode["Local Node<br/>Hardhat/Anvil"]
        LocalContracts["Contracts<br/>Local copy"]
        LocalFrontend["Frontend<br/>localhost:3000"]
    end
    
    subgraph BaseTestnet["Base Testnet"]
        direction LR
        TestRPC["Base Testnet<br/>RPC"]
        TestContracts["Test Contracts<br/>Deployed"]
        TestFaucet["Test Faucet<br/>Free USDC"]
    end
    
    subgraph Dev["Dev Environment"]
        TestFrontend["Frontend<br/>dev.example.com"]
        TestAnalytics["Analytics<br/>Separate"]
    end
    
    subgraph Staging["Staging Environment"]
        StagingRPC["Base Testnet<br/>RPC"]
        StagingContracts["Contracts<br/>Test version"]
        StagingFrontend["Frontend<br/>staging.example.com"]
    end
    
    Developer["👨‍💻 Developer"]
    CI["GitHub Actions<br/>CI/CD"]
    
    Developer -->|code| LocalDev
    LocalDev -->|test| LocalNode
    LocalDev -->|verify| LocalContracts
    
    Developer -->|push to git| CI
    CI -->|run tests| BaseTestnet
    CI -->|build| TestFrontend
    
    CI -->|release branch| Staging
    Staging -->|manual test| StagingFrontend
    
    style LocalDev fill:#c8e6c9
    style BaseTestnet fill:#fff9c4
    style Dev fill:#f3e5f5
    style Staging fill:#ffccbc
```

---

## 7. Production Deployment

```mermaid
graph TB
    subgraph Production["🚀 Production"]
        direction TB
        BaseMainnet["Base Mainnet<br/>Network"]
        ProdContract["SimpleTriviaGame<br/>v1.0<br/>0x7409Cbcb..."]
        USDC["USDC Token<br/>0x833589fC..."]
        
        ProdFrontend["Frontend<br/>app.zali.example"]
        CDN["CDN<br/>Cloudflare"]
        DNS["DNS<br/>Domain"]
    end
    
    subgraph Monitoring["📊 Monitoring"]
        Logs["Logs<br/>CloudWatch"]
        Analytics["Analytics<br/>Google Analytics"]
        Alerts["Alerts<br/>PagerDuty"]
    end
    
    subgraph Backup["🔒 Backup & Security"]
        IPFS["IPFS<br/>Data storage"]
        Backup["Database<br/>Backup"]
        Security["Security<br/>Audits"]
    end
    
    Users["👥 Users"]
    
    Users -->|visit| DNS
    DNS -->|resolve| CDN
    CDN -->|serve| ProdFrontend
    ProdFrontend -->|interact| ProdContract
    ProdContract -->|transfer| USDC
    ProdContract -->|on| BaseMainnet
    
    BaseMainnet -->|emit events| Logs
    ProdFrontend -->|track| Analytics
    Logs -->|alert on error| Alerts
    
    ProdFrontend -->|store| IPFS
    BaseMainnet -->|data to| Backup
    ProdContract -->|audited| Security

    style Production fill:#c8e6c9
    style Monitoring fill:#fff9c4
    style Backup fill:#ffccbc
```

---

## 8. CI/CD Pipeline

```mermaid
graph LR
    Developer["👨‍💻 Developer<br/>Push to GitHub"]
    
    GitHub["GitHub<br/>Repository"]
    
    Trigger["GitHub Actions<br/>Triggered"]
    
    subgraph Tests["Testing Stage"]
        ContractTests["Contract Tests<br/>Foundry"]
        LintTests["Lint Tests<br/>ESLint"]
        TypeTests["Type Tests<br/>TypeScript"]
        E2ETests["E2E Tests<br/>Playwright"]
    end
    
    Results["✅ All Pass?"]
    
    Fail["❌ Build Failed<br/>Notify Developer"]
    
    Pass["✅ Build Passed"]
    
    subgraph Build["Build Stage"]
        BuildContracts["Build Contracts<br/>ABI generation"]
        BuildFrontend["Build Frontend<br/>Next.js"]
    end
    
    Artifacts["📦 Build Artifacts<br/>Ready"]
    
    Deploy["🚀 Deploy to<br/>Staging"]
    
    Verify["🔍 Verify<br/>Deployment"]
    
    Ready["✨ Ready for<br/>Production"]
    
    Developer --> GitHub
    GitHub -->|on push| Trigger
    
    Trigger --> Tests
    Tests --> Results
    Results -->|failed| Fail
    Results -->|passed| Pass
    Pass --> Build
    Build --> Artifacts
    Artifacts --> Deploy
    Deploy --> Verify
    Verify --> Ready

    style Developer fill:#e1f5ff
    style Tests fill:#c8e6c9
    style Build fill:#fff9c4
    style Fail fill:#ffebee
    style Ready fill:#a5d6a7
```

---

## 9. Frontend Data Fetching Architecture

```mermaid
graph TB
    Component["React Component<br/>needs data"]
    
    Hook["useQuery Hook<br/>React Query"]
    
    CacheCheck["Check TanStack<br/>Query Cache"]
    
    IsCached{"In<br/>cache?"}
    
    Cached["Return cached<br/>data"]
    
    NoCache["Call Service"]
    
    Service["Service Function<br/>e.g. getQuestion()"]
    
    Web3Call["Web3 Call<br/>Wagmi hook"]
    
    RPC["RPC Node<br/>Base Network"]
    
    Contract["Smart<br/>Contract"]
    
    Result["Parse result"]
    
    CacheStore["Store in<br/>React Query cache"]
    
    Return["Return data<br/>to component"]
    
    Component --> Hook
    Hook --> CacheCheck
    CacheCheck --> IsCached
    
    IsCached -->|yes| Cached
    IsCached -->|no| NoCache
    
    NoCache --> Service
    Service --> Web3Call
    Web3Call --> RPC
    RPC --> Contract
    Contract -->|returns data| Result
    Result --> CacheStore
    CacheStore --> Return
    
    Cached --> Return

    style Component fill:#e1f5ff
    style Hook fill:#f3e5f5
    style Service fill:#c8e6c9
    style Web3Call fill:#fff9c4
    style Contract fill:#e8f5e9
    style Return fill:#a5d6a7
```

---

## 10. Real-Time Event Subscriptions

```mermaid
graph TB
    ContractEvents["Smart Contract<br/>Events"]
    
    EventListener["Event Listener<br/>Web3.js"]
    
    Filter["Event Filter<br/>Watch for<br/>specific event"]
    
    EventFires["Event fires<br/>on blockchain"]
    
    ListenerCatch["Listener detects<br/>new event"]
    
    ParseEvent["Parse event<br/>data"]
    
    Callback["Trigger callback<br/>function"]
    
    UpdateStore["Update<br/>Zustand store"]
    
    Rerender["Component<br/>re-renders"]
    
    UIUpdate["UI shows<br/>new data"]
    
    User["User sees<br/>update"]
    
    ContractEvents -->|emit| EventFires
    EventListener --> Filter
    Filter -->|matches| EventFires
    EventFires --> ListenerCatch
    ListenerCatch --> ParseEvent
    ParseEvent --> Callback
    Callback --> UpdateStore
    UpdateStore -->|notify| Rerender
    Rerender --> UIUpdate
    UIUpdate --> User

    style ContractEvents fill:#e8f5e9
    style EventListener fill:#fff9c4
    style UpdateStore fill:#f3e5f5
    style User fill:#c8e6c9
```

---

## 11. Error Boundary Strategy

```mermaid
graph TB
    RootErrorBoundary["RootErrorBoundary<br/>Catches all errors"]
    
    L1["Level 1: Wallet Errors"]
    L2["Level 2: Query Errors"]
    L3["Level 3: Contract Errors"]
    L4A["Level 4a: Transaction Errors"]
    L4B["Level 4b: Form Errors"]
    L4C["Level 4c: Component Errors"]
    
    RootErrorBoundary --> L1
    L1 --> L2
    L2 --> L3
    L3 --> L4A
    L3 --> L4B
    L3 --> L4C
    
    L1 -->|catches| WalletErr["Wallet rejected<br/>User not connected"]
    L2 -->|catches| QueryErr["Query failed<br/>Network error"]
    L3 -->|catches| ContractErr["Contract revert<br/>Invalid input"]
    L4A -->|catches| TxErr["Transaction failed<br/>Gas error"]
    L4B -->|catches| FormErr["Form invalid<br/>Validation error"]
    L4C -->|catches| ComponentErr["Component crash<br/>Rendering error"]
    
    L1 -->|fallback| FallbackL1["Show wallet<br/>connection UI"]
    L2 -->|fallback| FallbackL2["Show retry<br/>button"]
    L3 -->|fallback| FallbackL3["Show error<br/>message"]
    L4A -->|fallback| FallbackL4A["Show transaction<br/>status"]
    L4B -->|fallback| FallbackL4B["Show form<br/>error"]
    L4C -->|fallback| FallbackL4C["Show component<br/>error"]

    style RootErrorBoundary fill:#ffe0b2
    style L1 fill:#ffccbc
    style L2 fill:#ffccbc
    style L3 fill:#ffccbc
    style L4A fill:#ffebee
    style L4B fill:#ffebee
    style L4C fill:#ffebee
```

---

## 12. Performance Optimization Flows

```mermaid
graph TB
    subgraph Optimization["Performance Optimizations"]
        direction TB
        
        CachingOpt["Caching Layer<br/>React Query"]
        BatchOpt["Batch Requests<br/>Multiple calls"]
        MemoOpt["Memoization<br/>React.memo"]
        LazyOpt["Code Splitting<br/>Dynamic imports"]
        ImageOpt["Image Optimization<br/>Next.js Image"]
    end
    
    subgraph Metrics["Key Metrics"]
        direction TB
        FCP["First Contentful Paint"]
        LCP["Largest Contentful Paint"]
        CLS["Cumulative Layout Shift"]
        TTI["Time to Interactive"]
    end
    
    subgraph Monitoring["Monitoring"]
        direction TB
        Lighthouse["Lighthouse scores"]
        WebVitals["Web Vitals"]
        APM["Application Performance<br/>Monitoring"]
    end
    
    Optimization --> Metrics
    Metrics --> Monitoring
    
    CachingOpt -->|improves| LCP
    CachingOpt -->|reduces| TTI
    
    BatchOpt -->|fewer| NetworkRequests["Network requests"]
    MemoOpt -->|reduces| ReRenders["Component re-renders"]
    LazyOpt -->|improves| FCP
    ImageOpt -->|improves| LCP

    style Optimization fill:#c8e6c9
    style Metrics fill:#fff9c4
    style Monitoring fill:#ffccbc
```

---

## 13. State Persistence Strategy

```mermaid
graph TB
    subgraph SessionData["Session Data"]
        CurrentQuestion["Current Question"]
        SelectedAnswer["Selected Answer"]
        LoadingState["Loading State"]
        Errors["Current Errors"]
    end
    
    subgraph PersistentData["Persistent Data"]
        UserProfile["User Profile"]
        Theme["Theme Preference"]
        Cache["API Cache"]
    end
    
    subgraph Storage["Storage Options"]
        Memory["Memory<br/>(Session only)"]
        LocalStorage["LocalStorage<br/>(Browser)"]
        SessionStorage["SessionStorage<br/>(Tab only)"]
        IndexedDB["IndexedDB<br/>(Large data)"]
    end
    
    SessionData -->|no save| Memory
    PersistentData -->|save to| LocalStorage
    PersistentData -->|fallback| SessionStorage
    Cache -->|large data| IndexedDB
    
    LocalStorage -->|restore on| PageLoad["Page load"]
    Memory -->|cleared on| Refresh["Page refresh"]
    IndexedDB -->|persist across| Sessions["Browser sessions"]

    style SessionData fill:#fff9c4
    style PersistentData fill:#c8e6c9
    style Storage fill:#f3e5f5
    style PageLoad fill:#e8f5e9
```

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

See [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md) for system-level architecture.
