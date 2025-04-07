import React, { Dispatch, SetStateAction } from 'react'; // Import Dispatch and SetStateAction

// 1. Define the type for the user state object
interface UserState {
    name: string;
    isLoggedIn: boolean;
    email?: string; 
    id?: number;
}

// 2. Define the type for the context value
interface UserContextType {
    user: UserState;
    // A function that receives either a UserState object or a function 
    // ((prevState) => newState), and returns void.
    setUser: Dispatch<SetStateAction<UserState>>; 
}

// 3. Create context providing the explicit type <UserContextType>
//    and a default value that matches the type structure.
const UserContext = React.createContext<UserContextType>({
    // Default user state
    user: { name: '', isLoggedIn: false }, 
    // Default setter function (matches type, does nothing or warns)
    // This default is only used if a component consumes the context 
    // without a <UserContext.Provider> above it in the tree.
    setUser: () => { console.warn('setUser function called on default UserContext. Make sure you have a UserProvider wrapping your component tree.'); } 
});

export default UserContext;

export type { UserState, UserContextType };