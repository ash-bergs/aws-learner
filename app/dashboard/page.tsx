import AddTasks from '../components/AddTasks/AddTasks';
import ClientTaskList from '../components/ClientTaskList';
import NoteDisplay from '../components/NoteBoard';
import TextEditor from '../components/TextEditor';

export default async function VideoPage() {
  // // check for valid session
  // const session = await getServerSession(authOptions);
  // // instantiate session
  // console.log(session);

  // create a message for "Good Morning", "Good Afternoon", and "Good Evening" based on date and time
  const time = new Date().getHours();
  const message =
    time < 12
      ? 'Good Morning,'
      : time < 18
      ? 'Good Afternoon,'
      : 'Good Evening,';

  return (
    <div>
      <div className="text-text px-4 py-6 flex justify-between">
        <div>
          <p className="text-2xl">
            {message} <span className="font-bold">User</span>
          </p>
        </div>
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
        <div>
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
