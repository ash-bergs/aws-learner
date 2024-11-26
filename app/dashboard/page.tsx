import AddTasks from '../components/AddTasks';
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
      className="h-screen bg-gray-100 text-black
      grid gap-8 grid-cols-1 md:grid-cols-2"
    >
      <div className="p-6 pr-2">
        <ClientTaskList />
        <AddTasks />
      </div>
      <div className="p-6 pl-2">
        <NoteDisplay />
        <TextEditor />
      </div>
    </div>
  );
}
