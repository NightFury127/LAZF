import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';

// Mock the PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            image: null,
            role: 'CUSTOMER',
          }),
          update: jest.fn().mockResolvedValue({
            id: 'user-123',
            name: 'Updated Name',
            email: 'test@example.com',
          }),
        },
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      };
    }),
  };
});

// Mock next-auth
jest.mock('next-auth/react');

// Simple UserProfile component for testing
const UserProfile = () => {
  const { data: session, status } = useSession();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            readOnly
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      {message && <p role="alert">{message}</p>}
    </div>
  );
};

describe('UserProfile Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });
  });

  it('shows loading state when session is loading', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<UserProfile />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows sign in message when user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<UserProfile />);
    expect(screen.getByText('Please sign in to view your profile')).toBeInTheDocument();
  });

  it('displays user data when authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<UserProfile />);
    expect(screen.getByLabelText('Name')).toHaveValue('Test User');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
  });

  it('handles profile update', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<UserProfile />);
    
    // Change the name
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(screen.getByRole('button')).toHaveTextContent('Updating...');
    
    // Wait for the update to complete
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Profile updated successfully');
    });
    
    // Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Updated Name' }),
    });
  });

  it('handles error during profile update', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });
    
    // Mock fetch to return an error
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Update failed' }),
    });

    render(<UserProfile />);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update profile/i });
    fireEvent.click(submitButton);
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error updating profile');
    });
  });
});
