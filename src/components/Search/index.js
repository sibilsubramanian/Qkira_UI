import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FiSearch } from "react-icons/fi";
import { Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import "./search.scss";

const Search = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchKey, setSearchKey] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(props.category[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

    const onChangeHandler = (e) => {
        setSearchKey(e.target.value);
        if (e.target.value === "") {
            navigate("/");
        } else {
            navigate(`/search-page?search=${e.target.value}`);
        }
    }

    const onCategorySelection = (index) => {
        setSearchKey("");
        setSelectedCategory(props.category[index]);
    }

    useEffect(() => {
        let search = location.search.split("=");
        if (search.length > 1 ) {
            // setSearchKey(decodeURIComponent(search[1]));
        } else {
            setSearchKey("");
        }
    }, []);

    useEffect(() => {
        let search = location.search.split("=");
        if (search.length > 1 ) {
            // setSearchKey(decodeURIComponent(search[1]));
        } else {
            setSearchKey("");
        }
    }, [location.pathname]);

    return <div className='search-container'>
        {/* <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret title={selectedCategory}>{selectedCategory}</DropdownToggle>
        <DropdownMenu>
            {
                props.category.map((item, index) => <DropdownItem onClick={() => onCategorySelection(index)}>{item}</DropdownItem>)
            }
        </DropdownMenu>
      </Dropdown> */}
      <FiSearch/>
      <Input type="search" value={searchKey} onChange={onChangeHandler} placeholder="Search for records..."/>
    </div>
};

export default Search;
