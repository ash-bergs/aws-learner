import ClientTaskList from '../components/ClientTaskList';
import AddTasks from '../components/AddTasks';

export default async function VideoPage() {
  // // check for valid session
  // const session = await getServerSession(authOptions);
  // // instantiate session
  // console.log(session);

  return (
    <div className="flex flex-col gap-8 h-screen items-center justify-center bg-gray-100 text-black">
      <ClientTaskList />
      <AddTasks />
    </div>
  );
}
