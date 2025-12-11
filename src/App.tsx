import { useState, useMemo } from 'react'
import './App.css'
import RubiksCube, { type CubeColor, type CubeFace, type CubeSticker } from './components/RubiksCube'

const factPool: Array<Pick<CubeSticker, 'title' | 'description'>> = [
  {
    title: 'Strategic Data Integration Intern',
    description:
      'Interned at Orbis Operations, engineering Python-based data integrations that authenticated, structured, and delivered real-time device intelligence for operational use cases.'
  },
  {
    title: 'Beacon Adapter Engineer',
    description:
      'Designed a Teltonika Beacon → Catalyst adapter using Flask, GraphQL, Docker, JWT authentication, and Postman to securely ingest, validate, and transform raw telemetry into analyst-ready data.'
  },
  {
    title: 'Real-Time Device Data Streaming',
    description:
      'Deployed a fully containerized backend service on Fly.io, enabling live beacon and GPS streaming via GraphQL endpoints and ensuring reliable data flow for field analysis.'
  },
  {
    title: 'Data Science at GWU',
    description:
      'Pursuing a B.S. in Data Science with hands-on experience in Python, R, SQL, Pandas, NumPy, machine learning fundamentals, and analytical problem-solving.'
  },
  {
    title: 'Communication Minor Advantage',
    description:
      'Minoring in Communication, giving me the ability to translate complex technical systems—APIs, pipelines, deployments—into clear explanations for non-technical stakeholders.'
  },
  {
    title: 'Strong Technical Toolkit',
    description:
      'Skilled in Python, R, SQL, Java, Flask, GraphQL, Docker, JWT auth, MongoDB, Neo4j, Fly.io, Git/GitHub, Postman, Regex, Pandas, NumPy, Matplotlib, tidyverse, and ggplot2.'
  },
  {
    title: 'Data Warehousing & Modeling',
    description:
      'Built relational and NoSQL schemas, designed ETL pipelines in Python, evaluated query performance, and compared SQL vs. MongoDB designs using datasets with 15,000+ rows.'
  },
  {
    title: 'AI & LLM Experimentation',
    description:
      'Conducted structured evaluations across GPT, Claude, and DeepSeek using reproducible testing, reasoning prompts, robustness checks, and analytic scoring to study model behavior.'
  },
  {
    title: 'Visualization & Storytelling',
    description:
      'Developed narrative-driven visualizations using Matplotlib, ggplot2, and tidyverse to turn complex data into insights that support decision-making.'
  },
  {
    title: 'Library Data Analysis',
    description:
      'Used Python, Pandas, and SQL to analyze digital circulation data for the Warren Library Association, generating insights that informed budgeting and content strategy.'
  },
  {
    title: 'Founder of The Backpack Project',
    description:
      'Founded and independently ran The Backpack Project for five years, leveraging social media outreach to raise over $10,000 for OpenDoors Asheville to support under-resourced K–12 students.'
  },
  {
    title: 'Alpha Phi Leadership',
    description:
      'Led New Member Education and Member Experience, managing programming, mentorship, and chapter operations while supporting 100+ members through structured communication.'
  },
  {
    title: 'Team Player by Design',
    description:
      'Growing up with six siblings taught me natural collaboration, adaptability, communication, and conflict resolution—core strengths in technical teamwork environments.'
  },
  {
    title: 'Calm Under Pressure',
    description:
      'Whether debugging Flask endpoints, troubleshooting Docker deployments, or resolving API failures, I stay steady, analytical, and focused on root-cause solutions.'
  },
  {
    title: 'Rubik\'s Cube Thinker',
    description:
      'My love for solving Rubik\'s cubes reflects my engineering mindset: structured problem-solving, pattern recognition, and persistence.'
  },
  {
    title: 'Fast, Curious Learner',
    description:
      'Rapidly self-taught tools like GraphQL, Docker, JWT auth, Fly.io deployment, and Neo4j by studying documentation, experimenting, and iterating through hands-on prototypes.'
  },
  {
    title: 'Mission-Driven Engineer',
    description:
      'Most motivated when building tools that help real users—analysts, operators, or communities—and create meaningful improvements in their workflows.'
  },
  {
    title: 'Creative Problem Solver',
    description:
      'As a hired mural artist, I bring strong visual reasoning, attention to detail, and project execution skills that enhance the creativity I apply in technical problem-solving.'
  },
  {
    title: 'Discipline & Dedication',
    description:
      'I maintain a strong sense of discipline through consistent training and long-term goal-setting, which translates into focused problem-solving, reliability, and follow-through in technical work.'
  },
  {
    title: 'Clear Communicator & Presenter',
    description:
      'Experienced in presenting backend architectures, data workflows, and technical decisions, with the ability to distill complex systems into simple, actionable explanations.'
  }
]

