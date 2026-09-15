/**
 * Posts from https://medium.com/@kpachyuthz. Takeaways paraphrase each post's own content.
 * All were written in 2020, before the first engineering role (FIS Global, July 2021).
 */
export interface Post {
  title: string;
  url: string;
  published: string; // ISO date
  takeaway: string;
}

export const posts: Post[] = [
  {
    title: "What is VPN and how it works",
    url: "https://kpachyuthz.medium.com/what-is-vpn-and-how-it-works-3da8dcc0c1c5",
    published: "2020-05-02",
    takeaway:
      "A VPN swaps your IP address and protects traffic on public Wi-Fi, but it isn't anonymity: the VPN provider still sees your real address.",
  },
  {
    title: "What are the different types of artificial intelligence?",
    url: "https://medium.com/the-narrow-world/what-are-the-different-types-of-artificial-intelligence-a5e5fdee92b8",
    published: "2020-03-31",
    takeaway:
      "Machine learning and deep learning sit inside AI, while data science only overlaps with it, because data science is about the data itself.",
  },
  {
    title: "The difference between virtual, augmented, and mixed reality",
    url: "https://medium.com/the-narrow-world/what-is-the-difference-between-virtual-reality-augmented-reality-and-mixed-reality-fac2bff0551",
    published: "2020-04-22",
    takeaway:
      "VR replaces the real world, AR places virtual objects in it, and mixed reality lets those objects respond as if they were really there.",
  },
];
