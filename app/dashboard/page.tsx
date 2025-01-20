'use server';

import AddTasks from '../components/AddTasks/AddTasks';
import ClientTaskList from '../components/ClientTaskList';
import NoteDisplay from '../components/NoteBoard';
import TextEditor from '../components/TextEditor';
import DashboardGreeting from '../components/DashboardGreeting';
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();
  //TODO: configure user to use the prisma User type and get the user's first name if it exists
  const username = session?.user?.name || session?.user?.email || 'User';
  return (
    <div>
      <div className="text-text px-4 py-6 flex justify-between">
        <DashboardGreeting username={username} />
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
        <div className="flex flex-col gap-4">
          <ClientTaskList />
          <AddTasks />
        </div>
        <div>
          <NoteDisplay />
          <TextEditor />
        </div>
      </div>
    </div>
  );
}
