import { NextResponse } from 'next/server';
import { searchAliExpress } from '@/services/providers/aliexpress';

export async function POST(req: Request) {
  const { query } = await req.json();
  
  // هنا السيرفر بيقرأ الـ Key بأمان
  const products = await searchAliExpress(query);
  
  return NextResponse.json({ products });
}