import ClientTaskList from '../components/ClientTaskList';

export default async function VideoPage() {
  // // check for valid session
  // const session = await getServerSession(authOptions);
  // // instantiate session
  // console.log(session);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 text-black">
      <p>Video Player Page</p>
      <ClientTaskList />
    </div>
  );
}
