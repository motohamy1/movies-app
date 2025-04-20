import React from "react";

import PropTypes from 'prop-types';

const Search = ({searchTerm, setSearchTerm}) => {

Search.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired
};
  return (
    <div className="search">
      <div className="search-form">
        <img src="/search.svg" alt="" />
        <input type="text" placeholder="Search Movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
        <button type="submit">Search</button>
      </div>
    </div>
  );
};

export default Search;