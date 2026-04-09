import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Admin from "./pages/ Admin"
import Header from "./components/Header"
import Shopping from "./pages/Cart.tsx"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Approved from "./pages/ApproveProduct.tsx"
import {useEffect, useState} from "react";
import LeftSide from "./pages/backLeftSide.tsx"
import SearchResult from "./pages/SearchResult"
import Buy from "./pages/BuyProduct"


function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        const saved = localStorage.getItem("token");
        if (saved) setToken(saved);
    }, []);

    return (
        <BrowserRouter>

            <Header />

            <Routes>
                <Route path="/" element={<Home token={token}/>} />
                <Route path="/login" element={<Login setToken={setToken}/>} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/backLeftSide" element={<LeftSide />} />
                <Route path="/searchresult" element={<SearchResult />} />
                <Route path="/approved" element={<Approved />}/>
                <Route path="/buyproduct" element={<Buy />}/>
                <Route path="/shopping" element={<Shopping initialProducts={[]} />}

                />
            </Routes>

        </BrowserRouter>
    )
}

export default App