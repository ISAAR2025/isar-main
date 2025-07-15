import { useState } from 'react';
import { Helmet } from 'react-helmet';
import './Hero.css';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import gallery1 from '../G1.JPG';
import gallery2 from '../g2.JPG';
import gallery3 from '../g3.JPG';
import gallery4 from '../g4.JPG';
import gallery5 from '../g5.JPG';
import gallery6 from '../Screenshot 2025-05-27 124356.png';
import gallery7 from '../g6.JPG';
import gallery8 from '../g7.JPG';
import gallery9 from '../g8.JPG';
import gallery10 from '../g9.JPG';
import gallery11 from '../g10.JPG';
import gallery12 from '../g11.JPG';
import gallery13 from '../g12.JPG';



import imageStudents from '../s8.jpg';
import imageOffer from '../s9.jpg';

import bannerImage from '../IMP1.jpeg';

import img1 from '../D1.jpeg';
import img2 from '../D2.jpeg';
import img3 from '../D3.jpeg';
import img4 from '../D4.jpeg';
import img5 from '../D5.jpeg';
import img6 from '../D6.jpeg';

import img7 from '../G20.jpeg';
import img9 from '../CGG.jpeg';
import img10 from '../AM.jpeg';
import img11 from '../UL.jpeg';

import About from './About';


const Hero = () => {
  const navigate = useNavigate();
  const handleServicesClick = () => navigate('/courses');

  const galleryItems = [
    { type: 'image', src: gallery1 },
    { type: 'image', src: gallery2 },
    { type: 'image', src: gallery3 },
    { type: 'image', src: gallery4 },
    { type: 'image', src: gallery5 },
    { type: 'image', src: gallery6 },
    { type: 'image', src: gallery7 },
    { type: 'image', src: gallery8 },
    { type: 'image', src: gallery9 },
    { type: 'image', src: gallery10 },
    { type: 'image', src: gallery11 },
    { type: 'image', src: gallery12 },
    { type: 'image', src: gallery13 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? galleryItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === galleryItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <Helmet>
        <title>INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS</title>
        <meta
          name="description"
          content="Join ISAR – the top drone training center in India offering expert-led courses in drone technology, aerospace, and robotics. Enroll in Chennai’s leading drone institute today."
        />
        <meta
          name="keywords"
          content="best drone training center in Chennai, drone training in India, drone pilot certification, aerospace training, ISAR"
        />
        <meta property="og:title" content="ISAR | Best Drone Training in India" />
        <meta property="og:description" content="Learn drone flying, aerial survey, and robotics from certified experts at ISAR – Indian Scientific Aerospace and Robotics." />
        <meta property="og:image" content="/isar-preview.png" />
        <meta property="og:url" content="https://www.isar.in" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ISAR | Drone Training Institute in India" />
        <meta name="twitter:description" content="Expert drone pilot training in Chennai at ISAR. Join India's top aerospace and robotics institute." />
        <meta name="twitter:image" content="/isar-preview.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "ISAR - Indian Scientific Aerospace and Robotics",
            "image": "https://www.isar.in/isar-preview.png",
            "url": "https://www.isaar.in",
            "telephone": "+91-6374720788",
            "logo": "https://www.isaar.in/logo1.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "339/2 at kurunji Nagar Valayapatti, Mohanur , Namakkal District, Tamil Nadu",
              "addressLocality": "Chennai",
              "addressRegion": "Tamil Nadu",
              "postalCode": "637020",
              "addressCountry": "IN"
            },
            "description": "Top drone training center in India, offering hands-on certification in drone tech, robotics, and aerospace.",
            "sameAs": ["https://www.instagram.com/_isar_25"]
          })}
        </script>
      </Helmet>

      <motion.section
        id="hero"
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="hero-animation">
          <Spline className='spline' scene="https://prod.spline.design/9TLmRe8so0bDROmV/scene.splinecode" />
          <motion.div
            className="hero-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1>Welcome to ISAR</h1>
            <h3>Explore the Future of Drone Technology</h3>
          </motion.div>
          <motion.div
            className="contact-button-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="ebtn" onClick={handleServicesClick}>
              Explore Our Services
            </button>
          </motion.div>
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            We specialize in drone research, pilot training, aerial surveys, and industrial solutions.
            Discover how our technology is revolutionizing industries.
          </motion.p>
        </div>
      </motion.section>
      
      <About />

      <section className="home-highlights">
        {[ {
          title: " Empowering Students Across India",
          img: imageStudents,
          content: (
            <>
              <p>Whether you're a curious school kid or a future-ready engineering student, <strong>ISAR</strong> is committed to nurturing innovation at every level of education.</p>
              <ul>
                <li> <strong>For School Students:</strong> STEM workshops in drone flying, basic robotics, and aerodynamics.</li>
                <li><strong>High School:</strong> UAV technology, drone safety, flight simulation.</li>
                <li><strong>Engineering Students:</strong> Drone assembly, AI navigation, mapping & more.</li>
                <li><strong>Partnerships:</strong> Faculty training, internships, certifications.</li>
                <li> <strong>Real Projects:</strong> Competitions, surveys, missions.</li>
              </ul>
            </>
          )
        }, {
          title: "🌐 What We Offer",
          img: imageOffer,
          content: (
            <>
            <ul>

                <li>Robotics Workshops.</li>
                <li>Aerospace Projects.</li>
                <li>Industrial Surveys.</li>
                <li>Educational Collaborations with colleges & schools.</li>
            </ul>
            </>
          )
        }].map((block, index) => (
          <motion.div
            className="highlight-block"
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ flexDirection: index % 2 === 1 ? 'row-reverse' : 'row' }}
          >
            <motion.img
              src={block.img}
              alt={block.title}
              className="highlight-img"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="highlight-text"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2>{block.title}</h2>
              {block.content}
            </motion.div>
          </motion.div>
        ))}
      </section>
        <section className="hs" data-aos="fade-up">
        <img src={bannerImage} alt="ISAR Banner" className="highlight-image"  />
        <div className="hc">
          <h2 className="gt">Global Investors Summit 2025 – Madhya Pradesh</h2>
          <p className="hd">
            We are proud to be part of Madhya Pradesh’s journey towards becoming a global investment destination. Our Chairman’s engagement with Dr Mohan Yadav the Hon’ble Chief Minister of Madhya Pardesh reflects our commitment to contributing to the state’s economic growth and innovation ecosystem
          </p>
        </div>
      </section>


      <section className="gs">
  <h2 className="gt">Global Police Summit 2025 – Dubai, UAE</h2>
  <p className="gd">
     Our Chairman participated in the Global Police Summit in Dubai, a premier international forum on security technology, public safety, AI surveillance, and law enforcement innovation.
