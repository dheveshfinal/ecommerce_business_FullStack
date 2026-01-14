import { BrowserRouter,Routes,Route } from "react-router-dom";
import Signup_user from "./components/signup"
import Login from "./components/login_user"
import BuyDash from "./components/buyerDash"
import Payment from "./components/User_payment"
import AdminDash from "./components/admin"
import Add_image from "./components/adminaddimage"
import Add_admin_image from "./components/addnewimage"
import "./App.css"



const App=()=>{
  return(
<BrowserRouter>
<Routes>
  <Route path="/" element={<Signup_user/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/buyerDash/:id" element={<BuyDash/>}/>
  <Route path="/payment/:userId" element={<Payment/>}/>
  <Route path="/sellerDash/:user_id" element={<AdminDash/>}/>
  <Route path="/addimage/:user_id" element={<Add_image/>}/>
  <Route path="/addnewimage/:productId/:user_id" element={<Add_admin_image/>}/>
</Routes>
</BrowserRouter>
  )
}


export default App;