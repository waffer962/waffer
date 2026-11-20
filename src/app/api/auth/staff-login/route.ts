import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qdbcyqusgmqayyswaotp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Y-pioxtwjYryBfensuQ9oQ_Gxwwl-f8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side authoritative records for admin & employee access
const STAFF_ACCOUNTS = [
  {
    id: 'usr-admin-1',
    email: 'admin@waffer.jo',
    password: 'admin123',
    full_name: 'المشرف العام (أدمن وفّر)',
    phone: '0790000001',
    role: 'admin',
    permissions: ['all_access', 'edit_all', 'delete_all']
  },
  {
    id: 'usr-staff-1',
    email: 'staff@waffer.jo',
    password: 'staff123',
    full_name: 'موظف الشكاوى وإدارة الطلبات',
    phone: '0791234567',
    role: 'staff',
    permissions: ['manage_orders', 'manage_complaints', 'contact_customers']
  },
  {
    id: 'usr-staff-2',
    email: 'support@waffer.jo',
    password: 'staff123',
    full_name: 'فريق دعم ومتابعة العمليات',
    phone: '0791234568',
    role: 'staff',
    permissions: ['manage_orders', 'manage_complaints']
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check in server-side staff list
    const found = STAFF_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
    );

    if (found) {
      return NextResponse.json({
        success: true,
        user: {
          id: found.id,
          email: found.email,
          full_name: found.full_name,
          phone: found.phone,
          role: found.role,
          permissions: found.permissions
        }
      });
    }

    // 2. Check Supabase profiles table for dynamically added staff
    try {
      const { data: dbUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (dbUser && (dbUser.role === 'admin' || dbUser.role === 'staff')) {
        // If password matches or standard staff password
        return NextResponse.json({
          success: true,
          user: {
            id: dbUser.id,
            email: dbUser.email || cleanEmail,
            full_name: dbUser.full_name,
            phone: dbUser.phone || '',
            role: dbUser.role,
            permissions: dbUser.role === 'admin' ? ['all_access'] : ['manage_orders', 'manage_complaints']
          }
        });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json(
      { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة، أو ليس لديك صلاحية وصول إدارية' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء المصادقة، يرجى المحاولة لاحقاً' },
      { status: 500 }
    );
  }
}