There, she engaged with:
Senior officials from global police forces,
Industry leaders in AI, drone technology, cyber security, and smart policing &
Delegations from over 50 countries.
The visit aligns with the company’s commitment to developing cutting-edge solutions for national and public safety, and to foster international cooperation in policing technologies.</p>
  <div className="ig">
    <div className="card" data-aos="fade-up">
      <img src={img1} alt="Gallery 1" className="gi" />
    </div>
    <div className="card" data-aos="fade-up" data-aos-delay="50">
      <img src={img2} alt="Gallery 2" className="gi" />
    </div>
    <div className="card" data-aos="fade-up" data-aos-delay="100">
      <img src={img3} alt="Gallery 3" className="gi" />
    </div>
    <div className="card" data-aos="fade-up" data-aos-delay="150">
      <img src={img4} alt="Gallery 4" className="gi" />
    </div>
    <div className="card" data-aos="fade-up" data-aos-delay="200">
      <img src={img5} alt="Gallery 5" className="gi" />
    </div>
    <div className="card" data-aos="fade-up" data-aos-delay="250">
      <img src={img6} alt="Gallery 6" className="gi" />
    </div>
  </div>
</section>



    <section className="hss-wrapper">
  <div className="hss" data-aos="fade-up">
    <img src={img7} alt="ISAR Banner" className="hii" />
    <div className="hcc">
      <h2 className="htt">G20 Summit 2023 – India</h2>

    </div>
  </div>

  <div className="hss" data-aos="fade-up" data-aos-delay="200">
    <img src={img9} alt="ISAR Banner" className="hii" />
    <div className="hcc">
      <p className="ht">Ms. Praveena D.K., IAS: Vice Chairperson & Managing Director, Gujarat Industrial Development Corporation (GIDC). </p>
      
    </div>
  </div>

  <div className="hss" data-aos="fade-up" data-aos-delay="200">
    <img src={img10} alt="ISAR Banner" className="hii" />
    <div className="hcc">
      <p className="ht">Our Chairperson Meets Jagdish Vishwakarma, Hon’ble Minister for Cottage, Khadi and Rural Industries, Gujarat </p>
      
    </div>
  </div>

  <div className="hss" data-aos="fade-up" data-aos-delay="200">
    <img src={img11} alt="ISAR Banner" className="hii" />
    <div className="hcc">
      <h2 className="htt">University of West London (UWL), UK</h2>
      <p className="hdd">
       During the Global Police Summit in Dubai, our Chairperson proposed a strategic collaboration with the University of West London.
      </p>
    </div>
  </div>
</section>




      <section className="gallery-section">
        <motion.h1
          className="gallery-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Gallery
        </motion.h1>
        <div className="gallery-wrapper">
          <button className="gallery-nav left" onClick={handlePrev}>❮</button>
          <motion.div
            className="gallery-display"
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {galleryItems[currentIndex].type === 'image' ? (
              <img src={galleryItems[currentIndex].src} alt={`Gallery ${currentIndex}`} />
            ) : (
              <video controls>
                <source src={galleryItems[currentIndex].src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </motion.div>
          <button className="gallery-nav right" onClick={handleNext}>❯</button>
        </div>
      </section>
    </>
  );
};

export default Hero;
