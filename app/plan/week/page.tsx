'use server';

import PlannerForm from '../../components/forms/PlannerForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function PlannerPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <div>
        <div className="p-4">
          <PlannerForm />
        </div>
      </div>
    </main>
  );
}
