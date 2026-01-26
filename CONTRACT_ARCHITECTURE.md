# Smart Contract Architecture & Interactions

Detailed diagrams for smart contract structure, functions, and interactions.

---

## 1. SimpleTriviaGame Contract Structure

```mermaid
graph TB
    Contract["SimpleTriviaGame Contract"]
    
    subgraph Inheritance["Inheritance"]
        Ownable["Ownable<br/>Access control"]
        IERC20["IERC20<br/>Token interface"]
        SafeERC20["SafeERC20<br/>Safe transfers"]
    end
    
    subgraph StateVars["State Variables"]
        immutable_["Immutable"]
        usdcToken["usdcToken<br/>IERC20"]
        mutable["Mutable"]
        questionId["questionId<br/>uint256"]
        questions["questions<br/>mapping"]
        userScores["userScores<br/>mapping"]
    end
    
    subgraph Structs["Data Structures"]
        Question["Question struct<br/>questionText, options,<br/>correctOption, rewardAmount,<br/>isActive, category,<br/>difficulty"]
    end
    
    subgraph Enums["Enumerations"]
        Difficulty["Difficulty enum<br/>Easy, Medium, Hard"]
        Category["Category enum<br/>Celo, DeFi, Web3,<br/>GeneralCrypto, NFTs, DAOs"]
    end
    
    subgraph Errors["Custom Errors"]
        Err1["InvalidTokenAddress"]
        Err2["InvalidOptions"]
        Err3["InvalidCorrectOption"]
        Err4["QuestionNotActive"]
        Err5["InvalidOption"]
        Err6["InsufficientBalance"]
    end
    
    subgraph Functions["Functions"]
        Constructor["constructor"]
        AddQ["addQuestion<br/>onlyOwner"]
        SubmitA["submitAnswer"]
        DeactivateQ["deactivateQuestion<br/>onlyOwner"]
        GetQ["getQuestion"]
        GetScore["getUserScore"]
    end
    
    subgraph Events["Events"]
        QuestionAdded["QuestionAdded"]
        AnswerSubmitted["AnswerSubmitted"]
    end
    
    Contract --> Inheritance
    Contract --> StateVars
    Contract --> Structs
    Contract --> Enums
    Contract --> Errors
    Contract --> Functions
    Contract --> Events
    
    StateVars --> immutable_
    StateVars --> mutable
    immutable_ --> usdcToken
    mutable --> questionId
    mutable --> questions
    mutable --> userScores

    style Contract fill:#e8f5e9
    style Inheritance fill:#c8e6c9
    style StateVars fill:#a5d6a7
    style Structs fill:#81c784
    style Enums fill:#66bb6a
    style Errors fill:#ffccbc
    style Functions fill:#fff9c4
    style Events fill:#ffe0b2
```

---

## 2. Function Call Flow

```mermaid
graph TB
    subgraph ReadOps["Read Operations"]
        direction LR
        GetQuestion["getQuestion<br/>(questionId)"]
        GetScore["getUserScore<br/>(address)"]
        ViewQuestion["viewQuestions<br/>(returns Question[])"]
    end
    
    subgraph WriteOps["Write Operations"]
        direction LR
        AddQuestion["addQuestion<br/>onlyOwner"]
        SubmitAnswer["submitAnswer<br/>payable"]
        Deactivate["deactivateQuestion<br/>onlyOwner"]
        Claim["claimRewards<br/>or direct transfer"]
    end
    
    subgraph Setup["Setup"]
        direction LR
        Constructor["constructor<br/>(tokenAddress)"]
    end
    
    Setup -->|after deploy| ReadOps
    Setup -->|after deploy| WriteOps
    
    AddQuestion -->|creates| Question["Question entry<br/>in mapping"]
    SubmitAnswer -->|updates| Score["User score<br/>mapping"]
    SubmitAnswer -->|triggers| Transfer["USDC transfer<br/>if correct"]
    Deactivate -->|marks| Inactive["Question inactive"]
    
    GetQuestion -->|reads| Question
    GetScore -->|reads| Score

    style ReadOps fill:#fff9c4
    style WriteOps fill:#ffccbc
    style Setup fill:#c8e6c9
    style Question fill:#e8f5e9
    style Score fill:#e8f5e9
    style Transfer fill:#ffe0b2
```

