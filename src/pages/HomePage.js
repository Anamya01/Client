import { useNavigate } from "react-router-dom";
import './Style.css';
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="description">
        <h1>Welcome to Live Polling System</h1>
        <p>Please describe the role that best describes you to begin using the live pooling system</p>
      </div>
      <div className="options">
      <div className="blocks" onClick={() => navigate("/join?role=teacher")} >
        <h4>I'm a teacher</h4>
        <p>lorem ispsum and i dont know</p>
      </div>
      <div className="blocks" onClick={() => navigate("/join?role=student")} >
      <h4>I'm a teacher</h4>
      <p>lorem ispsum and i dont know</p>
      </div>
      </div>
    </div>
  );
}
