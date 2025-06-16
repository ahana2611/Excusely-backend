import { Schema, model, Document } from 'mongoose';

export interface IExcuse extends Document {
  userId?: string; // optional unless you're using login
  message: string;
  emailTemplate: string;
  voiceNoteStyle: string;
  context?: Record<string, any>;
  createdAt: Date;
  hash: string;
}

const ExcuseSchema = new Schema<IExcuse>(
  {
    userId: { type: String }, // now optional
    message: { type: String, required: true },
    emailTemplate: { type: String, required: true },
    voiceNoteStyle: { type: String, required: true },
    context: { type: Schema.Types.Mixed },
    hash: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export const Excuse = model<IExcuse>('Excuse', ExcuseSchema);
