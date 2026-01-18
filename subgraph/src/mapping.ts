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

export function handleAnswerSubmitted(event: AnswerSubmittedEvent): void {
  let playerId = event.params.user.toHexString();
  let player = getOrCreatePlayer(event.params.user, event.block.timestamp);

  let answerId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let answer = new Answer(answerId);

  answer.player = playerId;
  answer.question = event.params.questionId.toString();
  answer.questionId = event.params.questionId;
  answer.isCorrect = event.params.isCorrect;
  answer.reward = event.params.reward;
  answer.timestamp = event.block.timestamp;
  answer.blockNumber = event.block.number;
  answer.transactionHash = event.transaction.hash;

  answer.save();

  player.totalAnswers = player.totalAnswers.plus(BigInt.fromI32(1));

  if (event.params.isCorrect) {
    player.correctAnswers = player.correctAnswers.plus(BigInt.fromI32(1));
    player.totalScore = player.totalScore.plus(BigInt.fromI32(1));
    player.totalRewards = player.totalRewards.plus(event.params.reward);
  }

  player.lastPlayedAt = event.block.timestamp;
  player.save();

  let question = Question.load(event.params.questionId.toString());
  if (question != null) {
    question.totalAnswers = question.totalAnswers.plus(BigInt.fromI32(1));
    if (event.params.isCorrect) {
      question.correctAnswers = question.correctAnswers.plus(BigInt.fromI32(1));
    }
    question.save();
  }

  let stats = getOrCreateGlobalStats();
  stats.totalAnswers = stats.totalAnswers.plus(BigInt.fromI32(1));
  if (event.params.isCorrect) {
    stats.totalCorrectAnswers = stats.totalCorrectAnswers.plus(BigInt.fromI32(1));
  }
  stats.totalRewardsDistributed = stats.totalRewardsDistributed.plus(event.params.reward);
  stats.save();
}

function getOrCreatePlayer(address: Bytes, timestamp: BigInt): Player {
  let id = address.toHexString();
  let player = Player.load(id);

  if (player == null) {
    player = new Player(id);
    player.address = address;
    player.totalScore = BigInt.fromI32(0);
    player.correctAnswers = BigInt.fromI32(0);
    player.totalAnswers = BigInt.fromI32(0);
    player.totalRewards = BigInt.fromI32(0);
    player.firstPlayedAt = timestamp;
    player.lastPlayedAt = timestamp;

    let stats = getOrCreateGlobalStats();
    stats.totalPlayers = stats.totalPlayers.plus(BigInt.fromI32(1));
    stats.save();
  }

  return player;
}

function getOrCreateGlobalStats(): GlobalStats {
  let stats = GlobalStats.load(GLOBAL_STATS_ID);

  if (stats == null) {
    stats = new GlobalStats(GLOBAL_STATS_ID);
    stats.totalPlayers = BigInt.fromI32(0);
    stats.totalAnswers = BigInt.fromI32(0);
    stats.totalCorrectAnswers = BigInt.fromI32(0);
    stats.totalRewardsDistributed = BigInt.fromI32(0);
    stats.totalQuestions = BigInt.fromI32(0);
  }

  return stats;
}
