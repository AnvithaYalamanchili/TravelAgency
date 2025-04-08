import React from "react";
import { motion } from "framer-motion";
import Layout from "./Layout";
import "./About.css"; // Ensure this file exists

const About = () => {
  return (
    <Layout>
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 } }
        transition={{ duration: 1 }}
      >
        <div className="overlay"></div>
        <div className="content">
          <h1 className="heading">About Us</h1>
          <p className="paragraph">
            At <strong>Voyagers</strong>, we believe exploration is a way of life. From uncovering hidden destinations to pushing the limits of discovery, we are here to inspire, guide, and empower adventurers worldwide.
          </p>
        </div>
      </motion.div>

      <section className="mission">
        <h2 className="subHeading">Our Mission</h2>
        <p className="paragraph">
          Our mission is to empower explorers by providing tools and guidance for life-changing journeys. We foster a community of curious minds eager to chart new paths.
        </p>
      </section>

      <section className="team">
        <h2 className="subHeading">Meet the Team</h2>
        <div className="teamMembers">
          {teamData.map((member, index) => (
            <motion.div
              key={index}
              className="teamMember"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img src={member.image} alt={member.name} className="teamImage" />
              <h3 className="teamName">{member.name}</h3>
              <p className="teamRole">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <h2 className="subHeading">What People Are Saying</h2>
        {testimonials.map((testimonial, index) => (
          <motion.p
            key={index}
            className="testimonial"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            "{testimonial.text}" - {testimonial.author}
          </motion.p>
        ))}
      </section>

      <section className="contact">
  <h2 className="subHeading">Contact Us</h2>
  <p className="paragraph">
    Have any questions? We'd love to hear from you! Reach out to us via email or follow us on our social channels.
  </p>
  <ul className="contactList">
    <li>Email: info@voyagers.com</li>
    <li>Instagram: @VoyagersOfficial</li>
  </ul>
</section>


      <section className="cta">
        <h2 className="ctaHeading">Join the Adventure</h2>
        <p className="ctaText">Are you ready to start your journey? Join us today and be part of the adventure!</p>
        <motion.button
          className="ctaButton"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Join Now
        </motion.button>
      </section>
      
    </Layout>
  );
};

const teamData = [
  { name: "Vaishnavi Kankanala", role: "Founder & CEO", image: './beach.jpg' },
  { name: "Narasimha Reddy Koduri", role: "Head of Operations", image: './cumber.jpg' },
  { name: "Anvitha Yalamanchili", role:"Creative Lead", image:'./tucson.jpg'}
];

const testimonials = [
  { text: "Voyagers helped me plan the adventure of a lifetime!", author: "Alex G." },
  { text: "An amazing team with a passion for exploration!", author: "Emma L." },
];

export default About;
