export interface SearchItem {
  id: number;
  title: string;
  description: string;
  category: string;
}

export const sampleData: SearchItem[] = [
  {
    id: 1,
    title: "Getting Started with React",
    description: "Learn the basics of React and how to build your first application",
    category: "Tutorial"
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    description: "Deep dive into advanced TypeScript features and patterns",
    category: "Tutorial"
  },
  {
    id: 3,
    title: "Building a Full Stack App",
    description: "Step by step guide to building a complete full stack application",
    category: "Guide"
  },
  {
    id: 4,
    title: "State Management in React",
    description: "Understanding different state management solutions in React",
    category: "Article"
  },
  {
    id: 5,
    title: "CSS Best Practices",
    description: "Modern CSS techniques and best practices for web development",
    category: "Guide"
  }
]; 