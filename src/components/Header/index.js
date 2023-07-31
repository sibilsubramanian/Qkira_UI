import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { ImHome } from "react-icons/im";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { RiAdminLine, RiPlayList2Fill, RiLoginCircleLine, RiLogoutCircleRLine } from "react-icons/ri";

import Search from "../Search";
import Logo from "../../images/ULogo.png";
import AddNewRecord from "../AddNewRecord";
import { AppContext } from "../../store/AppContext";
import { getUserInfo, getCategories, logout } from "../../Services";

import "./header.scss";

const Header = (props) => {
  const { isLoggedIn, setLoggedIn, userDetails, setUserDetails, categories, setCategories } = useContext(AppContext);
  const navigate = useNavigate();
  const [activePath, setPath] = useState("/home");
  const [isAddNewOpen, setAddNewOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const url = window.location.pathname;
  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const headerList = [
    {
      name: "Add New Record",
      path: null,
      isAdmin: false,
      logo:AiOutlineVideoCameraAdd
    },
    {
      name: "My Videos",
      path: "/videos",
      isAdmin: false,
      logo: RiPlayList2Fill
    },
    {
      name: "Admin",
      path: "/admin",
      isAdmin: true,
      logo: RiAdminLine
    },
    {
      name: "SignOut",
      path: "/",
      isAdmin: false,
      logo: RiLogoutCircleRLine
    },
  ];

  useEffect(() => {
    if ( isLoggedIn && userDetails === null ) {
      (async () => {
        const users = await getUserInfo();
        setUserDetails(users);
        generateAvatar(users.email);
      })();
    } else {
      userDetails?.email && generateAvatar(userDetails.email);
    }

    (async () => {
      const response = await getCategories();
      setCategories(response.categoryNames);
    })();
  }, []);

  useEffect(() => {
    userDetails?.email && generateAvatar(userDetails.email);
  }, [dropdownOpen]);

  const generateAvatar = (email) => {
    let avatar = createAvatar(initials, {
      seed: email
    });

    var container = document.getElementById("avatar-element");
    var dropdown = document.getElementById("avatar-element-drop-down");
    if (dropdown) dropdown.innerHTML = avatar.toJson().svg;
    if (container) container.innerHTML = avatar.toJson().svg;
  };

  const isPathActive = (path) => {
    return path === activePath;
  };

  const onNavigate = async(path, name) => {
    if (name === 'SignOut') {
      const response = await logout(userDetails.email);
      if(response.success) {
        setLoggedIn(false);
        setUserDetails(null);
      }
    }
    setPath(path);
  };

  const onAddNewClick = () => {
    setAddNewOpen(true);
  };

  const getOptions = () => {
    let options = [];

    if (userDetails?.email) {
        options.push(<div className='user-details'>
        <div id="avatar-element-drop-down"/>
        <div className="email">{userDetails.email}</div>
      </div>)
    }

    headerList.forEach((item) => {
      if (item.isAdmin && userDetails?.role === "ADMIN") {
         options.push(<DropdownItem><Link to={item.path} onClick={() => onNavigate(item.path, item.name)}><item.logo/>{item.name}</Link></DropdownItem>);
      } else {
        if (item.path === null) {
          options.push(<DropdownItem><a onClick={onAddNewClick}><item.logo/>{item.name}</a></DropdownItem>);
        } else {
          options.push(<DropdownItem><Link to={item.path} onClick={() => onNavigate(item.path, item.name)}><item.logo/>{item.name}</Link></DropdownItem>);
        }
      }
    });

    return options;
  };

  useEffect(() => {
    setPath(url);
  }, [url]);

  const onLogoClick = () => {
    onNavigate('/home');
    navigate('/home');
  }
  
  return ( 
    <div>
      <Navbar>
        <NavbarBrand onClick={onLogoClick}><img src={Logo}/></NavbarBrand>
        <Nav className="me-auto" navbar>
          <Search category={categories} />
          <div className='navlist-container'>
              { isLoggedIn && 
                <NavItem className={isLoggedIn ? 'logged-in' : ''}>
                  <NavLink className={isPathActive('/home') ? 'active' : ''}>
                      <Link to="/home"><ImHome/>Home</Link>
                  </NavLink>
                </NavItem>
              }
              { !isLoggedIn &&
                <>
                  { isPathActive('/category') ?
                    <NavItem>
                      <NavLink>
                        <Link to="/home"><ImHome/>Home</Link>
                      </NavLink>
                    </NavItem> : null
                  }
                  <NavItem>
                    <NavLink className={isPathActive('/login') ? 'active' : ''}>
                      <Link to="/login"><RiLoginCircleLine/>Login</Link>
                    </NavLink>
                  </NavItem>
                </>
              }
          </div>
          { isLoggedIn && <Dropdown className="user-dropdown" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret={false}>
              <div id="avatar-element"/>
            </DropdownToggle>
            <DropdownMenu className="header-dropdown">
              {getOptions()}
            </DropdownMenu>
          </Dropdown>}
        </Nav>
      </Navbar>
      { isAddNewOpen && <AddNewRecord close={() => setAddNewOpen(false)}/>}
      {props.children}
    </div>
  );
}

export default Header;
