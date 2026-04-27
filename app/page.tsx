import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Aquarium Demo</h1>
      <p>Welcome to the React Three Fiber Aquarium</p>
      <Link 
        href="/aquarium" 
        style={{
          display: "inline-block", 
          padding: "10px 20px", 
          background: "#00aaff", 
          color: "#fff", 
          textDecoration: "none", 
          borderRadius: "8px",
          marginTop: "20px"
        }}
      >
        Enter Aquarium
      </Link>
    </div>
  );
}