---

## 3. State Modification Timeline

```mermaid
sequenceDiagram
    participant Owner as Contract Owner
    participant Contract as SimpleTriviaGame
    participant Ledger as Blockchain State
    participant USDC as USDC Token
    participant User as User/Player
    
    Owner->>Contract: Constructor(USDCAddress)
    Contract->>Ledger: Initialize questionId = 0
    
    Owner->>Contract: addQuestion(...)
    Contract->>Ledger: questionId++
    Contract->>Ledger: questions[id] = Question
    Contract->>Contract: emit QuestionAdded
    
    User->>Contract: submitAnswer(questionId, option)
    Contract->>Ledger: Read question
    alt Correct Answer
        Contract->>USDC: Transfer reward to user
        USDC->>Ledger: Update balances
        Contract->>Ledger: userScores[user]++
        Contract->>Contract: emit AnswerSubmitted(true)
    else Wrong Answer
        Contract->>Ledger: userScores[user]++
        Contract->>Contract: emit AnswerSubmitted(false)
    end
    
    Owner->>Contract: deactivateQuestion(id)
    Contract->>Ledger: questions[id].isActive = false
```

---

## 4. Access Control Diagram

```mermaid
graph TB
    User["User (Any Address)"]
    Owner["Owner Address"]
    
    subgraph PublicFunctions["Public Functions<br/>Anyone can call"]
        submitAnswer["submitAnswer()"]
        getQuestion["getQuestion()"]
        getUserScore["getUserScore()"]
        viewQuestions["viewQuestions()"]
    end
    
    subgraph OwnerFunctions["Owner Functions<br/>onlyOwner modifier"]
        addQuestion["addQuestion()"]
        deactivateQuestion["deactivateQuestion()"]
        emergencyWithdraw["emergencyWithdraw()<br/>(if exists)"]
    end
    
    User -->|can call| PublicFunctions
    Owner -->|can call| PublicFunctions
    Owner -->|can call| OwnerFunctions
    User -->|cannot call| OwnerFunctions
    
    PublicFunctions -->|modifies| UserScore["userScores mapping"]
    PublicFunctions -->|reads| QuestionData["questions mapping"]
    OwnerFunctions -->|creates| QuestionData
    OwnerFunctions -->|modifies| QuestionData

    style PublicFunctions fill:#c8e6c9
    style OwnerFunctions fill:#ffccbc
    style User fill:#e1f5ff
    style Owner fill:#f3e5f5
```

---

## 5. Data Structure Relationships

```mermaid
graph TB
    subgraph Questions["Questions Mapping"]
        direction LR
        QID["Question ID<br/>uint256 key"]
        QStruct["Question struct<br/>value"]
    end
    
    subgraph Scores["User Scores Mapping"]
        direction LR
        UserAddr["User Address<br/>address key"]
        Score["Score<br/>uint256 value"]
    end
    
    subgraph QuestionData["Question Struct Fields"]
        direction TB
        QText["questionText<br/>string"]
        QOptions["options<br/>string[]"]
        QCorrect["correctOption<br/>uint256"]
        QReward["rewardAmount<br/>uint256"]
        QActive["isActive<br/>bool"]
        QCategory["category<br/>Category enum"]
        QDifficulty["difficulty<br/>Difficulty enum"]
    end
    
    Questions --> QID
    Questions --> QStruct
    Scores --> UserAddr
    Scores --> Score
    
    QStruct --> QuestionData
    
    QCorrect -->|must be| Constraint1["< options.length"]
    QOptions -->|must have| Constraint2["> 1 element"]
    QReward -->|checked in| submitAnswer["submitAnswer function"]

    style Questions fill:#c8e6c9
    style Scores fill:#fff9c4
    style QuestionData fill:#ffccbc
    style Constraint1 fill:#ffebee
    style Constraint2 fill:#ffebee
```

