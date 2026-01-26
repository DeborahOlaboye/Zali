# SimpleTriviaGame Integration Examples

This document provides practical code examples for integrating SimpleTriviaGame into your frontend.

## TypeScript/React Integration

### 1. Contract Setup

```typescript
import { useContract, useContractRead } from 'wagmi';
import SimpleTriviaGameABI from './contracts/SimpleTriviaGame.json';

const CONTRACT_ADDRESS = '0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d';

// Initialize contract
const { data: contract } = useContract({
  address: CONTRACT_ADDRESS,
  abi: SimpleTriviaGameABI,
});
```

### 2. Load Questions

```typescript
import { useEffect, useState } from 'react';

interface Question {
  questionText: string;
  options: string[];
  correctOption: number;
  rewardAmount: bigint;
  isActive: boolean;
  category: number;
  difficulty: number;
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: contract } = useContract({ /* ... */ });

  useEffect(() => {
    const loadQuestions = async () => {
      if (!contract) return;
      
      const questions = [];
      const totalQuestions = await contract.questionId();
      
      for (let i = 1; i <= Number(totalQuestions); i++) {
        try {
          const question = await contract.getQuestion(i);
          if (question.isActive) {
            questions.push(question);
          }
        } catch (error) {
          console.error(`Error loading question ${i}:`, error);
        }
      }
      
      setQuestions(questions);
      setLoading(false);
    };
    
    loadQuestions();
  }, [contract]);
  
  return { questions, loading };
}
```

### 3. Display Question

```typescript
interface QuestionCardProps {
  question: Question;
  onSelectAnswer: (selectedIndex: number) => void;
  isLoading?: boolean;
}

export function QuestionCard({
  question,
  onSelectAnswer,
  isLoading
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <h2 className="question-text">{question.questionText}</h2>
      
      <div className="difficulty-badge">
        {['Easy', 'Medium', 'Hard'][question.difficulty]}
      </div>
      
      <div className="reward-amount">
        Reward: {formatUSDC(question.rewardAmount)}
      </div>
      
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            disabled={isLoading}
            className="option-button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatUSDC(amount: bigint): string {
  // USDC has 6 decimals
  return (Number(amount) / 1e6).toFixed(2) + ' USDC';
}
```

### 4. Check Answer

```typescript
export function checkAnswer(
  userAnswer: number,
  correctAnswer: number
): boolean {
  return userAnswer === correctAnswer;
}

export function submitAnswer(
  questionId: number,
  userAnswer: number,
  question: Question,
  userAddress: string
) {
  const isCorrect = checkAnswer(userAnswer, question.correctOption);
  
  // Emit or log event
  console.log({
    questionId,
    userAnswer,
    isCorrect,
    rewardAmount: isCorrect ? question.rewardAmount : 0n,
    user: userAddress,
    timestamp: new Date(),
  });
  
  // Update score on contract (if needed)
  // Note: SimpleTriviaGame tracks scores internally
  
  return {
    isCorrect,
    reward: isCorrect ? question.rewardAmount : 0n,
  };
}
```

### 5. Track User Score

```typescript
export function useUserScore(userAddress?: string) {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: contract } = useContract({ /* ... */ });

  useEffect(() => {
    const loadScore = async () => {
      if (!contract || !userAddress) return;
      
      try {
        const userScore = await contract.getUserScore(userAddress);
        setScore(Number(userScore));
      } catch (error) {
        console.error('Error loading user score:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadScore();
  }, [contract, userAddress]);
  
  return { score, loading };
}
```

### 6. Listen to Events

```typescript
export function useTrivia GameEvents() {
  useEffect(() => {
    const { data: contract } = useContract({ /* ... */ });
    
    if (!contract) return;
    
    // Listen for new questions
    const unsubscribeQuestionAdded = contract.on(
      'QuestionAdded',
      (questionId, text, reward) => {
        console.log(`New question #${questionId}: ${text}`);
        // Refresh question list
      }
    );
    
    // Listen for answers
    const unsubscribeAnswerSubmitted = contract.on(
      'AnswerSubmitted',
      (user, questionId, isCorrect, reward) => {
        console.log(`${user} answered question ${questionId}: ${isCorrect}`);
        // Update UI
      }
    );
    
    return () => {
      unsubscribeQuestionAdded?.();
      unsubscribeAnswerSubmitted?.();
    };
  }, []);
}
```

## React Component Example

```typescript
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useQuestions, useUserScore, submitAnswer } from './hooks';

