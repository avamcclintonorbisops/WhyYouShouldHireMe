import { useState, useMemo } from 'react'
import './App.css'
import RubiksCube, { type CubeColor, type CubeFace, type CubeSticker } from './components/RubiksCube'

const factPool: Array<Pick<CubeSticker, 'title' | 'description'>> = [
  {
    title: 'Strategic Data Integration Intern',
    description:
      'Interned at Orbis Operations as a Strategic Data Integration Intern, building a Teltonika Eye Beacon adapter from scratch.'
  },
  {
    title: 'Beacon Adapter Project',
    description:
      'Designed and deployed a Flask + GraphQL + JWT adapter on Fly.io to stream real beacon data into the Catalyst platform.'
  },
  {
    title: 'Data Science at GWU',
    description:
      'Pursuing a B.S. in Data Science at The George Washington University, combining analytics with communication and policy.'
  },
  {
    title: 'Communications Minor',
    description:
      'Minoring in Communication, which helps me explain complex technical ideas clearly to non-technical audiences.'
  },
  {
    title: 'Technical Toolkit',
    description:
      'Hands-on experience with Python, R, SQL, MongoDB, Neo4j, REST APIs, Docker, GitHub, and cloud-hosted apps.'
  },
  {
    title: 'Data Warehousing & Modeling',
    description:
      'Built end-to-end data warehousing projects, including schema design, ETL, and performance comparisons across SQL and NoSQL.'
  },
  {
    title: 'AI & LLM Experiments',
    description:
      'Designed experiments comparing GPT, Claude, DeepSeek, and other LLMs across summarization, reasoning, and prompt robustness.'
  },
  {
    title: 'Visualization & Storytelling',
    description:
      'Created data visualizations and dashboards that prioritize clarity, narrative flow, and decision-making impact.'
  },
  {
    title: 'Library Data Analysis',
    description:
      'Analyzed e-material hold and circulation patterns for the Warren Library Association to guide budgeting and collection strategy.'
  },
  {
    title: 'Backpack Project Founder',
    description:
      'Founded the Backpack Project to provide school supplies to under-resourced K-12 students in Asheville, NC.'
  },
  {
    title: 'Alpha Phi Leadership',
    description:
      'Served as Vice President of New Member Education and Member Experience for Alpha Phi, designing programs and mentoring members.'
  },
  {
    title: 'Team Player by Design',
    description:
      'I have six siblings, so I grew up learning how to communicate, compromise, and function as part of a team.'
  },
  {
    title: 'Calm Under Pressure',
    description:
      'I\'m steady when things break - whether it\'s a bug in production or a last-minute change, I focus on problem solving, not panic.'
  },
  {
    title: 'Rubik\'s Cube Mindset',
    description:
      'I genuinely love Rubik\'s cubes and puzzles - this site reflects how I think: curious, structured, and persistent.'
  },
  {
    title: 'Curious Learner',
    description:
      'I actively seek out new tools, frameworks, and ideas and learn them quickly through documentation, experimentation, and feedback.'
  },
  {
    title: 'Mission-Driven Work',
    description:
      'I\'m most motivated when the work helps real people - analysts, operators, students, or community members.'
  },
  {
    title: 'Creative Outside of Tech',
    description:
      'I love cooking, painting, and designing aesthetics for spaces and projects, which helps me bring creativity into technical work.'
  },
  {
    title: 'Movement',
    description:
      'I enjoy working out and running, which keeps my energy up and my brain sharp for deep-focus work.'
  },
  {
    title: 'Global Perspective',
    description:
      'Spending time abroad and traveling has made me comfortable adapting quickly and collaborating with people from different backgrounds.'
  },
  {
    title: 'Communication & Presenting',
    description:
      'Comfortable presenting to technical and non-technical audiences and distilling complex systems into simple stories and visuals.'
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
