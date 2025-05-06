import { NextResponse } from 'next/server';
import { removeSession } from '@/lib/auth-server';

export async function POST() {
  await removeSession();
  return NextResponse.json({ success: true });
} 