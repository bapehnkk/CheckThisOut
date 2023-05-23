import {Component} from 'solid-js';

interface NumComponentProps {
    num: number;
}

const NumComponent: Component<NumComponentProps> = (props) => {

    const formatNum = (num: number): string => {
        const formatRules = [
            {limit: 1e9, symbol: 'b'},
            {limit: 1e6, symbol: 'm'},
            {limit: 1e3, symbol: 'k'},
        ];

        for (const rule of formatRules) {
            if (num >= rule.limit) {
                const res = (num / rule.limit).toFixed(1);
                return res.endsWith('.0') ? res.slice(0, -2) + rule.symbol : res + rule.symbol;
            }
        }
        return num.toString();
    };


    return (
        <div title={props.num.toString()}>{formatNum(props.num)}</div>
    );
}

export default NumComponent;
