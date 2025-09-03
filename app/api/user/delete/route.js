import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/authOptions';
import connectDB from '@/app/lib/connectDB';
import User from '@/app/models/User';
import Notes from '@/app/models/Notes';

export async function DELETE(request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all notes associated with this user
    await Notes.deleteMany({ userId: user._id });

    // Delete the user account
    await User.findByIdAndDelete(user._id);

    return Response.json(
      { message: 'Account and all associated data deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete account error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
