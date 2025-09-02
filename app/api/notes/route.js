import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import Note from '@/app/models/Notes';
import connectMongoDB from '@/app/lib/connectDB';

// GET - Fetch user's notes
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectMongoDB();

        // Get user ID - try different possible fields
        const userId = session.user.id || session.user._id || session.user.sub;
        
        if (!userId) {
            console.error('No user ID found in session:', session.user);
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        console.log('Fetching notes for user:', userId);

        const { searchParams } = new URL(request.url);
        const archived = searchParams.get('archived') === 'true';
        const favorite = searchParams.get('favorite') === 'true';
        const search = searchParams.get('search');

        let query = { user: userId };
        
        // Always exclude deleted notes unless specifically requesting them
        query.isDeleted = { $ne: true };
        
        if (archived) {
            query.isArchived = true;
        } else {
            query.isArchived = { $ne: true };
        }
        
        if (favorite) {
            query.isFavorite = true;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { plainTextContent: { $regex: search, $options: 'i' } }
            ];
        }

        const notes = await Note.find(query)
            .sort({ createdAt: -1 })
            .limit(50); // Limit for performance

        console.log('Found notes:', notes.length);
        console.log('Query used:', query);

        return NextResponse.json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

// POST - Create a new note
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, icon, accent, tags } = await request.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        await connectMongoDB();

        // Debug session to see what's available
        console.log('Session user:', JSON.stringify(session.user, null, 2));
        
        // Get user ID - try different possible fields
        const userId = session.user.id || session.user._id || session.user.sub;
        
        if (!userId) {
            console.error('No user ID found in session:', session.user);
            return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
        }

        const note = new Note({
            user: userId,
            title: title.trim(),
            content: content.trim(),
            icon: icon || 'calendar',
            accent: accent || 'calendar',
            tags: tags || []
        });

        await note.save();

        return NextResponse.json({ 
            message: 'Note created successfully', 
            note: {
                _id: note._id,
                title: note.title,
                content: note.content,
                icon: note.icon,
                accent: note.accent,
                isFavorite: note.isFavorite,
                createdAt: note.createdAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating note:', error);
        
        if (error.name === 'ValidationError') {
            return NextResponse.json({ 
                error: 'Validation error', 
                details: error.message 
            }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
}
