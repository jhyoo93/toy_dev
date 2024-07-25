import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
  movieId: string;
  username: string;
  content: string;
  createdAt: Date;
};

const CommentSchema: Schema = new Schema({
  movieId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema); 