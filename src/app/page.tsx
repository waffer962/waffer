'use client';

import React from 'react';
import { AppProvider, useApp } from '@/lib/store/app-context';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { AdminLoginScreen } from '@/components/screens/AdminLoginScreen';
import { RoleSelectScreen } from '@/components/screens/RoleSelectScreen';
import { CustomerScreen } from '@/components/screens/CustomerScreen';
import { StoreScreen } from '@/components/screens/StoreScreen';
import { AdminScreen } from '@/components/screens/AdminScreen';
import { StaffScreen } from '@/components/screens/StaffScreen';
import { INITIAL_STORES } from '@/lib/mock-data';

function AppContent() {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Main Interactive Screen */}
      <main className="flex-1 w-full flex flex-col">
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'admin_login' && <AdminLoginScreen />}
        {currentScreen === 'customer' && <CustomerScreen />}
        {currentScreen === 'store' && <StoreScreen />}
        {currentScreen === 'admin' && <AdminScreen />}
        {currentScreen === 'staff' && <StaffScreen />}
        {currentScreen === 'role_select' && <RoleSelectScreen />}
        {currentScreen === 'splash' && <SplashScreen />}
      </main>

      {/* Semantic Crawlable SEO Section for Search Engines (Indexed by Googlebot & Search Crawlers) */}
      <section className="sr-only" aria-label="Waffer Platform Information and SEO Directory">
        <h1>منصة وتطبيق وفّـر | Waffer Jordan - المنصة الأردنية للحد من هدر الطعام وعروض التوفير</h1>
        <p>
          مرحباً بكم في <strong>منصة وتطبيق وفّـر (Waffer / Waffer Jordan / وفر الأردن / Waffer App)</strong>،
          المنصة الوطنية الرائدة لربط المخابز والمطاعم والزبائن لشراء فائض الوجبات اليومية الطازجة بخصومات
          تصل حتى 70%، أو الحصول على وجبات طعام مجانية لوجه الله تعالى في عمان، إربد، الزرقاء، وكافة محافظات المملكة الأردنية الهاشمية.
        </p>

        <h2>كلمات البحث المستهدفة (Primary Search Keywords):</h2>
        <ul>
          <li><strong>وفر</strong> - منصة شراء فائض الطعام بأسعار مخفضة</li>
          <li><strong>Waffer</strong> - Official food waste reduction platform in Jordan</li>
          <li><strong>Waffer Jordan</strong> - Discounted daily bakery and restaurant meals</li>
          <li><strong>وفر الأردن</strong> - تطبيق حفظ النعمة ومساعدة العائلات الأردنية</li>
          <li><strong>Waffer App</strong> - حجز الوجبات واستلامها مباشرة والدفع عند الاستلام</li>
          <li>عروض مطاعم الأردن ومخابز عمان اليومية</li>
          <li>توفير نفقات الطعام وشراء الفائض الغذائي الصالح للاستهلاك</li>
          <li>وجبات مجانية لوجه الله تعالى في الأردن</li>
        </ul>

        <h2>المتاجر والمخابز الشريكة المعتمدة في الأردن (Partner Stores Directory):</h2>
        <ul>
          {INITIAL_STORES.map((s) => (
            <li key={s.id}>
              <h3>{s.name} ({s.store_type})</h3>
              <p>
                الموقع: {s.governorate} - {s.area} | الهاتف: {s.phone} | الوصف: {s.description} | ساعات العمل: {s.working_hours}
              </p>
            </li>
          ))}
        </ul>

        <h2>الأسئلة الشائعة حول منصة وفّـر (Waffer FAQ):</h2>
        <div>
          <h3>ما هو تطبيق وفر (Waffer Jordan)؟</h3>
          <p>
            وفر هي منصة أردنية مبتكرة تهدف إلى الحد من هدر الطعام من خلال مساعدة المطاعم والمخابز على بيع فائضها اليومي
            بأسعار مخفضة، مما يتيح للزبائن التوفير، ويقلل الخسائر على المتاجر، ويسهم في الاستدامة البيئية.
          </p>
          <h3>كيف يمكنني شراء وجبات مخفضة عبر منصة وفر؟</h3>
          <p>
            اختر وجبتك من العروض اليومية المتاحة بالقرب منك، حدد الكمية، وقم بتأكيد الحجز فوراً للحصول على كود حجز معتمد.
            توجه إلى المتجر خلال فترة الاستلام وادفع نقداً كاش عند الاستلام.
          </p>
          <h3>كيف يسجل أصحاب المطاعم والمخابز في وفر؟</h3>
          <p>
            يمكن لأصحاب المتاجر والمخابز التسجيل بسهولة عبر حساب Google واختيار &quot;حساب صاحب متجر&quot; لإضافة بيانات المتجر ونشر العروض فوراً.
          </p>
          <h3>هل يتوفر طعام مجاني لوجه الله على تطبيق وفر؟</h3>
          <p>
            نعم، نوفر قسماً مخصصاً للوجبات المجانية لوجه الله التي تقدمها المتاجر الشريكة للأسر المحتاجة بنفس آلية الحجز المحترمة وسرية البيانات.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
