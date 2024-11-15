import NextAuth from 'next-auth';
import { authOptions } from '@/utils/authOptions';
// export default NextAuth(authOptions);

// Ran into some issues here:
// as I forgot about updates to how api routes are handled in App router
// and that the options have a strong type from Next Auth now
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
