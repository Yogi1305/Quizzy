import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import './App.css'
import LoginForm from './component/Login'
import QuestionForm from './component/Question'
import RegistrationForm from './component/Register'
import Contest from "./component/Contest";
import ContestQuestion from "./component/ContestQuestion";
import Home from "./component/Home";

import QuizResults from "./component/QuizResults";
import ContestCreation from "./component/ContestCreation";
import { ToastContainer } from "react-toastify";
import About from "./component/Portfolio";
import Portfolio from "./component/Portfolio";


const router=createBrowserRouter([
  {
    path:"/register",
    element:<RegistrationForm/>
  },
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<LoginForm/>
  },
  {
    path:"/Question",
    element:<QuestionForm/>
  },{
    path:"/contest",
    element:<Contest/>
  },{
    path:"/ContestQuestion",
    element:<ContestQuestion/>
  },{
    path:"/result",
    element:<QuizResults/>
  },{
    path:"/createcontest",
    element:<ContestCreation/>
  },{
    path:"/about",
    element:<Portfolio/>
  }
]);

function App() {


  return (
    
    <div className='w-lg h-screen  bg-cyan-200'>
      
     <ToastContainer/>
      <RouterProvider router={router}/>
      
       
    </div>
  )
}

export default App