---

## 6. Event Flow Diagram

```mermaid
graph TB
    subgraph QuestionAddedEvent["QuestionAdded Event"]
        QAddedParams["Parameters:<br/>indexed questionId,<br/>questionText,<br/>reward"]
        QAddedWhen["Emitted when:<br/>addQuestion() succeeds"]
        QAddedUsage["Usage:<br/>Index questions<br/>Track events"]
    end
    
    subgraph AnswerSubmittedEvent["AnswerSubmitted Event"]
        ASubParams["Parameters:<br/>indexed user,<br/>indexed questionId,<br/>isCorrect,<br/>reward"]
        ASubWhen["Emitted when:<br/>submitAnswer() completes"]
        ASubUsage["Usage:<br/>Track attempts<br/>Off-chain indexing<br/>Event history"]
    end
    
    QuestionAddedEvent --> QAddedParams
    QuestionAddedEvent --> QAddedWhen
    QuestionAddedEvent --> QAddedUsage
    
    AnswerSubmittedEvent --> ASubParams
    AnswerSubmittedEvent --> ASubWhen
    AnswerSubmittedEvent --> ASubUsage
    
    QAddedUsage -->|enables| Frontend1["Frontend: Show recent Q"]
    ASubUsage -->|enables| Frontend2["Frontend: Update UI"]
    ASubUsage -->|enables| Subgraph["Subgraph: Index data"]

    style QuestionAddedEvent fill:#fff9c4
    style AnswerSubmittedEvent fill:#fff9c4
    style Frontend1 fill:#e1f5ff
    style Frontend2 fill:#e1f5ff
    style Subgraph fill:#ffccbc
```

---

## 7. Gas Optimization Considerations

```mermaid
graph TB
    subgraph Current["Current Implementation"]
        Storage["Storage optimized<br/>Packed structs"]
        Mapping["Mappings for<br/>fast lookup"]
        Immutable["Immutable token<br/>address"]
    end
    
    subgraph Potential["Potential Optimization"]
        Batch["Batch operations<br/>Multiple questions"]
        Caching["Cache frequently<br/>accessed data"]
        Array["Consider array vs<br/>mapping trade-offs"]
    end
    
    subgraph Constraints["Constraints"]
        Readability["Keep code<br/>readable"]
        Security["No security<br/>compromises"]
        Functionality["Maintain all<br/>features"]
    end
    
    Current --> GasCosts["Current Gas Costs<br/>per operation"]
    Potential --> FutureOptimizations["Future improvements<br/>for V2"]
    Constraints --> BestPractices["Follow Solidity<br/>best practices"]
    
    GasCosts -->|Submit Answer| CostPerAnswer["~120k gas<br/>$0.01-0.02 USD"]
    GasCosts -->|Add Question| CostAddQ["~80k gas<br/>$0.008-0.015 USD"]

    style Current fill:#c8e6c9
    style Potential fill:#fff9c4
    style Constraints fill:#ffccbc
    style GasCosts fill:#e8f5e9
```

---

## 8. Error Handling Flow

