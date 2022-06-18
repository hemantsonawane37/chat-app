import "./App.css";
import Homepage from "./pages/Home";
import { Route,Routes} from "react-router-dom";
import Chatpage from "./pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Homepage/>}  />
      <Route path="/chats" element={<Chatpage/>} />
      </Routes> 
    </div>
  );
}

export default App;