export function TriviaGame() {
  const { address } = useAccount();
  const { questions, loading: questionsLoading } = useQuestions();
  const { score, loading: scoreLoading } = useUserScore(address);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    reward: bigint;
  } | null>(null);

  if (!address) {
    return <div>Please connect your wallet</div>;
  }

  if (questionsLoading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No active questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = async (selectedIndex: number) => {
    const result = submitAnswer(
      currentQuestionIndex + 1,
      selectedIndex,
      currentQuestion,
      address
    );
    
    setResult(result);
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setResult(null);
    } else {
      // Game complete
      alert(`Game complete! Your score: ${score}`);
    }
  };

  return (
    <div className="trivia-game">
      <div className="header">
        <h1>Zali Trivia</h1>
        <div className="stats">
          <span>Score: {score}</span>
          <span>Question: {currentQuestionIndex + 1}/{questions.length}</span>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        onSelectAnswer={handleSelectAnswer}
        isLoading={answered}
      />

      {answered && result && (
        <div className={`result ${result.isCorrect ? 'correct' : 'incorrect'}`}>
          <p>{result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}</p>
          {result.isCorrect && (
            <p>+{formatUSDC(result.reward)}</p>
          )}
          <button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1
              ? 'Next Question'
              : 'Complete Game'}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Vue 3 Example

```vue
<template>
  <div class="trivia-game">
    <div v-if="!address">Please connect your wallet</div>
    <div v-else-if="loading">Loading questions...</div>
    <div v-else-if="questions.length === 0">No active questions</div>
    <div v-else>
      <h2>{{ currentQuestion.questionText }}</h2>
      
      <div class="score">
        Your Score: {{ score }}
      </div>
      
      <div class="options">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="selectAnswer(index)"
          :disabled="answered"
        >
          {{ option }}
        </button>
      </div>
      
      <div v-if="answered && result" class="result">
        <p v-if="result.isCorrect">✅ Correct! +{{ formatReward(result.reward) }}</p>
        <p v-else>❌ Incorrect</p>
        <button @click="nextQuestion">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useContractRead } from 'wagmi';

const questions = ref([]);
const currentQuestionIndex = ref(0);
const answered = ref(false);
const result = ref(null);
const score = ref(0);
const loading = ref(true);

// Load contract data
onMounted(async () => {
  // Load questions
  // Load user score
  loading.value = false;
});

const selectAnswer = (index: number) => {
  const correct = index === currentQuestion.value.correctOption;
  result.value = {
    isCorrect: correct,
    reward: correct ? currentQuestion.value.rewardAmount : 0n,
  };
  answered.value = true;
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    answered.value = false;
    result.value = null;
  }
};

const currentQuestion = () => questions.value[currentQuestionIndex.value];

const formatReward = (amount: bigint) => {
  return (Number(amount) / 1e6).toFixed(2);
};
</script>
```

## Error Handling

```typescript
export function useContractErrors() {
  const handleError = (error: unknown, context: string) => {
    if (error instanceof Error) {
      console.error(`${context}:`, error.message);
      
      // Parse contract errors
      if (error.message.includes('InvalidOptions')) {
        return 'Question must have 2-4 options';
      }
      if (error.message.includes('InvalidCorrectOption')) {
        return 'Selected correct option is out of range';
      }
      if (error.message.includes('QuestionNotActive')) {
        return 'This question is no longer active';
      }
      if (error.message.includes('InsufficientBalance')) {
        return 'Contract insufficient funds for reward';
      }
    }
    
    return 'An unknown error occurred';
  };
  
  return { handleError };
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react';
import { TriviaGame } from './TriviaGame';

describe('TriviaGame', () => {
  it('loads and displays questions', async () => {
    render(<TriviaGame />);
    // Assert questions loaded
  });
  
  it('correctly identifies right answers', () => {
    const isCorrect = checkAnswer(0, 0);
    expect(isCorrect).toBe(true);
  });
  
  it('formats USDC amounts correctly', () => {
    const amount = BigInt('1000000'); // 1 USDC
    expect(formatUSDC(amount)).toBe('1.00 USDC');
  });
});
```

---

## Common Pitfalls

1. **Forgetting to format USDC amounts** - Always divide by 1e6
2. **Not checking isActive** - Only show active questions
3. **Not handling contract errors** - Use error boundaries
4. **Race conditions** - Use proper state management (Zustand, Redux, etc.)
5. **Not updating on events** - Listen to contract events

---

## Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [SimpleTriviaGame Spec](contracts/SIMPLE_TRIVIA_GAME_SPEC.md)
- [Contract Source](contracts/src/SimpleTriviaGame.sol)

---

**Last Updated:** January 26, 2026
