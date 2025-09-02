import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import Note from '@/app/models/Notes';
import connectMongoDB from '@/app/lib/connectDB';

// GET - Fetch a single note
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectMongoDB();

        // Get user ID - try different possible fields
        const userId = session.user.id || session.user._id || session.user.sub;
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        const note = await Note.findOne({ 
            _id: params.id, 
            user: userId 
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ note });
    } catch (error) {
        console.error('Error fetching note:', error);
        return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
    }
}

// PUT - Update a note
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, icon, accent, isFavorite, isArchived, isDeleted, deletedAt, tags } = await request.json();

        await connectMongoDB();

        // Get user ID - try different possible fields
        const userId = session.user.id || session.user._id || session.user.sub;
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        const note = await Note.findOne({ 
            _id: params.id, 
            user: userId 
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        // Update fields if provided
        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content.trim();
        if (icon !== undefined) note.icon = icon;
        if (accent !== undefined) note.accent = accent;
        if (isFavorite !== undefined) note.isFavorite = isFavorite;
        if (isArchived !== undefined) note.isArchived = isArchived;
        if (isDeleted !== undefined) note.isDeleted = isDeleted;
        if (deletedAt !== undefined) note.deletedAt = deletedAt;
        if (tags !== undefined) note.tags = tags;

        await note.save();

        return NextResponse.json({ 
            message: 'Note updated successfully', 
            note: {
                _id: note._id,
                title: note.title,
                content: note.content,
                icon: note.icon,
                accent: note.accent,
                isFavorite: note.isFavorite,
                isArchived: note.isArchived,
                isDeleted: note.isDeleted,
                deletedAt: note.deletedAt,
                updatedAt: note.updatedAt
            }
        });

    } catch (error) {
        console.error('Error updating note:', error);
        
        if (error.name === 'ValidationError') {
            return NextResponse.json({ 
                error: 'Validation error', 
                details: error.message 
            }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
}

// DELETE - Delete a note
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectMongoDB();

        // Get user ID - try different possible fields
        const userId = session.user.id || session.user._id || session.user.sub;
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        const note = await Note.findOneAndDelete({ 
            _id: params.id, 
            user: userId 
        });

        if (!note) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Note deleted successfully' });

    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}
