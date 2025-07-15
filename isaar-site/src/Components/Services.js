import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Advanced from '../o1.png';
import Young from '../o2.png';
import Junior from '../o3.png';
import senior from '../o4.png';

import './Services.css';

const Services = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [visibleDetails, setVisibleDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      fetch(`${process.env.REACT_APP_API_URL}/api/auth/courses/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEnrolledCourses(data.courses.map(c => c.course_name));
          } else {
            console.warn("Failed to fetch enrolled courses");
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
        });
    }
  }, []);

  const toggleDetails = (course) => {
    setVisibleDetails(prev => (prev === course ? null : course));
  };

  const courseMap = {
    'Beginner Course': {
      price: 2,
      discount: 0,
      image: Advanced,
      seoContent: (
        <div>
          <p className="intro">
            Take flight with our Beginner’s Drone Course — ideal for students and hobbyists. Learn drone basics, aerodynamics, DIY building, safe flying, and real-world uses. Finish with the skills to design, build, and fly your own drone.
          </p>
          <p><strong>Join us and turn your curiosity into capability — and your capability into opportunity.</strong></p>
          <h2>What You’ll Learn:</h2>
          <ul className="learn-list">
            <li> <strong>Fundamentals:</strong> How drones fly, their components, and their future applications.</li>
            <li> <strong>Design:</strong> Frame, motor, propeller, power source, payload, and controller selection tailored to your mission.</li>
            <li> <strong>Build:</strong> Step-by-step guidance to assemble, test, and troubleshoot your own drone.</li>
            <li> <strong>Innovate:</strong> Insights into sector-specific drone use — from agriculture to emergency response to delivery.</li>
            <li> <strong>Comply:</strong> Up-to-date understanding of global and DGCA (India) drone regulations.</li>
          </ul>
          <h2>Why It Matters:</h2>
          <p>
            Drones are transforming industries worldwide — agriculture, logistics, surveillance, filmmaking, and beyond.
            This course equips you with the foundational skills to participate in and contribute to this exciting revolution.
          </p>
        </div>
      )
    },
    'Junior High': {
      price: 0,
      discount: 0,
      image: Young,
      seoContent: (
        <div>
          <p>The <strong>Junior High program</strong> To Enroll this course contact us:<br />
            <strong>Contact Number: +91 6374720788<br />Email: admin@isaar.in</strong>
          </p>
        </div>
      )
    },
    'Professional and Industrial Course': {
      price: 19999,
      discount: 0,
      image: Junior,
      seoContent: (
        <div>
          <p className="intro">
            Master the future of drones with our Advanced UAV Course — for engineers, pros, and enthusiasts. Dive into advanced aerodynamics, AI navigation, swarming, payloads, and mission planning. Build, optimize, and deploy high-performance UAVs for industrial missions using cutting-edge tech. Lead the way in precision drones and real-time operations.
          </p>
          <p className="highlight">
            <strong>📦 Walk away with the drone worth 10,000/-</strong>
          </p>
          <h2>What You’ll Learn:</h2>
          <ul className="learn-list">
            <li> <strong>Advanced Flight Dynamics:</strong> UAV stability, control algorithms, and environmental effects.</li>
            <li> <strong>Autonomous Systems:</strong> Programming GPS-based and vision-based navigation using ArduPilot/PX4 and ROS.</li>
            <li> <strong>Professional Drone Design:</strong> Configuring UAVs for heavy-lift, endurance, or multi-role missions with industry-grade components.</li>
            <li> <strong>Payload & Sensor Integration:</strong> Incorporating LiDAR, thermal cameras, multispectral sensors, and telemetry systems.</li>
            <li> <strong>Mission Planning & Simulation:</strong> Hands-on simulation classes using Mission Planner, QGroundControl, Gazebo, and other professional tools.</li>
            <li><strong>Mapping & Surveying:</strong> Create accurate 2D maps and 3D models using photogrammetry, flight planning, and post-processing tools like ArcGIS.</li>
            <li> <strong>Regulatory & Operational Mastery:</strong> Advanced understanding of DGCA/FAA/ICAO frameworks, BVLOS permissions, and safety protocols.</li>
          </ul>
          <h2>Why It Matters:</h2>
          <p>
            Drones are no longer just tools — they’re strategic assets. This course equips you to lead innovation across 
            defense, disaster management, precision agriculture, surveying, and smart city applications. 
            You’ll gain real-world skills, industry insights, and the confidence to operate, design, and deploy UAVs at a 
            professional level — unlocking opportunities in the fast-growing drone industry.
          </p>
        </div>
      )
    },
    'Advanced Training': {
      price: 14999,
      discount: 0,
      image: senior,
      seoContent: (
        <div>
          <p className="intro">
            Master the future of drones with our Advanced UAV Course — for engineers, pros, and enthusiasts. Dive into advanced aerodynamics, AI navigation, swarming, payloads, and mission planning. Build, optimize, and deploy high-performance UAVs for industrial missions using cutting-edge tech. Lead the way in precision drones and real-time operations.
          </p>
          <h2>What You’ll Learn:</h2>
          <ul className="learn-list">
            <li> <strong>Advanced Flight Dynamics:</strong> UAV stability, control algorithms, and environmental effects.</li>
            <li> <strong>Autonomous Systems:</strong> Programming GPS-based and vision-based navigation using ArduPilot/PX4 and ROS.</li>
            <li> <strong>Professional Drone Design:</strong> Configuring UAVs for heavy-lift, endurance, or multi-role missions with industry-grade components.</li>
            <li> <strong>Payload & Sensor Integration:</strong> Incorporating LiDAR, thermal cameras, multispectral sensors, and telemetry systems.</li>
            <li> <strong>Mission Planning & Simulation:</strong> Hands-on simulation classes using Mission Planner, QGroundControl, Gazebo, and other tools.</li>
            <li> <strong>Mapping & Surveying:</strong> Capture, process, and analyze drone data for accurate maps and models with tools like ArcGIS.</li>
            <li> <strong>Regulatory & Operational Mastery:</strong> Master DGCA/FAA/ICAO frameworks, BVLOS permissions, and safety protocols.</li>
          </ul>
          <h2>Why It Matters:</h2>
          <p>
            Drones are no longer just tools — they’re strategic assets. This course equips you to lead innovation across 
            defense, disaster management, precision agriculture, surveying, and smart city applications. 
            You’ll gain real-world skills, industry insights, and the confidence to operate, design, and deploy UAVs at a 
            professional level — unlocking opportunities in the fast-growing drone industry.
          </p>
        </div>
      )
    },
  };

  const handleEnroll = (courseName) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const courseDetails = courseMap[courseName];
    if (!courseDetails) {
      alert("Course details not found!");
      return;
    }

    const { price, discount, image } = courseDetails;
    const selected = {
      course: courseName,
      price,
      discount,
      image,
    };

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert("User not found. Please login again.");
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    if (price === 0) {
      fetch(`${process.env.REACT_APP_API_URL}/api/auth/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseName,
          price: 0,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("✅ Enrolled successfully!");
            navigate('/dashboard');
          } else if (data.message === "Already enrolled in this course") {
            alert("⚠️ You are already enrolled in this course.");
            navigate('/dashboard');
          } else {
            alert("❌ Enrollment failed. Please try again.");
          }
        })
        .catch(err => {
          console.error('Enrollment error:', err);
          alert("Something went wrong. Please try again.");
        });
    } else {
      localStorage.setItem('selectedCourse', JSON.stringify(selected));
      navigate('/payment');
    }
  };

  return (
    <section id="services" className="services">
      <h2>DRONE COURSE</h2>
      <p className="starting">
        ISAR is a premier institute providing innovative research and consultancy solutions to empower industries and academia. 
        We specialize in bridging the gap between research and practical applications.
      </p>
      <h3 className="sta">Fly High, Spend Low, Transform India from the sky</h3>

      <div className="about-grid">
        {Object.entries(courseMap).map(([course, { image, price, discount }], index) => {
          const isEnrolled = enrolledCourses.includes(course) || course === 'Junior High';

          return (
            <div className="c" data-aos="fade-up" key={index}>
              <img src={image} alt={course} />
              <div className="text">
                <h3>{course}</h3>
                <p>Price: ₹{price} | Discount: {discount}%</p>
                {course !== 'Junior High' && (
                  <button
                    className="enroll-btn"
                    onClick={() => handleEnroll(course)}
                    disabled={isEnrolled}
                    style={{
                      backgroundColor: isEnrolled ? '#ccc' : '#2B72FB',
                      cursor: isEnrolled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isEnrolled ? "✅ Enrolled" : "Enroll Now"}
                  </button>
                )}
                <button
                  className="syllabus-btn"
                  onClick={() => toggleDetails(course)}
                >
                  {visibleDetails === course ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleDetails && (
        <div className="syllabus-details-full">
          <h2>Course Details: {visibleDetails}</h2>
          <div>{courseMap[visibleDetails].seoContent}</div>
        </div>
      )}

      <Helmet>
        <title>INDIAN SCIENTIFIC AEROSPACE AND ROBOTICS</title>
        <meta name="description" content="Explore ISAR's professional training services in drone technology, robotics engineering, UAV design, and aerospace systems. Hands-on, certified, and student-friendly." />
        <meta name="keywords" content="drone training services, robotics workshop India, aerospace internship, ISAR services, UAV technology, drone training for students" />
      </Helmet>
    </section>
  );
};

export default Services;
