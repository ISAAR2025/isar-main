import './About.css';
import { Helmet } from 'react-helmet';
import journeyImage from  '../s6.jpg'; // Update with your image path
import valuesImage from  '../s2.png'; // Update with your image path
import mission from  '../s3.png'; // Update with your image path

const About = () => (
<>
  <Helmet>
        <title>INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS</title>
      <meta
      name="description"
      content="Learn about ISAR - Indian Scientific Aerospace and Robotics. We provide certified drone, robotics, and aerospace programs for students in India."
    />
    <meta
      name="keywords"
      content="about ISAR, drone institute India, robotics internship, UAV courses, aerospace education, STEM training"
    />
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="ISAR | Best Drone Training in India" />
        <meta
          property="og:description"
          content="Learn drone flying, aerial survey, and robotics from certified experts at ISAR – Indian Scientific Aerospace and Robotics."
        />
        <meta property="og:image" content="/isar-preview.png" />
        <meta property="og:url" content="https://www.isar.in" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ISAR | Drone Training Institute in India" />
        <meta name="twitter:description" content="Expert drone pilot training in Chennai at ISAR. Join India's top aerospace and robotics institute." />
        <meta name="twitter:image" content="/isar-preview.png" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "ISAR - Indian Scientific Aerospace and Robotics",
            "image": "https://www.isar.in/isar-preview.png",
            "url": "https://www.isaar.in",
            "telephone": "+91-6374720788",
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
      <section className="about-header" data-aos="fade-down">
  <h2>About ISAR</h2>
  <p>
    INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS (ISAR) is a premier institute committed to advancing drone, aerospace, and robotics education across India. 
    We bridge the gap between theoretical learning and hands-on industrial experience through cutting-edge training programs, research, and innovation.
  </p>
</section>
  <section className="about-zigzag">
  <div className="zigzag-block left" data-aos="fade-up">
    <img src={mission} alt="Mission" className="zigzag-img" />
    <div className="zigzag-text" data-aos="zoom-in">
      <h3>Our Mission and Vision</h3>
      <p>At INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS, we are dedicated to providing top-tier drone technology training and theoretical knowledge to aspiring individuals. Our goal is to empower students, parents, and undergraduates with the skills needed to excel in the field of drones.</p>
    </div>
  </div>

  <div className="zigzag-block right" data-aos="flip-left">
    <img src={journeyImage} alt="Journey" className="zigzag-img" />
    <div className="zigzag-text" data-aos="slide-up">
      <h3>Our Journey</h3>
      <p>Established with a passion for innovation and education, INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS has been at the forefront of drone technology training. Our commitment to excellence has driven us to create a platform that nurtures talent and fosters growth.</p>
    </div>
  </div>

  <div className="zigzag-block left" data-aos="fade-up-right">
    <img src={valuesImage} alt="Core Values" className="zigzag-img" />
    <div className="zigzag-text" data-aos="zoom-in-up">
      <h3>Our Core Values</h3>
      <p>At INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS, we uphold integrity, innovation, and excellence in all aspects of our learning  programs. We are committed to providing a nurturing environment that fosters learning and growth.


</p>
    </div>
  </div>
</section>


  </>
);

export default About;
