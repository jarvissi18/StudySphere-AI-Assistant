// =====================================================
// Calculate Quiz Score
// =====================================================

export function calculateScore(quiz, selectedAnswers) {

  let score = 0;

  quiz.forEach((question, index) => {

    if (selectedAnswers[index] === question.answer) {

      score++;

    }

  });

  return score;

}

// =====================================================
// Calculate Accuracy
// =====================================================

export function calculateAccuracy(score, totalQuestions) {

  if (totalQuestions === 0) return 0;

  return Math.round((score / totalQuestions) * 100);

}

// =====================================================
// Performance Badge
// =====================================================

export function getPerformanceBadge(accuracy) {

  if (accuracy >= 90) {

    return {
      emoji: "🏆",
      title: "Outstanding!",
      description: "Exceptional performance. Keep it up!",
      gradient: "from-yellow-500 to-orange-500",
    };

  }

  if (accuracy >= 75) {

    return {
      emoji: "🌟",
      title: "Excellent!",
      description: "Very good understanding of the topic.",
      gradient: "from-violet-600 to-indigo-600",
    };

  }

  if (accuracy >= 60) {

    return {
      emoji: "👍",
      title: "Good Job!",
      description: "You're doing well. Practice a little more.",
      gradient: "from-blue-600 to-cyan-600",
    };

  }

  if (accuracy >= 40) {

    return {
      emoji: "📘",
      title: "Needs Improvement",
      description: "Review the concepts and try again.",
      gradient: "from-orange-500 to-red-500",
    };

  }

  return {
    emoji: "📚",
    title: "Keep Practicing",
    description: "Don't worry. Practice makes perfect.",
    gradient: "from-red-600 to-pink-600",
  };

}

// =====================================================
// Correct Answers Count
// =====================================================

export function getCorrectAnswers(quiz, selectedAnswers) {

  return calculateScore(quiz, selectedAnswers);

}

// =====================================================
// Wrong Answers Count
// =====================================================

export function getWrongAnswers(quiz, selectedAnswers) {

  return quiz.length - calculateScore(quiz, selectedAnswers);

}

// =====================================================
// Quiz Statistics
// =====================================================

export function getQuizStatistics(quiz, selectedAnswers) {

  const score = calculateScore(

    quiz,

    selectedAnswers

  );

  const accuracy = calculateAccuracy(

    score,

    quiz.length

  );

  return {

    totalQuestions: quiz.length,

    correctAnswers: score,

    wrongAnswers: quiz.length - score,

    accuracy,

    badge: getPerformanceBadge(accuracy),

  };

}