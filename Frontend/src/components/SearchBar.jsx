import axios from "axios";
import { useEffect, useState } from "react";
import style from "../style/SearchBar.module.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/work/search?query=${searchTerm}`,
          { withCredentials: true }
        );
        console.log(res.data.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    if (searchTerm.length > 0) getData();
  }, [searchTerm]);
  return (
    <div className={style.searchBarContainer}>
      <input
        placeholder="Search work... "
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