```mermaid
graph TD
    Start["Function Call"]
    
    Check1{"Is token<br/>address valid?"}
    Err1["InvalidTokenAddress"]
    
    Check2{"Options<br/>length > 1?"}
    Err2["InvalidOptions"]
    
    Check3{"Correct option<br/>< length?"}
    Err3["InvalidCorrectOption"]
    
    Check4{"Question<br/>active?"}
    Err4["QuestionNotActive"]
    
    Check5{"Option<br/>valid?"}
    Err5["InvalidOption"]
    
    Check6{"Balance<br/>sufficient?"}
    Err6["InsufficientBalance"]
    
    Success["Function executes<br/>successfully"]
    
    Start --> Check1
    Check1 -->|NO| Err1
    Check1 -->|YES| Check2
    
    Check2 -->|NO| Err2
    Check2 -->|YES| Check3
    
    Check3 -->|NO| Err3
    Check3 -->|YES| Check4
    
    Check4 -->|NO| Err4
    Check4 -->|YES| Check5
    
    Check5 -->|NO| Err5
    Check5 -->|YES| Check6
    
    Check6 -->|NO| Err6
    Check6 -->|YES| Success
    
    Err1 --> Revert["Transaction reverts"]
    Err2 --> Revert
    Err3 --> Revert
    Err4 --> Revert
    Err5 --> Revert
    Err6 --> Revert

    style Start fill:#e1f5ff
    style Success fill:#c8e6c9
    style Revert fill:#ffccbc
    style Err1 fill:#ffebee
    style Err2 fill:#ffebee
    style Err3 fill:#ffebee
    style Err4 fill:#ffebee
    style Err5 fill:#ffebee
    style Err6 fill:#ffebee
```

---

## 9. Integration Points

```mermaid
graph TB
    SimpleTriviaGame["SimpleTriviaGame<br/>Contract"]
    
    subgraph External["External Contracts"]
        USDC["USDC Token<br/>ERC20"]
        RPC["RPC Endpoint<br/>Node"]
    end
    
    subgraph Testing["Testing"]
        MockVRF["Mock VRF<br/>Testing"]
        Faucet["USDC Faucet<br/>Testnet"]
    end
    
    subgraph Frontend["Frontend Integration"]
        Wagmi["Wagmi<br/>Contract interaction"]
        Hooks["Custom hooks<br/>Read/Write"]
    end
    
    subgraph Indexing["Data Indexing"]
        Events["Contract events"]
        Subgraph["The Graph<br/>Indexing service"]
    end
    
    SimpleTriviaGame -->|reads/writes| USDC
    SimpleTriviaGame -->|deployed on| RPC
    SimpleTriviaGame -->|mock in tests| MockVRF
    SimpleTriviaGame -->|uses in tests| Faucet
    
    SimpleTriviaGame -->|called by| Wagmi
    Wagmi -->|uses| Hooks
    
    SimpleTriviaGame -->|emits| Events
    Events -->|indexed by| Subgraph
    
    style SimpleTriviaGame fill:#e8f5e9
    style External fill:#c8e6c9
    style Testing fill:#fff9c4
    style Frontend fill:#f3e5f5
    style Indexing fill:#ffccbc
```

---

## 10. Contract Upgrade Path (Future)

```mermaid
graph LR
    V1["SimpleTriviaGame<br/>v1.0<br/>(Current)<br/>Base Mainnet"]
    
    arrow1["Upgrade<br/>Q2 2026"]
    
    V2["TriviaGameV2<br/>v2.0<br/>(Planned)<br/>Base Mainnet"]
    
    arrow2["New features<br/>VRF, Leaderboard"]
    
    Features["New Features:<br/>- Chainlink VRF<br/>- Game sessions<br/>- Leaderboards<br/>- Usernames<br/>- Speed bonuses"]
    
    V1 -->|legacy| Coexist["Both contracts<br/>active"]
    V2 -->|new| Coexist
    
    arrow1 --> V2
    V2 --> arrow2
    arrow2 --> Features
    
    Coexist -->|users choose| Choice["Play V1 or V2"]

    style V1 fill:#c8e6c9
    style V2 fill:#fff9c4
    style Features fill:#ffccbc
    style Coexist fill:#f3e5f5
```

---

## 11. Testing Strategy

