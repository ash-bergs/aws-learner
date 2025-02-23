'use server';

import AddTasks from '../components/AddTasks/AddTasks';
import ClientTaskList from '../components/ClientTaskList';
import NoteDisplay from '../components/NoteBoard';
import TextEditor from '../components/TextEditor';
import DashboardGreeting from '../components/DashboardGreeting';
import DashboardStats from '../components/DashboardStats';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  const username = session?.user?.name || session?.user?.email || 'User';

  if (!session) {
    redirect('/login');
  }
  return (
    <main>
      <div>
        <div className="text-text px-4 py-6 flex justify-between">
          <DashboardGreeting username={username} />
          <DashboardStats />
          {/** TODO: Make these into links, create a page for each */}
          {/* <div className="flex gap-4">
          <div>Monthly Calendar</div>
          <div>Weekly Calendar</div>
        </div> */}
        </div>
        {/** TODO: add dateCompleted and a way to assign tasks to a day */}
        {/* <div className="text-text px-4 py-2">
        <div>Tasks for the day (count)</div>
      </div> */}
        <div
          className="h-screen text-black
      grid gap-8 grid-cols-1 md:grid-cols-2
      px-4 
      "
        >
          <div className="flex flex-col">
            <ClientTaskList />
            <AddTasks />
          </div>
          <div>
            <NoteDisplay />
            <TextEditor />
          </div>
        </div>
      </div>
    </main>
  );
}
