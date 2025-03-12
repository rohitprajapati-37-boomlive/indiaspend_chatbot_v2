import React, { useState } from "react";
import SearchBar from "../components/SearchBar"; // Correct path
import Card from "./Card";
import "../styles/Home.css";

const mockData = [
  {
    title: "Impact of Climate Change",
    description: "Exploring how climate change is affecting local communities.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Inclusive Education",
    description: "The importance of inclusive education for all children.",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Mental Health Awareness",
    description: "Raising awareness about mental health issues worldwide.",
    image: "https://via.placeholder.com/150",
  },
];

const Home = () => {
  const [data, setData] = useState(mockData);

  const handleSearch = (query) => {
    const filteredData = mockData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setData(filteredData);
  };

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />
      <div className="card-container">
        {data.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            description={item.description}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
