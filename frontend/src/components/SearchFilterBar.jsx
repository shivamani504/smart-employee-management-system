import { FaFilter, FaSearch } from "react-icons/fa";
import "../styles/searchFilters.css";

function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  resultCount,
}) {
  return (
    <div className="search-filter-bar">
      <div className="search-box">
        <FaSearch className="search-box-icon" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="filter-group">
        {filters.map((filter) => (
          <label className="filter-control" key={filter.name}>
            <span>
              <FaFilter />
              {filter.label}
            </span>
            <select
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
              aria-label={filter.label}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="result-count">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </div>
    </div>
  );
}

export default SearchFilterBar;
