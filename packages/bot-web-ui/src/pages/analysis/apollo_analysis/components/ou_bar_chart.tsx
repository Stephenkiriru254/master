import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { api_base } from '@deriv/bot-skeleton';

const renderCustomizedLabel = (props:any) => {
    const { x, y, width, value } = props;
    return (
        <text x={x + width + 5} y={y + 10} fill='#666' textAnchor='start' fontSize={12}>
            {value}
        </text>
    );
};

const calculatePercentage = (arr:any[], over:number, under:number) => {
    const totalCount = arr.length;
    const overCount = arr.filter(item => item > over).length;
    const underCount = arr.filter(item => item < under).length;

    const overPercentage = (overCount / totalCount) * 100;
    const underPercentage = (underCount / totalCount) * 100;

    return [overPercentage, underPercentage];
};

interface OverUnderProps {
    overUnderList: Number[];
    overValue: number | string;
    underValue: number | string;
    is_mobile: boolean;
    isOverUnderOneClickActive: boolean;
    active_symbol: string;
    oneClickDuration: number;
    oneClickAmount: string | number;
    isTradeActive: boolean
    percentageValue: string | number;
    overUnderContract: string;
    isTradeActiveRef: React.MutableRefObject<boolean>
    setIsTradeActive: React.Dispatch<React.SetStateAction<boolean>>
}

const OverUnderBarChart = ({
    overUnderList,
    overValue,
    underValue,
    is_mobile,
    active_symbol,
    isOverUnderOneClickActive,
    oneClickAmount,
    oneClickDuration,
    isTradeActive,
    percentageValue,
    overUnderContract,
    setIsTradeActive,
    isTradeActiveRef
}:OverUnderProps) => {
    const [overPercentage, underPercentage] = calculatePercentage(
        overUnderList,
        Number(overValue),
        Number(underValue)
    );

    useEffect(() => {
        const buy_contract = (prediction:string) => {
            if (isOverUnderOneClickActive && !isTradeActive) {
                isTradeActiveRef.current = true
                setIsTradeActive(true);
                console.log('IS trade active status:',isTradeActive);
                api_base.api.send({
                    buy: '1',
                    price: oneClickAmount,
                    subscribe: 1,
                    parameters: {
                        amount: oneClickAmount,
                        basis: 'stake',
                        contract_type: overUnderContract,
                        currency: 'USD',
                        duration: oneClickDuration,
                        duration_unit: 't',
                        symbol: active_symbol,
                        barrier: prediction,
                    },
                });
                
            }
        };

        if (typeof percentageValue !== 'string' && overPercentage > percentageValue) {
            const prediction = overUnderContract === 'DIGITOVER' ? overValue.toString() : underValue.toString();
            buy_contract(prediction);
        }
    }, [overPercentage, underPercentage,isTradeActive,overUnderList]);

    const data = [
        {
            name: 'Over',
            percentage: +overPercentage.toFixed(2),
        },
        {
            name: 'Under',
            percentage: +underPercentage.toFixed(2),
        },
    ];

    const barColors = ['#4CAF50', '#F44336'];

    return (
        <ResponsiveContainer width='140%' height={211}>
            <BarChart
                width={100}
                height={211}
                data={data}
                layout='vertical'
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis type='category' dataKey='name' />
                <Tooltip />
                <Bar dataKey='percentage' fill='#8884d8' isAnimationActive={!is_mobile}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index]} />
                    ))}
                    <LabelList dataKey='percentage' content={renderCustomizedLabel} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default OverUnderBarChart;