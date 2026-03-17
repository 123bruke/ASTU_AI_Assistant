import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  userId: string;
  student_name:string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  userId: { type: String, required: true, index: true },
  role: { type: String, enum: ['user', 'assistant' ,'student_id], required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true, default: () => Date.now() }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);