import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { useState, useEffect, useContext, useRef } from "react";
import { Card, CardBody, CardTitle, Button } from "reactstrap";

import { AppContext } from "../../store/AppContext";
import { getPublishedVideos } from "../../Services";
import DetailsModal from "../../components/DetailsModal";

import "./home.scss";

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [settings, setSettings] = useState({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: null,
        slidesToScroll: 2
    });
    const dataRef = useRef([]);
    const categoriesRef = useRef([]);
    const isLoadingRef = useRef(false);
    const slidesToShowRef = useRef(null);
    const loadedCategoryRef = useRef([]);
    const { categories, userDetails } = useContext(AppContext);
    const [selectedId, setSelectedId] = useState(null);
    const [loadedCategory, setLoadedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const setCardsToDisplayPerPage = () => {
        const cardWidth = 400; // Width of Card + Margin
        const containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
        const itemPerScreen = Math.round(containerWidth/cardWidth);
        slidesToShowRef.current = itemPerScreen;
        setSettings({
            ...settings,
            slidesToShow: itemPerScreen
        });
    }

    const onCardClick = (item, activeCategory) => {
        setSelectedId(item);
        setSelectedCategory(activeCategory);
    };

    async function fetchData(cList, cName, slidesToDisplay = null) {
      let length = slidesToDisplay !== null ? slidesToDisplay + 2 : settings.slidesToShow + 2; // load 2 more buffer data, to have the slider effect.
      let response = await getPublishedVideos(cName, length);
      let categoryData = {
        category: cName,
        list: [
          ...response.items
        ]
      };
      setLoadedCategories([...cList, cName]);
      return categoryData;
    }

    const handleScroll = (e) => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight &&
        isLoadingRef.current === false &&
        loadedCategoryRef.current.length < categoriesRef.current.length) {
        isLoadingRef.current = true;

        setTimeout(() => {
          isLoadingRef.current = false;
        }, 5000);

        // Load next set of Data
        {
          let length = loadedCategoryRef.current.length;
          let alreadyLoaded = length > 0 ? loadedCategoryRef.current[length - 1] : '';
          if (alreadyLoaded !== '') {
            // Load the next 3 Categories
            let result = [...dataRef.current];
            let index = categoriesRef.current.findIndex((item) => item === alreadyLoaded);
            let newLoad = categoriesRef.current.slice(index + 1, length + 3);
            newLoad.forEach(async(item) => {
              let response = await fetchData(loadedCategoryRef.current, item, slidesToShowRef.current);
              loadedCategoryRef.current = [...loadedCategoryRef.current, item];
              result.push(response);
              dataRef.current = result;
              setData(result);
            });
          }
        }
      }
    }

    useEffect(() => {
      if (categories.length > 0 && loadedCategoryRef.current.length === 0 && settings.slidesToShow !== null) {
        let loadCategories = [...categories];
        let result = [];
        categoriesRef.current = categories;
        loadCategories.length = 3;
        if (loadedCategory.length === 0) {
          loadedCategoryRef.current = loadCategories;
          loadCategories.forEach(async(item) => {
            let response = await fetchData(loadedCategory, item);
            result.push(response);
            setData(result);
            dataRef.current = result;
          });
        }
      }
    }, [categories, settings.slidesToShow]);

    useEffect(() => {
        setCardsToDisplayPerPage();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', setCardsToDisplayPerPage);
        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', setCardsToDisplayPerPage);
        };
    }, []);

  const getSliderData = (cName) => {
    let filteredData = data.filter((item) => item.category === cName);
    if (filteredData.length > 0) {
      return filteredData[0];
    } 

    return null;
  };

  const loadMoreHandler = (view) => {
    navigate(`/category?type=${view}`, { state: {type: view} });
  };

  const onCloseHandler = () => {
    setSelectedId(null);
    setSelectedCategory(null);
  }

  return (
    <div className="home container">
      {selectedId !== null && <DetailsModal 
          id={selectedId.key}
          title={selectedId.videoName}
          content={selectedId.description}
          uploadedDate={selectedId.dateUploaded}
          onClose={onCloseHandler}
          isApproval={false}
          category={selectedCategory}
          isDeletable={userDetails?.role === "ADMIN"}
          selectVideo={onCardClick}
          />}
      { categories.map((cName) => {
        let cData = getSliderData(cName);
        if (cData) {
          return (<div className="category">
          <h6>{cData.category.toUpperCase()}</h6>
          <div className="category-list">
            <Slider {...settings}>
              {cData.list && cData.list.length > 0 ? cData.list.map((item) => (
                <Card
                  title={item.videoName}
                  style={{
                    width: "18rem",
                    cursor: "pointer"
                  }}
                  onClick={() => onCardClick(item, cData.category)}
                >
                  <img alt={item.videoName} src={item.imageKey} />
                  <CardBody onClick={() => onCardClick(item, cData.category)} title={item.videoName}>
                    <CardTitle tag="h5" title={item.videoName}>{item.videoName}</CardTitle>
                  </CardBody>
                </Card>
              )) :
                  <div className="no-record" style={{ height: "5rem"}}>No record found!</div>
              }
              { cData.list && cData.list.length > 0 && cData.list.length === (settings.slidesToShow + 2) ? 
                  <div className="load-more" onClick={() => loadMoreHandler(cData.category)}>
                    <HiDotsHorizontal/>
                    <Button>View all</Button>
                  </div>
                : null
              }
            </Slider>
          </div>
        </div>)
        }
      })
    }
    </div>
  );
};

export default Home;
