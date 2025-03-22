"use server";

import AddTasks from "../components/AddTasks/AddTasks";
import ClientTaskList from "../components/ClientTaskList";
import NoteDisplay from "../components/NoteBoard";
import TextEditor from "../components/TextEditor";
import DashboardStats from "../components/DashboardStats";

export default async function DashboardPage() {
  return (
    <main>
      <div>
        <div className="text-text px-4 flex justify-between">
          <div className="flex flex-col w-[100%]">
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
