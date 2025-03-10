'use server';

import AddTasks from '../components/AddTasks/AddTasks';
import ClientTaskList from '../components/ClientTaskList';
import NoteDisplay from '../components/NoteBoard';
import TextEditor from '../components/TextEditor';
import DashboardGreeting from '../components/DashboardGreeting';
import DashboardStats from '../components/DashboardStats';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FaCalendarWeek } from 'react-icons/fa6';

export default async function DashboardPage() {
  const session = await auth();
  const username = session?.user?.name || session?.user?.email || 'User';

  if (!session) {
    redirect('/login');
  }
  return (
    <main>
      <div>
        <div className="text-text p-4 flex justify-between">
          <div className="flex flex-col w-[100%]">
            <div className="flex justify-between p-2">
              <DashboardGreeting username={username} />
              <Link
                className="text-text hover:text-primary text-lg font-semibold flex items-center"
                href={'/plan/week'}
                role="button"
                aria-label="Go to weekly planner"
              >
                <FaCalendarWeek size={20} className="inline-block mr-2" />
                Weekly Planner
              </Link>
            </div>
            <DashboardStats />
          </div>
        </div>
        <div className="h-screen text-black grid gap-2 grid-cols-1 md:grid-cols-2 px-4">
          <div role="region" aria-label="tasks" className="flex flex-col p-2">
            <ClientTaskList />
            <AddTasks />
          </div>
          <div role="region" aria-label="notes" className="p-2">
            <NoteDisplay />
            <TextEditor />
          </div>
        </div>
      </div>
    </main>
  );
}
