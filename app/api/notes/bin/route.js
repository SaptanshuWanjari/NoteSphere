import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import Note from '@/app/models/Notes';
import connectMongoDB from '@/app/lib/connectDB';

// GET - Fetch user's deleted notes (bin)
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

        console.log('Fetching deleted notes for user:', userId);

        // Only fetch deleted notes
        const query = { 
            user: userId,
            isDeleted: true 
        };

        console.log('Bin query:', query);

        const notes = await Note.find(query)
            .sort({ deletedAt: -1 }) // Sort by deleted date, most recent first
            .limit(50); // Limit for performance

        console.log('Found deleted notes:', notes.length);

        return NextResponse.json({ notes });
    } catch (error) {
        console.error('Error fetching deleted notes:', error);
        return NextResponse.json({ error: 'Failed to fetch deleted notes' }, { status: 500 });
    }
}
