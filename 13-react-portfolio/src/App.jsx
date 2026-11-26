import { useState } from "react";
import { aboutInfo, skillsList, projectList } from "./data/portfolioData";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleForm(e) {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="wrap">
      <header className="topbar">
        <h3>{aboutInfo.name}</h3>
        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="about" className="sec">
        <h1>Hi, I am {aboutInfo.name}</h1>
        <p className="sub">{aboutInfo.course} | {aboutInfo.location}</p>
        <p>{aboutInfo.bio}</p>
      </section>

      <section id="skills" className="sec">
        <h2>Skills</h2>
        <div className="grid">
          {skillsList.map((s) => (
            <div key={s.group} className="card">
              <h4>{s.group}</h4>
              <p>{s.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="sec">
        <h2>Projects</h2>
        <div className="grid">
          {projectList.map((p) => (
            <div key={p.name} className="card">
              <h4>{p.name}</h4>
              <small>{p.tech}</small>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="sec">
        <h2>Contact</h2>
        {submitted && <p className="ok">Thanks! Your message has been noted.</p>}
        <form onSubmit={handleForm} className="cform">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
          <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" required />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
}

export default App;
