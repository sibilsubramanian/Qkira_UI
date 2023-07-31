import { AppContext } from "../../store/AppContext";
import { useEffect, useState, useContext } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import "./categoryList.scss";

const CategoryList = (props) => {
    const toDisplay = 10;
    const [ cList, setCList] = useState([]);
    const [ isOpen, setOpen ] = useState(false);
    const { categories } = useContext(AppContext);
    const [ cDropdown, setCDropDown] = useState([]);

    useEffect(() => {
        if (categories.length > toDisplay) {
            setCList(categories.slice(0, toDisplay));
            setCDropDown(categories.slice(toDisplay, categories.length));
        } else {
            setCList(categories);
        }
    }, [categories]);

    const displayDropdown = () => {
        if ((cDropdown.length === 1 && cDropdown[0] === props.active) || cDropdown.length === 0) {
            return false;
        }

        return true;
    };

    const getDropdownOptions = () => {
        if (cDropdown.includes(props.active)) {
            return cDropdown.filter((item) => item !== props.active);
        }

        return cDropdown;
    };

    return <div className="c-list">
        <span>Available Categories:</span>
        {
            cList.map((item) => <div key={`category-item-${item}`} className={`c-name ${(item === props.active) ? 'active': ''}`} onClick={() => props.onCategorySelection(item)}>
                <div className='c-title'>{item}</div>
            </div>)
        }
        {
            cDropdown.includes(props.active) && <div key={`category-item-${props.active}`} className={'c-name active'}>
            <div className='c-title'>{props.active}</div>
        </div>
        }
        { displayDropdown() && <Dropdown
            isOpen={isOpen}
            toggle={() => setOpen(!isOpen)}
        >
            <DropdownToggle caret>
            {`+${getDropdownOptions().length} more`}
            </DropdownToggle>
            <DropdownMenu container="body">
                {
                    getDropdownOptions().map((item) => <DropdownItem key={`category-item-${item}`} onClick={() => props.onCategorySelection(item)}>{item}</DropdownItem>)
                }
            </DropdownMenu>
        </Dropdown>}
    </div>
};

export default CategoryList;
