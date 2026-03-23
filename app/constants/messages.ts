export const PET_MESSAGES = [
  'Have a wonderful day!',
  'I love seeing you two together \uD83D\uDC95',
  "Don't forget to tell them you love them!",
  'You make a beautiful couple!',
  'Sending warm hugs your way~',
  "Today's going to be a great day!",
  'Remember to smile today \uD83D\uDE0A',
  "You're doing amazing!",
  'A little love goes a long way~',
  'Take a moment to appreciate each other!',
  "I'm so happy for you two!",
  'Every day with love is special \u2728',
  'Share a sweet message today!',
  "You're each other's sunshine!",
  'Love grows stronger every day~',
  'Make today a memory worth keeping!',
  'Happiness looks good on you two!',
  "A kind word can make someone's day \uD83D\uDC9B",
  'Cherish every little moment together!',
  "I'm rooting for your love story!",
];

export function getRandomPetMessage(): string {
  return PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)];
}
