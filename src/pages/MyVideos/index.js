import React, { useEffect, useState, useContext } from 'react';
import { Nav, NavItem, NavLink, Card, CardBody, CardTitle } from 'reactstrap';

import { AppContext } from "../../store/AppContext";
import DetailsModal from "../../components/DetailsModal";
import CategoryList from "../../components/CategoryList";
import { getMyPublishedVideos, getMyUnPublishedVideos } from "../../Services";

import "./myVideos.scss";

const MyVideos = () => {
    const [data, setData] = useState([]);
    const { categories, userDetails } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchData = async(tab) => {
        let response = null;
        if (tab === 1) {
            response = await getMyPublishedVideos(selectedCategory);
        } else {
            response = await getMyUnPublishedVideos(selectedCategory);
        }

        if (response) {
            setData(response);
        }
    };

    useEffect(() => {
        selectedCategory === '' && categories.length > 0 && setSelectedCategory(categories[0]);
    }, [categories]);

    useEffect(() => {
        if (selectedCategory !== "") {
            (async () => {
                fetchData(activeTab);
              })();
        }
    }, [selectedCategory]);

    const onCardClick = (item) => {
        setSelectedId(item);
    };

    const onTabSwitch = (value) => {
        setActiveTab(value);
        setData([]);
        fetchData(value);
    };

    return (<div className="container">
        <CategoryList active={selectedCategory} onCategorySelection={setSelectedCategory} />
        {selectedId !== null && <DetailsModal 
            id={selectedId.key}
            title={selectedId.videoName}
            content={selectedId.description}
            uploadedDate={selectedId.dateUploaded}
            onClose={() => setSelectedId(null)}
            isApproval={false}
            category={selectedCategory}
            isDeletable={userDetails?.role === "USER" || userDetails?.role === "ADMIN"}
            />}
        <Nav tabs>
            <NavItem>
                <NavLink
                    className={activeTab === 1 ? "active" : ""}
                    onClick={() => onTabSwitch(1)}
                >
                    Approved Videos
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={activeTab === 2 ? "active" : ""}
                    onClick={() => onTabSwitch(2)}
                >
                    Un-approved videos
                </NavLink>
            </NavItem>
        </Nav>
        <div className="videos-container">
        {data.length > 0 && data.map((item) => <Card
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
        </div>
    </div>);
};

export default MyVideos;
