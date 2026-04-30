export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}

export const INITIAL_MESSAGES: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex C.",
    message: "Love the terminal easter egg! Very cyberpunk.",
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "2",
    name: "Sarah M.",
    message: "Incredible portfolio design. The animations are superb.",
    date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "3",
    name: "Elena R.",
    message: "The attention to detail in the micro-interactions is phenomenal. Truly inspiring work.",
    date: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "4",
    name: "Marcus V.",
    message: "A masterclass in modern web aesthetics. Love the dark mode execution and the glassmorphism effects.",
    date: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: "5",
    name: "Jordan K.",
    message: "Clean code, cleaner UI. One of the best developer portfolios I've come across this year.",
    date: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: "6",
    name: "Satoshi N.",
    message: "System integrity confirmed. The grid-pattern background and tactical UI elements are a nice touch.",
    date: new Date(Date.now() - 518400000).toISOString()
  },
  {
    id: "7",
    name: "Liam S.",
    message: "The attention to detail in the micro-animations is next level. Everything feels so responsive.",
    date: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: "8",
    name: "Ava D.",
    message: "One of the most unique developer portfolios I've seen. Love the immersive aesthetic.",
    date: new Date(Date.now() - 691200000).toISOString()
  },
  {
    id: "9",
    name: "Noah W.",
    message: "The performance is impressive given the level of animation. Great engineering work here.",
    date: new Date(Date.now() - 777600000).toISOString()
  },
  {
    id: "10",
    name: "Sophia L.",
    message: "The 'Case Files' theme is so well-executed. Moving between sections feels like an investigation.",
    date: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: "11",
    name: "Ethan B.",
    message: "Clean architecture, clean design. A true inspiration for other developers in the field.",
    date: new Date(Date.now() - 950400000).toISOString()
  },
  {
    id: "12",
    name: "Isabella G.",
    message: "Love how responsive the entire interface is. Works perfectly on my mobile and tablet.",
    date: new Date(Date.now() - 1036800000).toISOString()
  }
];