import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";

const Home = () => {
  return (
    <main>
      <Hero />
    </main>
  );
};

export default Home;