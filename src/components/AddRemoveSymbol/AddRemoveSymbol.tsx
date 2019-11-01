import * as React from 'react';
import { classNames } from '@progress/kendo-react-common';
import { Button } from '@progress/kendo-react-buttons';
import { AutoComplete, DropDownList } from '@progress/kendo-react-dropdowns';
import { Popup } from '@progress/kendo-react-popup';
import { AddSymbol } from './AddSymbol';
import { dataService } from '../../services';
import styles from './add.module.scss';
import { SymbolsContext } from '../../context/SymbolsContext';
import { SectorContext, SECTOR } from '../../context/SectorContext';

export interface AddRemoveSymbolProps {
    className?: string;
}

const customItemRender = (el: any, value: any) => (
    <el.type
        {...el.props}
        className={classNames(styles["stock-item"], "container-fluid")}
    >
        <div className="row justify-content-between">
            <div className="col-6">
                <span className={styles['stock-item-symbol']}>{value.dataItem.symbol}</span>
                <span className={styles['stock-item-name']}>{value.dataItem.name}</span>
            </div>
            <div className="col-6 text-right m-auto">
                <span className={styles['stock-item-name']}>Equity - {value.dataItem["stock_exchange_short"]}</span>
            </div>
        </div>
    </el.type>)

const customValueRender = (el: any) => (
    <el.type
        {...el.props}
        className={classNames(el.props.className, "text-left pl-0")}
    >
        Add new
    </el.type>)

export const AddRemoveSymbol = (props: AddRemoveSymbolProps) => {
    const { sector } = React.useContext(SectorContext);
    const { symbols, onSymbolsChange, onSymbolsRemove } = React.useContext(SymbolsContext);
    const [allSymbols, setAllSymbols] = React.useState([]);

    const handleRemoveClick = React.useCallback(
        () => {
            if (onSymbolsRemove) {
                onSymbolsRemove.call(undefined);
            }
        },
        [onSymbolsRemove]
    )

    const fetchData = React.useCallback(
        async () => {
            const newData = await dataService.getSectorSymbol(sector);
            setAllSymbols(newData);
        },
        [sector]
    );

    const handleSymbolsAdd = React.useCallback(
        (event) => {
            if (onSymbolsChange) {
                const newSymbols = !symbols[sector].some((s: any) => s === event.target.value.symbol)
                    ? symbols[sector].concat([event.target.value.symbol])
                    : symbols[sector];

                onSymbolsChange.call(undefined, newSymbols)
            }
        },
        [onSymbolsChange, symbols, sector]
    )

    React.useEffect(() => { fetchData() }, [sector]);

    return (
        <div className={classNames(props.className)}>
            <DropDownList
                iconClassName="k-icon k-i-add k-icon-before"
                style={{ backgroundColor: 'white', width: "110px" }}
                className="dropdown-icon-before"
                value={null}
                onChange={handleSymbolsAdd}
                data={allSymbols}
                filterable={true}
                // onFilterChange={}
                popupSettings={{
                    width: '300px'
                }}
                valueRender={customValueRender}
                itemRender={customItemRender}
            >
                Add
                </DropDownList>
            &nbsp;
            <Button iconClass='k-icon k-i-delete' onClick={handleRemoveClick}>Remove</Button>

        </div>
    )
}