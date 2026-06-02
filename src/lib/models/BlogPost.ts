import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq {
  question: string;
  answer: string;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  content: string;
  image: string;
  imageAlt: string;
  faqs: IFaq[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  articleSection: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    author: { type: String, default: 'Enzo' },
    content: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String, default: '' },
    faqs: { type: [FaqSchema], default: [] },
    published: { type: Boolean, default: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    articleSection: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
