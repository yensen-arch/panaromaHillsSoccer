import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Registration from '@/lib/registration.model';
import { verifyToken } from '@/lib/auth-server';

// Helper function to verify admin token
async function verifyAdminToken(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return false;
  }
  return await verifyToken(token);
}

export async function GET(request) {
  try {
    // Verify admin token
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get all registrations grouped by season
    const registrationsBySeason = await Registration.aggregate([
      {
        $group: {
          _id: '$seasonId',
          seasonName: { $first: '$seasonName' },
          totalRegistrations: { $sum: 1 },
          paidRegistrations: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 77, 0] } // Assuming $77 is the registration fee
          }
        }
      },
      {
        $sort: { seasonName: 1 }
      }
    ]);

    // Get monthly registration trends for the current year
    const currentYear = new Date().getFullYear();
    const monthlyTrends = await Registration.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 77, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get payment method distribution
    const paymentMethods = await Registration.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      registrationsBySeason,
      monthlyTrends,
      paymentMethods
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 