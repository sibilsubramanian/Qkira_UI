import { AppContext } from "../../store/AppContext";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useEffect, useState, useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams, useNavigate } from 'react-router-dom';

import { getPublishedVideos } from "../../Services";
import DetailsModal from "../../components/DetailsModal";
import CategoryList from "../../components/CategoryList";

import "./category.scss";

const Category = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const { userDetails } = useContext(AppContext);
    const [selectedId, setSelectedId] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [itemsToLoad, setItemsToLoad] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(null);
    const [dataToLoadNext, setDataToLoadNext] = useState(null);

    const getCardsToDisplayPerPage = () => {
        const cardWidth = 350; // Width of Card + Margin
        const containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
        let itemPerRow = Math.round(containerWidth / cardWidth);
        itemPerRow = itemPerRow * 3;
        setTotalCount(itemPerRow);
        setItemsToLoad(itemPerRow);
    };

    useEffect(() => {
        getCardsToDisplayPerPage();
    }, []);

    useEffect(() => {
        (async () => {
            let loadedData = [...data];
            if (activeCategory !== null && activeCategory !== searchParams.get('type')) {
                loadedData = [];
            }

            if (itemsToLoad !== null) {
                setActiveCategory(searchParams.get('type'));
                let response = await getPublishedVideos(searchParams.get('type'), itemsToLoad);
                setData([...loadedData, ...response.items]);
                if (response?.lastEvaluatedKey) {
                    setTotalCount(totalCount + itemsToLoad);
                    setDataToLoadNext(response.lastEvaluatedKey);
                } else {
                    if (dataToLoadNext === null) {
                        setTotalCount(response.items.length);
                    } else {
                        setTotalCount(response.items.length + data.length);
                    }
                    setDataToLoadNext(null);
                }
    
            }
          })();
    }, [searchParams, itemsToLoad]);

    const fetchMoreData = async() => {
        let response = await getPublishedVideos(searchParams.get('type'), itemsToLoad, dataToLoadNext.key);
        setData([...data, ...response.items]);
        if (response?.lastEvaluatedKey) {
            setTotalCount(totalCount + itemsToLoad);
            setDataToLoadNext(response.lastEvaluatedKey);
        } else {
            if (dataToLoadNext === null) {
                setTotalCount(response.items.length);
            } else {
                setTotalCount(response.items.length + data.length);
            }
            setDataToLoadNext(null);
        }
    }

    const onCategorySelection = (view) => {
        navigate(`/category?type=${view}`, { state: {type: view} });
    };

    const onCardClick = (item) => {
        setSelectedId(item);
    };

    const getActiveCategory = () => {
        return searchParams.get('type');
    };

    return <div className="container">
        {selectedId !== null && <DetailsModal 
          id={selectedId.key}
          title={selectedId.videoName}
          content={selectedId.description}
          uploadedDate={selectedId.dateUploaded}
          isApproval={false}
          category={activeCategory}
          onClose={() => setSelectedId(null)}
          isDeletable={userDetails?.role === "ADMIN"}
          />}
        <CategoryList active={getActiveCategory()} onCategorySelection={onCategorySelection}/>
        <div className="content-container">
            <InfiniteScroll
                dataLength={totalCount}
                next={fetchMoreData}
                hasMore={totalCount > data.length}
                // loader={renderLoader()}
            >
            {data.map((item) => <Card
                  title={item.videoName}
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() => onCardClick(item)}
                >
                  <img alt={item.videoName} src={item.imageKey} />
                  <CardBody onClick={() => onCardClick(item)} title={item.videoName}>
                    <CardTitle tag="h5" title={item.videoName}>{item.videoName}</CardTitle>
                  </CardBody>
                </Card>)}
            {
                data.length === 0 ? <div className="no-records">No record found!</div> : null
            }
            </InfiniteScroll>
        </div>
    </div>
}

export default Category;
