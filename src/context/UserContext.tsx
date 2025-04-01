import React from 'react';

const UserContext = React.createContext({
    user: { name: '', isLoggedIn: false },
    setUser: () => {}
});

export default UserContext;