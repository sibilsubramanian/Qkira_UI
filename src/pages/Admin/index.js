import { ImBin } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useState, useEffect, useContext } from 'react';
import { Nav, NavItem, NavLink, Input, Button, Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';


import Modal from "../../components/Modal";
import { AppContext } from '../../store/AppContext';
import CategoryList from "../../components/CategoryList";
import DetailsModal from "../../components/DetailsModal";
import { getUnpublishedVideos, approveRecord, rejectRecord, createCategories, deleteCategory, getCategories } from "../../Services";

import './admin.scss';

const Admin = () => {
    const { userDetails } = useContext(AppContext);
    const [isAccept, setAcceptStatus] = useState(false);
    const [isReject, setRejectStatus] = useState(false);
    const [isConfirmationActive, setConfirmationStatus] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [newCategory, setNewCategory] = useState('');
    const { categories, setCategories } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [itemsToLoad, setItemsToLoad] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [dataToLoadNext, setDataToLoadNext] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

    const getCardsToDisplayPerPage = () => {
        const cardWidth = 350; // Width of Card + Margin
        const containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
        let itemPerRow = Math.round(containerWidth / cardWidth);
        itemPerRow = itemPerRow * 3;
        setTotalCount(itemPerRow);
        setItemsToLoad(itemPerRow);
    };

    const fetchData = async(loadedData) => {
        let response = await getUnpublishedVideos(selectedCategory, itemsToLoad);
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
    };

    useEffect(() => {
        selectedCategory === '' && categories.length > 0 && setSelectedCategory(categories[0]);
    }, [categories]);

    useEffect(() => {
        getCardsToDisplayPerPage();
    }, []);

    useEffect(() => {
        (async () => {
            let loadedData = [...data];
            if (activeCategory !== null && activeCategory !== selectedCategory) {
                loadedData = [];
            }

            if (itemsToLoad !== null) {
                setActiveCategory(selectedCategory);
                fetchData(loadedData);
            }
          })();
    }, [selectedCategory, itemsToLoad]);

    const fetchMoreData = async() => {
        let response = await getUnpublishedVideos(selectedCategory, itemsToLoad, dataToLoadNext.key);
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

    const onAcceptClick = () => {
        setAcceptStatus(true);
        setConfirmationStatus(true);
    };

    const onRejectClick = () => {
        setRejectStatus(true);
        setConfirmationStatus(true);
    };

    const getModalTitle = () => {
        if (isAccept) {
            return 'Confirm Acceptance';
        } else if (isReject) {
            return 'Confirm Rejection';
        } else {
            return '';
        }
    };

    const getModalContent = () => {
        if (isAccept) {
            return 'Are you sure you want to accept this request?';
        } else if (isReject) {
            return 'Are you sure you want to reject this request?'
        } else {
            return '';
        }
    };

    const onConfirm = async () => {
        if (isAccept) {
            await approveRecord({
                category: selectedCategory,
                key: selectedId.key
            });
        } else if (isReject) {
            await rejectRecord({
                category: selectedCategory,
                key: selectedId.key
            });
        }

        setSelectedId(null);
        fetchData([]);
        onClose();
    };

    const onClose = () => {
        setAcceptStatus(false);
        setRejectStatus(false);
        setConfirmationStatus(false);
    };

    const onAddNewCategory = async () => {
        let response = await createCategories({ categoryName: newCategory });
        if (response.categoryNames) {
            setNewCategory('')
            setCategories(response.categoryNames);
        }
    };

    const onDeleteCategory = async (name) => {
        let response = await deleteCategory({ categoryName: name });
        if ( response === "OK") {
            let data = await getCategories();
            setCategories(data.categoryNames);
        }
    };

    const onCardClick = (item) => {
        setSelectedId(item);
    };

    return (
        <div className='container'>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={activeTab === 1 ? "active" : ""}
                        onClick={() => setActiveTab(1)}
                    >
                        Videos pending for Approval
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === 2 ? "active" : ""}
                        onClick={() => setActiveTab(2)}
                    >
                        Create new Category
                    </NavLink>
                </NavItem>
            </Nav>
            {activeTab === 1 && <>
                {
                    isConfirmationActive && <Modal
                        className="confirmation"
                        title={getModalTitle()}
                        content={getModalContent()}
                        primary="Confirm"
                        secondary="Cancel"
                        primaryClick={onConfirm}
                        secondaryClick={onClose} />
                }
                {selectedId !== null && <DetailsModal 
                    id={selectedId.key}
                    title={selectedId.videoName}
                    content={selectedId.description}
                    uploadedDate={selectedId.dateUploaded}
                    onClose={() => setSelectedId(null)}
                    isApproval={true}
                    onAccept={onAcceptClick}
                    onReject={onRejectClick}
                    category={selectedCategory}
                    isDeletable={userDetails?.role === "ADMIN"}
                    />}
                <CategoryList active={selectedCategory} onCategorySelection={setSelectedCategory} />
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
            </>}
            {
                activeTab === 2 && <Container>
                    <Row>
                        <Col xs={7}>
                            <div className='available-category'>
                                <h5>Available Categories</h5>
                                <div className='category-list'>
                                    {categories.map((item) =>
                                        <div key={item}>
                                            {item}
                                            <ImBin
                                                title='Delete Category'
                                                onClick={() => onDeleteCategory(item)}
                                            />
                                        </div>)
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col xs={5}>
                            <div className='add-category'>
                                <h5>Add New</h5>
                                <Input
                                    type="text"
                                    name="addCategory"
                                    id="addCategory"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="New Category"
                                />
                                <Button disabled={newCategory === ""} className='add-action' color="primary" onClick={onAddNewCategory}>Add</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    );
}

export default Admin;
