import { server } from '@/main';
import axios from 'axios';
import Cookies from 'js-cookie';
import {createContext,useContext,useEffect,useState} from 'react';
import toast, {Toaster} from 'react-hot-toast'
const UserContext=createContext();

export const UserProvider=({children})=>{
    const  [user, setUser ]= useState([])
    const  [loading, setLoading ]= useState(true);
    const [btnLoading,setBtnLoading]=useState(false);
    const [isAuth, setIsAuth] = useState(false)
    async function LoginUser(email,navigate){
        setBtnLoading(true)
        try {
            const {data}=await axios.post(`${server}/api/user/login`,{email})
            
            toast.success(data.message)
            localStorage.setItem("email",email)
            navigate("/verify")
            setBtnLoading(false)
        } catch (error) {
            toast.error(error.response.data.message)
            setBtnLoading(false);

        }
    }

    async function verifyUser(otp,navigate,fetchCart){
        setBtnLoading(true)
        const email=localStorage.getItem("email");

        try {
            const {data}=await axios.post(`${server}/api/user/verify`,{email, otp})
            
            toast.success(data.message)
            localStorage.clear();
            navigate("/")
            setBtnLoading(false);
         
            Cookies.set("token",data.token,{expires:15,
                secure:true,
                path:"/"
            })
            setIsAuth(true);
            setUser(data.user)
            fetchCart();
           
        } catch (error) {
            toast.error(error.response.data.message)
            setBtnLoading(false);

        }
    }
    async function fetchUser(){
        try {
            const {data}=await axios.get(`${server}/api/user/me`,{
                headers:{
                    token:Cookies.get("token"),

                }
            });
            setIsAuth(true)
            setUser(data);
            setLoading(false);

            
        } catch (error) {
            console.log(error);
            setIsAuth(false);
            setLoading(false);
            
        }
    }
    function logoutUser(navigate,setTotalItem) {
        Cookies.remove("token");        
        setUser([]);                    
        setIsAuth(false);              
        setLoading(false);              
        navigate("/login");             
        toast.success("Logged Out");   
        setTotalItem(0);
        
      }
    useEffect(()=>{
        fetchUser()
    },[]);
    
    return (
    <UserContext.Provider value={{ user,loading,btnLoading,isAuth,LoginUser,verifyUser,logoutUser}}>
        {children}
        <Toaster/>
    </UserContext.Provider>
    );
};
export const UserData=()=>useContext(UserContext);

