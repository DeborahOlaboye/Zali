import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  QuestionAdded as QuestionAddedEvent,
  AnswerSubmitted as AnswerSubmittedEvent
} from "../generated/SimpleTriviaGame/SimpleTriviaGame";
import { Player, Question, Answer, GlobalStats } from "../generated/schema";

const GLOBAL_STATS_ID = "global";

export function handleQuestionAdded(event: QuestionAddedEvent): void {
  let question = new Question(event.params.questionId.toString());

  question.questionId = event.params.questionId;
  question.questionText = event.params.questionText;
  question.rewardAmount = event.params.reward;
  question.createdAt = event.block.timestamp;
  question.createdAtBlock = event.block.number;
  question.totalAnswers = BigInt.fromI32(0);
  question.correctAnswers = BigInt.fromI32(0);

  question.save();

  let stats = getOrCreateGlobalStats();
  stats.totalQuestions = stats.totalQuestions.plus(BigInt.fromI32(1));
  stats.save();
}
