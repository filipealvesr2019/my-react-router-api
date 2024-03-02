import { sessions } from '@clerk/clerk-sdk-node';
 
const sessionList = await sessions.getSessionList();