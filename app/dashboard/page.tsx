import AddTasks from '../components/AddTasks/AddTasks';
import ClientTaskList from '../components/ClientTaskList';
import NoteDisplay from '../components/NoteBoard';
import TextEditor from '../components/TextEditor';

export default async function VideoPage() {
  // // check for valid session
  // const session = await getServerSession(authOptions);
  // // instantiate session
  // console.log(session);

  return (
    <div
      className="h-screen text-black
      grid gap-8 grid-cols-1 md:grid-cols-2
      px-4 py-6
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
  );
}
