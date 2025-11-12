import mongoose from 'mongoose';

const CodeSnippetSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    language: { type: String, required: true }, // e.g. 'c'
    title: { type: String, required: true },
    code: { type: String, required: true },
    complexity: {
      time: { type: String },
      space: { type: String }
    },
    notes: { type: String }
  },
  { _id: false }
);

const DataStructureSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    related: { type: [String], default: [] },
    codeSnippets: { type: [CodeSnippetSchema], default: [] }
  },
  { timestamps: true }
);

export const DataStructure = mongoose.model('DataStructure', DataStructureSchema);