```mermaid
graph TB
    subgraph UnitTests["Unit Tests"]
        direction LR
        ConstructorTest["Constructor tests"]
        AddQuestionTests["addQuestion tests"]
        SubmitAnswerTests["submitAnswer tests"]
        GetterTests["Getter tests"]
    end
    
    subgraph IntegrationTests["Integration Tests"]
        direction LR
        FullFlow["Complete game flow"]
        MultiUser["Multi-user scenario"]
        EventTests["Event emission"]
    end
    
    subgraph E2ETests["E2E Tests"]
        direction LR
        DeployTest["Deploy to testnet"]
        RealWallet["Real wallet interaction"]
        FrontendTest["Frontend integration"]
    end
    
    subgraph TestTools["Testing Tools"]
        direction LR
        Foundry["Foundry<br/>Smart contract testing"]
        Hardhat["Hardhat<br/>Alternative testing"]
        TestUtils["TestUtils.sol<br/>Helper contracts"]
    end
    
    UnitTests --> TestTools
    IntegrationTests --> TestTools
    E2ETests --> TestTools
    
    UnitTests -->|covers| CovFuncs["Function logic"]
    IntegrationTests -->|covers| CovInteraction["Contract interactions"]
    E2ETests -->|covers| CovRealWorld["Real world scenarios"]

    style UnitTests fill:#c8e6c9
    style IntegrationTests fill:#fff9c4
    style E2ETests fill:#ffccbc
    style TestTools fill:#f3e5f5
```

---

## 12. Security Audit Points

```mermaid
graph TB
    subgraph InputValidation["Input Validation"]
        CheckZeroAddr["Check zero address"]
        CheckArrayLen["Check array length"]
        CheckIndexBounds["Check index bounds"]
        CheckAmount["Check amounts > 0"]
    end
    
    subgraph AccessControl["Access Control"]
        OwnerOnly["onlyOwner modifier"]
        PublicFunctions["Public functions safe"]
        RoleCheck["Role verification"]
    end
    
    subgraph TokenSafety["Token Safety"]
        SafeERC20["Use SafeERC20"]
        TransferCheck["Check transfer return"]
        AllowanceCheck["Check allowance"]
    end
    
    subgraph StateIntegrity["State Integrity"]
        NoReentrancy["No reentrancy risk"]
        StateConsistency["State stays consistent"]
        EventLogging["Events logged"]
    end
    
    subgraph GasLimits["Gas Limits"]
        NoInfiniteLoops["No infinite loops"]
        BoundedArrays["Bounded arrays"]
        EfficientStorage["Efficient storage"]
    end
    
    InputValidation -->|all checked| Status1["✅ Safe"]
    AccessControl -->|properly set| Status2["✅ Safe"]
    TokenSafety -->|properly handled| Status3["✅ Safe"]
    StateIntegrity -->|maintained| Status4["✅ Safe"]
    GasLimits -->|within limits| Status5["✅ Safe"]

    style InputValidation fill:#c8e6c9
    style AccessControl fill:#fff9c4
    style TokenSafety fill:#ffccbc
    style StateIntegrity fill:#f3e5f5
    style GasLimits fill:#c5cae9
    style Status1 fill:#a5d6a7
    style Status2 fill:#a5d6a7
    style Status3 fill:#a5d6a7
    style Status4 fill:#a5d6a7
    style Status5 fill:#a5d6a7
```

---

## Function Specifications Quick Reference

| Function | Access | Params | Returns | Gas |
|----------|--------|--------|---------|-----|
| constructor | - | USDC address | - | ~50k |
| addQuestion | onlyOwner | text, options[], correct, reward, category, difficulty | - | ~80k |
| submitAnswer | public | questionId, selectedOption | - | ~120k |
| deactivateQuestion | onlyOwner | questionId | - | ~20k |
| getQuestion | view | questionId | Question | ~5k |
| getUserScore | view | address | uint256 | ~5k |
| viewQuestions | view | - | Question[] | ~Nk |

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete
