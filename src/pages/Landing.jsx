import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      const header = document.getElementById('landing-header');
      if (header && window.scrollY > 50) {
        header.classList.add('scrolled');
      } else if (header) {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header" id="landing-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">🎓</div>
            <span>Raamu</span>
          </Link>
          <nav className="nav">
            <a href="#features" className="nav-link" onClick={(e) => scrollToSection(e, 'features')}>
              Features
            </a>
            <a href="#how-it-works" className="nav-link" onClick={(e) => scrollToSection(e, 'how-it-works')}>
              How It Works
            </a>
            <a href="#testimonials" className="nav-link" onClick={(e) => scrollToSection(e, 'testimonials')}>
              Reviews
            </a>
            <a href="#pricing" className="nav-link" onClick={(e) => scrollToSection(e, 'pricing')}>
              Pricing
            </a>
            <Link to="/dashboard" className="cta-btn">
              Start Learning Free →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>See Physics Come Alive in 3D</h1>
            <p>
              Interactive simulations + AI companion for Andhra Pradesh students. Master your board exams and JEE/NEET with confidence.
            </p>
            <div className="hero-cta">
              <Link to="/dashboard" className="cta-btn">
                Get Started Free →
              </Link>
              <a href="#demo" className="cta-btn cta-btn-secondary" onClick={(e) => scrollToSection(e, 'demo')}>
                Watch Demo (2 min)
              </a>
            </div>
            <div className="trust-badges">
              <div className="trust-badge">
                <span>✓</span>
                <span>100% AP Board Aligned</span>
              </div>
              <div className="trust-badge">
                <span>🌐</span>
                <span>Telugu + English</span>
              </div>
              <div className="trust-badge">
                <span>🆓</span>
                <span>Free Forever</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-demo">
              <div className="demo-screen">
                <div className="demo-icon">🔬</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <span className="section-badge">Why Choose Raamu?</span>
          <h2>Learning Reimagined for You</h2>
          <p>Everything you need to excel in your studies, all in one place</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Digital Textbook Twin</h3>
            <p>Your exact SCERT textbook, digitized and enhanced. Every page, every diagram, now interactive and searchable.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔬</div>
            <h3>3D Digital Twins</h3>
            <p>See invisible forces, molecular bonds, and dynamic processes in stunning 3D. Manipulate variables and experiment risk-free.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>24/7 AI Co-Pilot</h3>
            <p>Your personal learning companion powered by Gemini AI. Get instant explanations, translations, and personalized help.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Bilingual Support</h3>
            <p>Learn in Telugu or English—or both! Switch languages instantly without losing your place.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Exam Ready</h3>
            <p>Board concepts mapped directly to JEE/NEET questions. Master both with one platform.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Know exactly where you stand. See your strengths, identify gaps, and celebrate milestones.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header">
          <span className="section-badge">Simple & Powerful</span>
          <h2>Start Learning in 4 Easy Steps</h2>
          <p>From signup to mastery in minutes</p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up Free</h3>
            <p>Create your account in 30 seconds. No credit card needed.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Your Grade</h3>
            <p>Select Grade 8-12 and your stream (MPC/BiPC).</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Pick a Chapter</h3>
            <p>Start with any chapter from Physics, Chemistry, Biology, or Math.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Learn & Explore</h3>
            <p>Read, interact with 3D labs, ask AI questions, and master concepts!</p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo-section" id="demo">
        <div className="demo-container">
          <div className="demo-content">
            <div className="demo-text">
              <h2>Experience the Friction Lab</h2>
              <p>See how forces, mass, and surface types affect motion in real-time. This is just one of many interactive Digital Twins.</p>
              <ul className="demo-features-list">
                <li>
                  <span>✓</span>
                  <span>Adjust applied force, mass, and friction coefficient</span>
                </li>
                <li>
                  <span>✓</span>
                  <span>Watch real-time motion and measurements</span>
                </li>
                <li>
                  <span>✓</span>
                  <span>Visualize force vectors dynamically</span>
                </li>
              </ul>
              <Link to="/dashboard" className="cta-btn demo-cta-btn">
                Try Friction Lab Now →
              </Link>
            </div>
            <div className="demo-preview">
              <div className="demo-preview-inner">
                <div className="play-btn">▶</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="section-header">
          <span className="section-badge">Student Success Stories</span>
          <h2>What Students Are Saying</h2>
          <p>Real feedback from AP students using Raamu</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "I finally understand friction! The 3D simulation made it so clear. My test score improved from 65% to 92% in one month."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div className="author-info">
                <h4>Priya Sharma</h4>
                <p>Grade 10, Vijayawada</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "The Telugu support is amazing! I can learn in my mother tongue and then switch to English for exams. Best of both worlds."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div className="author-info">
                <h4>Ravi Kumar</h4>
                <p>Grade 9, Guntur</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "The AI tutor is like having a personal teacher 24/7. It explains things in simple language and never gets tired of my questions!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div className="author-info">
                <h4>Ananya Reddy</h4>
                <p>Grade 11, Tirupati</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="section-header">
          <span className="section-badge">Simple Pricing</span>
          <h2>Choose Your Plan</h2>
          <p>Start free, upgrade when you're ready</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free Forever</h3>
            <p>Perfect for getting started</p>
            <div className="price">₹0</div>
            <div className="price-period">Forever free</div>
            <ul className="features-list">
              <li>Full digital textbook access</li>
              <li>3 Digital Twins per month</li>
              <li>10 AI questions per day</li>
              <li>Progress tracking</li>
              <li>Bilingual support (EN/TE)</li>
            </ul>
            <Link to="/dashboard" className="cta-btn pricing-cta-btn">
              Get Started Free →
            </Link>
          </div>

          <div className="pricing-card featured">
            <span className="pricing-badge">Most Popular</span>
            <h3>Premium</h3>
            <p>For serious students</p>
            <div className="price">₹299</div>
            <div className="price-period">per month</div>
            <ul className="features-list">
              <li>Everything in Free, plus:</li>
              <li>Unlimited Digital Twins</li>
              <li>Unlimited AI questions</li>
              <li>JEE/NEET question bank</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Ad-free experience</li>
            </ul>
            <Link to="/dashboard" className="cta-btn pricing-cta-btn">
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <h2>Ready to Transform Your Learning?</h2>
        <p>Join 10,000+ students already mastering their subjects with Raamu</p>
        <div className="cta-buttons">
          <Link to="/dashboard" className="cta-btn cta-btn-white">
            Start Learning Free →
          </Link>
          <a href="#demo" className="cta-btn cta-btn-secondary" onClick={(e) => scrollToSection(e, 'demo')}>
            Watch Demo
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Raamu</h3>
            <p>
              Empowering every student in India to achieve mastery in both conceptual understanding and exam performance through AI-powered, interactive learning.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">📺</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a></li>
              <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a></li>
              <li><a href="#">Digital Twins</a></li>
              <li><a href="#">AI Co-Pilot</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">API Docs</a></li>
              <li><a href="#">Curriculum</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Raamu. All rights reserved. Made with ❤️ in India.</p>
          <p>Aligned with AP SCERT Curriculum</p>
        </div>
      </footer>
    </div>
  );
}
