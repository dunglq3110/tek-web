import React from 'react'
import About from '../components/About'
import Service from '../components/Service'
import Activities from '../components/Activities'
import Team from '../components/Team'
import Contact from '../components/Contact'
import MainSection from '../components/MainSection';


const Home = () => {
  return (
    <div>
      <MainSection />
      <Service />
      <Team />
      <Activities />
      <Contact />
    </div>
  );
};

export default Home;