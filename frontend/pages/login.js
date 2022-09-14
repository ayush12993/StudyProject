import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {SyncOutlined} from "@ant-design/icons";
import Link from "next/link";
import {Context} from "../context";
import {useRouter} from "next/router";

const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const {state:{user},dispatch}=useContext(Context);
  //  const {user} = state;
    const router = useRouter();

         useEffect(() => {
             if (user!==null) {
                 router.push("/");
             }
         },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {data} = await axios.post(`/api/login`,
                {email,password});
            dispatch({
                type: "LOGIN",
                payload: data,
            })
            window.localStorage.setItem("user",JSON.stringify(data));
            router.push("/");
            console.log(data);
            toast.success("Login successful! Please login.");
            setLoading(false);
        }
        catch (error) {
            toast.error(error.response.data);
            setLoading(false);
        }


    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Login</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-control mb-4 pb-4"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        placeholder="Enter Email"
                        required/>
                    <input
                        type="password"
                        className="form-control mb-4 pb-4"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        placeholder="Enter Password"
                        required/>
                    <br />
                    <button type="submit" className="btn btn-primary btn-block "
                            disabled={!email || !password || loading}>
                        {loading ? <SyncOutlined spin /> :"Submit" }</button>
                </form>
                <p className="text-center p-3">Not Registered?{" "}
                    <Link href="/register"><a>Register here</a></Link>
                </p>

                <p className="text-center p-3">Forgot Password?{" "}
                    <Link href="/forgot-password"><a className="text-danger">Forgot Password</a></Link>
                </p>
            </div>
        </>
    );
};

export default Login;