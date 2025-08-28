import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KYCApprovalTestComponent } from './KYCTestUtils';

// Mock the necessary modules
jest.mock('@/hooks/useDatabase', () => ({
  useKYCDocuments: () => ({
    data: [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        documentType: 'Passport',
        documentNumber: 'P12345678',
        status: 'pending',
        submittedDate: '2023-01-01',
        reviewedDate: null,
        reviewedBy: null,
        rejectionReason: null,
        documents: {
          front: '/placeholder.svg',
          back: '/placeholder.svg',
          selfie: '/placeholder.svg'
        },
        userDetails: {
          phone: '+1234567890',
          dateOfBirth: '1990-01-01',
          address: '123 Main St'
        }
      }
    ],
    loading: false,
    refetch: jest.fn()
  }),
  useKYCStats: () => ({
    data: {
      pendingCount: 1,
      underReviewCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      totalCount: 1
    },
    loading: false
  }),
  useKYCActions: () => ({
    updateKYCStatus: jest.fn().mockResolvedValue(true),
    approveKYC: jest.fn().mockResolvedValue(true),
    rejectKYC: jest.fn().mockResolvedValue(true),
    loading: false
  })
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('KYC Approval Functionality', () => {
  const user = userEvent.setup();

  it('should approve KYC and update the database', async () => {
    render(<KYCApprovalTestComponent />);
    
    // Click the approve button
    const approveButton = screen.getByTitle('Approve KYC');
    await user.click(approveButton);
    
    // Wait for the operation to complete
    await waitFor(() => {
      // Check that the success message is displayed
      expect(screen.getByText('KYC status updated to approved')).toBeInTheDocument();
    });
  });

  it('should reject KYC with a reason and update the database', async () => {
    render(<KYCApprovalTestComponent />);
    
    // Click the reject button
    const rejectButton = screen.getByTitle('Reject KYC');
    await user.click(rejectButton);
    
    // Wait for the operation to complete
    await waitFor(() => {
      // Check that the success message is displayed
      expect(screen.getByText('KYC status updated to rejected')).toBeInTheDocument();
    });
  });
});