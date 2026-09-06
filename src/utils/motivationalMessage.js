export function getMotivationalMessage(percentage) {
  if (percentage >= 100) return "Perfect score! You're crushing it! 🎯";
  if (percentage >= 80) return 'Great job! Keep up the momentum! 💪';
  if (percentage >= 50) return "Nice effort! A bit more practice and you'll ace it. 📈";
  return 'Keep going — every attempt makes you stronger! 🌱';
}
