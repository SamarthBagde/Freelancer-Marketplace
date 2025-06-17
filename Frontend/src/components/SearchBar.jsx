import axios from "axios";
import { useEffect, useState } from "react";
import style from "../style/SearchBar.module.css";

const SearchBar = ({ setData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/work/search?query=${searchTerm}`,
          { withCredentials: true }
        );
        setData(res.data.data.works);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    // Debounce logic: wait 300ms after the user stops typing
    const delayDebounce = setTimeout(() => {
      getData();
    }, 300);

    // Cleanup: clear previous timeout if user types again before 300ms
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, setData]);
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
