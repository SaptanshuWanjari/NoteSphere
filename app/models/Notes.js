import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true }, // Stores HTML content with rich text formatting
    plainTextContent: { type: String, required: false }, // Optional plain text version for search
    icon: { 
        type: String, 
        required: false,
        enum: ['calendar', 'clipboard', 'flowswitch', 'cake', 'camera', 'settings', 'chat'],
        default: 'calendar'
    },
    accent: { 
        type: String, 
        required: false,
        enum: ['calendar', 'clipboard', 'flowswitch', 'cake', 'camera', 'settings', 'chat'],
        default: 'calendar'
    },
    isFavorite: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    tags: [{ type: String, maxlength: 50 }], // Optional tags for categorization
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    collection: "notes",
    timestamps: true // Automatically manage createdAt and updatedAt
})

// Pre-save middleware to extract plain text content for search
noteSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        // Strip HTML tags to create plain text version for search
        this.plainTextContent = this.content.replace(/<[^>]*>/g, '').trim();
        this.updatedAt = new Date();
    }
    next();
});

// Index for better search performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, isFavorite: 1 });
noteSchema.index({ user: 1, isArchived: 1 });
noteSchema.index({ user: 1, isDeleted: 1 });
noteSchema.index({ user: 1, plainTextContent: 'text', title: 'text' });

export default mongoose.models.Note || mongoose.model("Note", noteSchema);
