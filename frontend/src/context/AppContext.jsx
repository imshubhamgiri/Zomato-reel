import { createContext, useContext , useState, useEffect } from "react";
import {userAPI ,partnerAPI, authAPI} from "../services/api";


const AppContext = createContext();


export const AppProvider = ({ children }) => {

    const [user , setUser] = useState(null);
    const [isAuthenticated , setIsAuthenticated] = useState(false);
    const [isUserfetched , setIsUserFetched] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true); // Added loading state for auth check
    const [Food , setFood] = useState([]);
    const [Cart , setCart] = useState([]);
    const [Orders , setOrders] = useState([]);
    const [Restaurants , setRestaurants] = useState([]);


    const login = async (userData) => {
        const response = await userAPI.login(userData);
        setUser(response.user);
        setIsAuthenticated(true);
    }

    const register = async (userData) => {
        const response = await userAPI.register(userData);
        setUser(response.user);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        await userAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
    }

    const partnerRegister = async (partnerData) => {
        const response = await partnerAPI.register(partnerData);
        setUser(response.user);
        setIsAuthenticated(true);
    }

    const partnerLogin = async (partnerData) => {
        const response = await partnerAPI.login(partnerData);
        setUser(response.user);
        setIsAuthenticated(true);
    }

    const partnerLogout = async () => {
        await partnerAPI.logout();
        setUser(null);
        setIsAuthenticated(false);

    }

    const fetchUserData = async () => {
        try {
          const response = await authAPI.checkAuth();
            if (response.userType === 'user') {
                setUser(response);
                setIsAuthenticated(true);
                setIsUserFetched(true);
            }
            else if(response.userType === 'partner'){
                setUser(response);
                setIsAuthenticated(true);
                setIsUserFetched(true);
            }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        } finally {
            setIsAuthLoading(false); // Auth check is complete
        }
    };

    // Automatically check auth status when whole app loads
    useEffect(() => {
        fetchUserData();
    }, []);

    const value = {
            user,
            setUser,
            isAuthenticated,
            setIsAuthenticated,
            Food,
            Cart,
            Orders,
            Restaurants,
            login,
            register,
            logout,
            partnerRegister,
            partnerLogin,
            partnerLogout,
            fetchUserData,
            isUserfetched,
            isAuthLoading, // Exported for protected routes
    }    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};   

export const useAppContext = () => { return useContext(AppContext); };