import React, { createContext, useEffect, useReducer } from "react";
import { getCookie } from "../Services/cookie";

const AppContextInitialState = {
    isLoggedIn: false,
    userDetails: null,
    categories: []
};

export const AppContext = createContext(AppContextInitialState);

export const AppContextProvider = ({children}) => {
    const [state, setState] = useReducer((oldState, newState) => (
        {...oldState, ...newState}),
        {
            isLoggedIn: Boolean(getCookie("accessToken")),
            setLoggedIn: (value) => {
                setState({isLoggedIn: value});
            },
            userDetails: null,
            setUserDetails: (value) => {
                setState({userDetails: value});
            },
            categories: [],
            setCategories: (value) => {
                setState({ categories: value});
            },
            searchedResponse: [],
            setSearchData: (searchedResponse) => {
                setState({ searchedResponse})
            }
        }
    );

    useEffect(() => {
        const  { setLoggedIn } = state;
        const isLoggedIn = Boolean(getCookie("accessToken"));
        setLoggedIn(isLoggedIn);
    }, [getCookie("accessToken")])

    return <AppContext.Provider value={state}>{children}</AppContext.Provider>
}
