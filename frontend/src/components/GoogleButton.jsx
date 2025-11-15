import "../styles/AuthLayout.css";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton({ text }) {
  return (
    <button className="google-btn">
      <img src={FcGoogle} alt="google" className="google-icon" />
      {text}
    </button>
  );
}
