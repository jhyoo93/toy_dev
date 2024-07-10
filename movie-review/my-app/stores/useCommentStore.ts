import create from 'zustand';

interface Comment {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
}

interface CommentState {
  comments: Comment[];
  addComment: (comment: Comment) => void;
  setComments: (comments: Comment[]) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  addComment: (comment: Comment) => set((state) => ({ comments: [comment, ...state.comments] })),
  setComments: (comments: Comment[]) => set({ comments }),
}));