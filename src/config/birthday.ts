// ============================================================
// ADRIKA UNIVERSE — Central Personalization Configuration
// ============================================================
// Edit this file to personalize the entire birthday experience.
// You do NOT need to modify any other files for basic customization.
// ============================================================

export const birthdayConfig = {
  // ── Recipient ─────────────────────────────────────────────
  recipientName: "Bonu",
  senderName: "Didi", // Your name / how you sign the letter
  birthdayDate: "October 16", // Display-only birthday date string
  // age: 19,  // ← Uncomment and set to show age in the UI

  // ── Birthday Awards ───────────────────────────────────────
  awards: [
    { emoji: "🎭", title: "Professional Trouble Maker", desc: "Award for consistent, inspired chaos" },
    { emoji: "👑", title: "CEO of Being Adorable", desc: "Chief Executive of Cuteness, effective immediately" },
    { emoji: "💅", title: "Certified Drama Queen", desc: "Internationally recognized for dramatic excellence" },
    { emoji: "🌟", title: "World's Most Unreplaceable Sister", desc: "Verified by the universe, no contest" },
    { emoji: "🎬", title: "Main Character of the Year", desc: "For always making life feel like a movie" },
    { emoji: "🔮", title: "Keeper of Chaotic Energy", desc: "For bringing unpredictable magic wherever you go" },
  ],

  // ── Sister Archives — Memory Sections ─────────────────────
  // ── HOW TO ADD YOUR PHOTOS ─────────────────────────────────
  // 1. Place your photo files in: public/images/memories/
  // 2. For each photo, uncomment the imageSrc line below
  // 3. Change placeholder: true  →  placeholder: false
  // That's it! The scrapbook will automatically show your photo.
  // ──────────────────────────────────────────────────────────
  memories: [
    {
      section: "Little Childhood Moments",
      items: [
        {
          id: "mem-1",
          title: "One cute picture before the nonsense begins",
          caption: "The lights are pretty, but someone's clearly stealing the show",
          date: "Kickstarted pujo",
          placeholder: false,
          imageSrc: "/images/memories/01-childhood.jpg",
        },
        {
          id: "mem-2",
          title: "Cutie like monkey",
          caption: "love you loads",
          date: "some random day",
          placeholder: false,
          imageSrc: "/images/memories/02-innocent-years.jpg",
        },
        {
          id: "mem-3",
          title: "cute uss",
          caption: "Not to brag, but look at us",
          date: "trip dayss",
          placeholder: false,
          imageSrc: "/images/memories/03-funny-moment.jpg",
        },
      ],
    },
    {
      section: "The Funniest Memories",
      items: [
        {
          id: "mem-4",
          title: "goal: glowup",
          caption: "got the best glowdown, cant wait for more of these",
          date: "2023 (Probably)",
          placeholder: false,
          imageSrc: "/images/memories/04-sisterhood.jpg",
        },
        {
          id: "mem-5",
          title: "jolly lil sis",
          caption: "be as jolly as you are, and be happy",
          date: "Recently",
          placeholder: false,
          imageSrc: "/images/memories/05-best-adventure.jpg",
        },
      ],
    },
    {
      section: "Our Favourite Moments",
      items: [
        {
          id: "mem-6",
          title: "again pretty uss",
          caption: "the only few good miror selfies we have, cant wait for more",
          date: "Forever",
          placeholder: false,
          imageSrc: "/images/memories/06-favourite-memory.jpg",
        },
        {
          id: "mem-7",
          title: "Our Best Adventure",
          caption: "We should do this again, but maybe with less chaos next time.",
          date: "That One Day",
          placeholder: true,
        },
      ],
    },
    {
      section: "Things We Must Do Together",
      items: [
        {
          id: "mem-8",
          title: "The Bucket List",
          caption: "Things we've talked about doing but somehow never actually done yet.",
          date: "Coming Soon",
          placeholder: true,
        },
      ],
    },
    {
      section: "Little Things I Love About You",
      items: [
        {
          id: "mem-9",
          title: "Your Laugh",
          caption: "The real one, not the polite one. The one you do when something is genuinely funny.",
          date: "Always",
          placeholder: true,
        },
        {
          id: "mem-10",
          title: "Your Ridiculous Confidence",
          caption: "The way you walk into a room like you own it. It's honestly iconic.",
          date: "Every Day",
          placeholder: true,
        },
        {
          id: "mem-11",
          title: "You, When No One Is Looking",
          caption: "The quieter version of you that I feel privileged to know.",
          date: "My Favourite Moments",
          placeholder: true,
        },
      ],
    },
  ],

  // ── Trivia Questions ──────────────────────────────────────
  // These are sample/fictional questions — replace with your own real ones!
  triviaQuestions: [
    {
      question: "What is Bonu's go-to comfort food?",
      options: ["Maggi noodles", "Pizza", "Biryani", "Ice cream"],
      correctIndex: 0,
      funFact: "Classic! Nothing beats a quick bowl of Maggi.",
    },
    {
      question: "What would Bonu most likely be doing at 2 AM?",
      options: ["Sleeping (obviously)", "Watching something on her phone", "Texting someone", "Planning chaos"],
      correctIndex: 1,
      funFact: "The midnight streaming sessions are legendary.",
    },
    {
      question: "Which word best describes Bonu?",
      options: ["Unpredictable", "Dramatic", "Adorable", "All of the above"],
      correctIndex: 3,
      funFact: "The answer was always going to be all of the above.",
    },
    {
      question: "What does Bonu say most often?",
      options: ["Let me sleep", "That's not fair", "Fine, whatever", "You don't understand me"],
      correctIndex: 0,
      funFact: "The eternal plea for just five more minutes.",
    },
    {
      question: "What is Bonu secretly very good at?",
      options: ["Acting innocent", "Getting her way", "Making people smile", "All of the above"],
      correctIndex: 2,
      funFact: "She really does have a gift for it.",
    },
  ],

  // ── Sister vs Sister Challenge ─────────────────────────────
  siblingQuestions: [
    {
      question: "Who is more dramatic?",
      options: ["Me, obviously", "Bonu, no contest", "We're equally dramatic", "We refuse to answer"],
      funResult: "Drama is a shared family trait, it seems.",
    },
    {
      question: "Who steals the other's things without asking?",
      options: ["I do... sometimes", "Bonu does ALL the time", "It's a two-way street", "What's stealing between sisters?"],
      funResult: "Property rights are complicated in this household.",
    },
    {
      question: "Who would survive longer in a zombie apocalypse?",
      options: ["Me — I have survival instincts", "Bonu — she'd charm the zombies", "We'd argue and both get caught", "We'd survive together obviously"],
      funResult: "The zombies wouldn't stand a chance against the combined sibling energy.",
    },
    {
      question: "Who starts the most arguments over nothing?",
      options: ["I plead the fifth", "Bonu, definitely", "It takes two to argue", "We're both innocent angels"],
      funResult: "The courtroom of family dynamics has heard this case before.",
    },
    {
      question: "Who is secretly the favourite?",
      options: ["Me — I'm the older one", "Bonu — she's the baby", "It changes depending on who did the dishes", "We're equally and perfectly loved"],
      funResult: "The favourite child title changes hands more often than anyone admits.",
    },
    {
      question: "Who is more likely to stay up until 3 AM for no reason?",
      options: ["Definitely me", "Bonu without question", "Both of us, always", "We are responsible people"],
      funResult: "3 AM is just the beginning of the real day.",
    },
  ],

  // ── Treasure Hunt ─────────────────────────────────────────
  // IMPORTANT: The answers below are what the visitor must type (case-insensitive)
  treasureClues: [
    {
      id: "clue-1",
      riddle: "I hold your memories close, both funny and dear — visit the archives to find me there.",
      hint: "Look in the Sister Archives section.",
      answer: "memories",
      location: "Sister Archives",
    },
    {
      id: "clue-2",
      riddle: "I have five games to play, stars to catch and cards to flip. What world is this?",
      hint: "Look in the Arcade section.",
      answer: "arcade",
      location: "Bonu's Arcade",
    },
    {
      id: "clue-3",
      riddle: "Every birthday needs one — with candles, cake, and wishes to make. Where do you celebrate?",
      hint: "Go back to the Home page.",
      answer: "birthday",
      location: "Home / Main Character Day",
    },
    {
      id: "clue-4",
      riddle: "Sisters challenge each other here — who's more dramatic, who wins? What world are you in?",
      hint: "Visit the Sister vs Sister challenge.",
      answer: "sisters",
      location: "Sister vs Sister",
    },
    {
      id: "clue-5",
      riddle: "The final secret code that unlocks the treasure: combine the first letters of each answer above.",
      hint: "Take the first letter of each previous answer: M, A, B, S → ???",
      answer: "mabs",
      location: "Right here!",
      isFinalCode: true,
    },
  ],
  treasureReward: "You've unlocked the rarest gift in the Gift Gallery! 🎁✨ And you've proven you're an excellent explorer.",

  // ── Gift Gallery ──────────────────────────────────────────
  gifts: [
    {
      id: "gift-1",
      color: "#F5C6D6",
      ribbonColor: "#D986A8",
      emoji: "💌",
      title: "A Promise",
      message: "I promise to always pick up when you call, even when I pretend not to see it ringing.",
    },
    {
      id: "gift-2",
      color: "#C7B8F5",
      ribbonColor: "#9272ED",
      emoji: "🍕",
      title: "A Sibling Coupon",
      message: "Redeemable for one (1) meal of your choice, paid for by your wonderful sister. Terms: one-time use only.",
    },
    {
      id: "gift-3",
      color: "#FFE7A0",
      ribbonColor: "#D986A8",
      emoji: "⭐",
      title: "A Compliment",
      message: "You are genuinely one of the funniest people I know. Don't let it go to your head.",
    },
    {
      id: "gift-4",
      color: "#F7EDE5",
      ribbonColor: "#C7B8F5",
      emoji: "🎯",
      title: "A Birthday Challenge",
      message: "This year: try one new thing you've been scared of. I'll be right there cheering you on (or running away with you).",
    },
    {
      id: "gift-5",
      color: "#19152E",
      ribbonColor: "#9272ED",
      emoji: "🌙",
      title: "A Midnight Secret",
      message: "Some of my best memories with you happened completely by accident. Let's keep making those.",
    },
    {
      id: "gift-6",
      color: "#D986A8",
      ribbonColor: "#FFE7A0",
      emoji: "🤝",
      title: "A Time Promise",
      message: "I owe you at least three proper sister days this year. No phones, no excuses, no bailing.",
    },
    {
      id: "gift-rare",
      color: "#302044",
      ribbonColor: "#FFE7A0",
      emoji: "🔮",
      title: "The Rarest Gift",
      message: "You found it! This gift holds the most powerful magic in the universe: the knowledge that no matter what, you have someone in your corner. Always. Happy Birthday, Bonu. 🌟",
      isRare: true, // Unlocked by completing the treasure hunt
    },
  ],

  // ── Birthday Letter ───────────────────────────────────────
  letter: {
    opening: "My Dearest Bonu,",
    paragraphs: [
      "No matter how much we tease each other, argue over the smallest things, or annoy each other for absolutely no reason — you will always be one of the most special people in my life.",
      "I watch you grow up and sometimes I genuinely cannot believe the person you're becoming. You are braver than you think, smarter than you know, and more loved than you can probably imagine.",
      "I know sometimes I don't say these things out loud — because we communicate mostly through mutual teasing and dramatic sighs — but know that I see you. I see how hard you try, how brightly you feel everything, and how much you care even when you pretend not to.",
      "This year, I hope you get everything you're quietly wishing for. I hope you have moments that make you laugh until it hurts, adventures that scare you just enough, and quiet evenings where everything feels exactly right.",
      "And whenever things feel too heavy — remember I'm one call away. Even if I let it ring three times first.",
      "I'm so glad you're my little sister. Happy Birthday, Bonu.",
    ],
    closing: "With so much love,",
    signature: "Didi 💜", // ← Change to your name
  },

  // ── Audio ─────────────────────────────────────────────────
  // Optional: Add paths to your own audio files
  // audio: {
  //   backgroundMusic: "/audio/birthday-bg.mp3",
  //   celebrationSound: "/audio/celebration.mp3",
  // }
};

export type BirthdayConfig = typeof birthdayConfig;