// Generate all 54 stickers (3×3×6 faces)
function generateAllStickers(): CubeSticker[] {
  const faces: CubeFace[] = ['front', 'back', 'left', 'right', 'top', 'bottom']
  const stickers: CubeSticker[] = []
  let id = 1
  let factIndex = 0

  // Standard Rubik's Cube center color mapping
  const centerColorMap: Record<CubeFace, CubeColor> = {
    front: 'white',
    back: 'yellow',
    right: 'red',
    left: 'orange',
    top: 'blue',
    bottom: 'green'
  }

  // Color distribution: each face gets a mix of colors
  const colorPattern: CubeColor[][] = [
    ['white', 'red', 'blue', 'green', 'yellow', 'orange', 'blue', 'white', 'green'], // front
    ['red', 'blue', 'green', 'yellow', 'orange', 'white', 'green', 'red', 'blue'], // back
    ['green', 'yellow', 'orange', 'white', 'red', 'blue', 'orange', 'green', 'yellow'], // left
    ['yellow', 'orange', 'white', 'red', 'blue', 'green', 'white', 'yellow', 'orange'], // right
    ['orange', 'white', 'red', 'blue', 'green', 'yellow', 'red', 'orange', 'white'], // top
    ['blue', 'green', 'yellow', 'orange', 'white', 'red', 'yellow', 'blue', 'green'] // bottom
  ]

  for (const face of faces) {
    const faceColorPattern = colorPattern[faces.indexOf(face)]
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col
        const fact = factPool[factIndex % factPool.length]
        
        // Use center color if this is the center sticker (row=1, col=1), otherwise use pattern
        const isCenter = row === 1 && col === 1
        const color = isCenter ? centerColorMap[face] : faceColorPattern[index]

        stickers.push({
          id: id++,
          face,
          row,
          col,
          color,
          title: fact.title,
          description: fact.description
        })

        factIndex++
      }
    }
  }

  return stickers
}

// Get color value for accent
function getColorValue(color: CubeColor): string {
  const colorMap: Record<CubeColor, string> = {
    red: '#e74c3c',
    blue: '#3498db',
    green: '#2ecc71',
    yellow: '#f1c40f',
    orange: '#e67e22',
    white: '#ecf0f1'
  }
  return colorMap[color]
}

const skills = [
  { title: 'Data Science', description: 'Python, R, statistical analysis, and machine learning' },
  { title: 'Software Development', description: 'Full-stack development with modern frameworks' },
  { title: 'Communication', description: 'Technical writing and presenting to diverse audiences' },
  { title: 'Leadership', description: 'Team management and program design experience' },
  { title: 'Data Visualization', description: 'Creating clear, impactful dashboards and stories' },
  { title: 'Problem Solving', description: 'Breaking down complex challenges into solutions' }
]

const projects = [
  {
    title: 'Beacon Adapter Platform',
    description: 'Real-time data integration system built with Flask, GraphQL, and deployed on Fly.io',
    link: '#'
  },
  {
    title: 'Library Analytics Project',
    description: 'Data analysis for collection strategy and budgeting decisions',
    link: '#'
  },
  {
    title: 'LLM Comparison Research',
    description: 'Experimental framework for evaluating language models across multiple dimensions',
    link: '#'
  }
]

function App() {
  const allStickers = useMemo(() => generateAllStickers(), [])
  const [selectedSticker, setSelectedSticker] = useState<CubeSticker | null>(null)

  const handleSelectSticker = (stickerId: number) => {
    const sticker = allStickers.find((s) => s.id === stickerId)
    if (sticker) {
      setSelectedSticker(selectedSticker?.id === stickerId ? null : sticker)
    }
  }

  return (
    <div className="page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <a href="#about" className="nav-link">About</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Hero Title Section */}
      <section className="hero-title-section">
        <div className="hero-title-blob"></div>
        <h1 className="hero-title">Why Ava is Awesome!</h1>
      </section>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-text">
              <h1 className="hero-heading">Why You Should Hire Me</h1>
              <p className="hero-intro">
                I'm a data scientist in training who approaches problems like a Rubik's cube: 
                methodically, creatively, and with persistence. Click any sticker to discover what makes me unique.
              </p>
              <p className="hero-subtext">
                Rotate the cube to explore different facets of my experience, skills, and personality.
              </p>
            </div>
            <div className="hero-cube-card">
              <RubiksCube 
                allStickers={allStickers}
                onSelectSticker={handleSelectSticker}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Card (appears when sticker is selected) */}
      {selectedSticker && (
        <div className="info-card-wrapper">
          <div className="info-card">
            <div 
              className="info-tag" 
              style={{ backgroundColor: getColorValue(selectedSticker.color) }}
            ></div>
            <button 
              className="info-close"
              onClick={() => setSelectedSticker(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="info-title">{selectedSticker.title}</h2>
            <p className="info-body">{selectedSticker.description}</p>
          </div>
        </div>
      )}

      {/* About Section */}
      <section id="about" className="section">
        <div className="section-container">
          <h2 className="section-heading">Documenting My Work With Intention</h2>
          <div className="section-content">
            <p className="section-text">
              I believe in the power of thoughtful design, clear communication, and intentional problem-solving. 
              My work spans data science, software development, and leadership—each project an opportunity to 
              learn, grow, and create meaningful impact.
            </p>
            <p className="section-text">
              Whether I'm building a real-time data adapter, analyzing library circulation patterns, or 
              designing programs for my community, I approach every challenge with curiosity and care. 
              This portfolio reflects that mindset: structured yet creative, technical yet human.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section section-alt">
        <div className="section-container">
          <h2 className="section-heading">Core Strengths</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-card">
                <h3 className="skill-title">{skill.title}</h3>
                <p className="skill-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="section-container">
          <h2 className="section-heading">Recent Work</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <a href={project.link} className="project-link">View more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <h2 className="contact-heading">Let's Connect</h2>
          <p className="contact-text">
            If you'd like to learn more about my work, collaborate, or just say hi, here's how to reach me.
          </p>
          <div className="contact-list">
            <div className="contact-item">
              <span className="contact-label">LinkedIn</span>
              <a 
                href="https://www.linkedin.com/in/ava-mcclinton-376233259/" 
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                linkedin.com/in/ava-mcclinton-376233259
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <div className="contact-email-group">
                <a href="mailto:avamcclinton@gmail.com" className="contact-link">
                  Personal: avamcclinton@gmail.com
                </a>
                <a href="mailto:ava.mcclinton@gwu.edu" className="contact-link">
                  School: ava.mcclinton@gwu.edu
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href="tel:8287727574" className="contact-link">
                828-772-7574
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
