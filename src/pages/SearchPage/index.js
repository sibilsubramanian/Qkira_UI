import React, { useEffect, useState, useContext } from 'react';
import { Card, CardBody, CardTitle, Spinner } from 'reactstrap';
import {useSearchParams} from "react-router-dom";
import { AppContext } from "../../store/AppContext";
import DetailsModal from "../../components/DetailsModal";
import { getSearchData } from "../../Services";
import "./search.scss";
const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const searchText = searchParams.get('search') || '';
    const { searchedResponse } = useContext(AppContext);
    const [selectedId, setSelectedId] = useState(null);
    const { userDetails, setSearchData } = useContext(AppContext);

    useEffect(() => {
        let debounceSearch;
        if(!searchText){
          setIsLoading(false);
        }
        setIsLoading(true);
        debounceSearch = setTimeout(async () =>{
          const searchedResponse = await getSearchData(searchText);
          setSearchData(searchedResponse);
          setIsLoading(false);
        }, 1000);
          return () => clearTimeout(debounceSearch);
    }, [searchText]);

    const onCardClick = (item) => {
        setSelectedId(item);
    };

    return (<div className="container">
        {selectedId && <DetailsModal 
            id={selectedId.key}
            title={selectedId.videoName}
            content={selectedId.description}
            uploadedDate={selectedId.dateUploaded}
            onClose={() => setSelectedId(null)}
            isApproval={false}
            category={selectedId.category}
            isDeletable={userDetails?.role === "ADMIN"}
            />}
        <div className="videos-container">
          { !searchedResponse.length && isLoading ? <div className="spinner"><Spinner/></div>: null }
        {searchedResponse.length > 0 ? searchedResponse.map((item, key) => <Card
            key={`${item.videoName}-${item.imageKey}`}
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
            </Card>):  !isLoading && <div className="no-records">No search results ...!!!</div>}
        </div>
    </div>);
};

export default SearchPage;
