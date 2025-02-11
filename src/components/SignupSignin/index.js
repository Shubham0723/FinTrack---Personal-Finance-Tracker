import React, { useState } from 'react';
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth, db, provider } from '../../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginForm, setLoginForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("password", password);
    console.log("confirmPassword", confirmPassword);

    if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");

          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password and Confirm Password don't match");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory")
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log("Email", email);
    console.log("Password", password);
    setLoading(true);
    if(email !== "" && password !== ""){
      signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      toast.success("User Logged In");
      console.log("User Logged In", user);
      setLoading(false);
      navigate("/dashboard");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setLoading(false);
      toast.error(errorMessage);
    });
    } else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName ? user.displayName : name,
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
      });
      toast.success("Doc Created");
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
   } else{
    // toast.error("Doc already exists");
    setLoading(false);
   }
  }

  function googleAuth(){
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("user>>>", user);
      createDoc(user);
      setLoading(false);
      navigate("/dashboard");
      toast.success("User authenticated");
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      setLoading(false);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
    });
    } catch(e){
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
      {loginForm ? (<div className='signup-wrapper'>
        <h2 className='title'>Login on <span style={{ color: "var(--theme)" }}>FinTrack</span></h2>
        <form>
          <Input
            type="email"
            label={"Email"}
            state={email}
            setState={setEmail}
            placeholder={"JohnDoe@gmail.com"}
          />
          <Input
            type="password"
            label={"Password"}
            state={password}
            setState={setPassword}
            placeholder={"Example@123"}
          />
          <Button
            disabled={loading}
            text={loading ? "Loading..." : "Login using Email and Password"}
            onClick={loginUsingEmail}
          />
          <p className='p-login'>OR</p>
          <Button
            onClick={googleAuth}
            text={loading ? "Loading..." : "Login using Google"}
            blue={true}
          />
          <p className='p-login'
            style={{cursor:"pointer"}}
            onClick={() => setLoginForm(!loginForm)}
            >
            Or Don't Have An Account? Click Here
          </p>
        </form>
      </div>) :
        <div className='signup-wrapper'>
          <h2 className='title'>Sign Up on <span style={{ color: "var(--theme)" }}>FinTrack</span></h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"John Doe"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className='p-login'>OR</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Signup using Google"}
              blue={true}
            />
            <p className='p-login' 
            style={{cursor:"pointer"}}
            onClick={() => setLoginForm(!loginForm)}>
              Or Have An Account Already? Click Here
              </p>
          </form>
        </div>}
    </>
  )
}

export default SignupSigninComponent
