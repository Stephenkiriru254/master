import React from 'react';
import { MdKeyboardArrowUp } from 'react-icons/md';
type DiffersBallType = {
    lastDigitList: number[];
    active_last: number;
};

const DiffersBalls = ({ lastDigitList, active_last }: DiffersBallType) => {
    const calculatePercentageAppearance = (numbers: number[]): Record<string, number> => {
        // Initialize an object to store the count of each number
        let counts: Record<string, number> = {};

        // Count the occurrences of each number in the array
        numbers.forEach(number => {
            counts[number] = (counts[number] || 0) + 1;
        });

        // Calculate the total number of elements in the array
        let totalNumbers = numbers.length;

        // Initialize an object to store the percentage appearance of each number
        let percentages: Record<string, number> = {};

        // Calculate the percentage appearance of each number
        for (let number in counts) {
            percentages[number] = (counts[number] / totalNumbers) * 100;
        }

        // Ensure that all numbers from 0 to 9 are included in the percentages object
        for (let i = 0; i <= 9; i++) {
            let numStr = i.toString();
            percentages[numStr] = percentages[numStr] || 0;
        }

        if (typeof document !== 'undefined') {
            highlightActiveBall(active_last);
            findMinMaxKeys(percentages);
        }

        return percentages;
    };

    const highlightActiveBall = (number: number) => {
        // Use querySelectorAll with type assertion to HTMLElement because querySelectorAll returns NodeList of Elements
        const progressBalls = document.querySelectorAll<HTMLElement>('.progress');
        // Use non-null assertion operator (!) for pointer as you're confident it won't be null
        const pointer = document.querySelector<HTMLElement>('.differs_pointer')!;

        progressBalls.forEach(ball => {
            ball.classList.remove('active');
            // Use the dataset property safely by ensuring ball is treated as HTMLElement
            if (parseInt(ball.dataset.number!) === number) {
                // Use non-null assertion for dataset properties
                ball.classList.add('active');
                const ballRect = ball.getBoundingClientRect();
                // pointer is already asserted to be non-null and HTMLElement, so offsetWidth and offsetHeight are valid
                const pointerWidth = pointer.offsetWidth;
                const pointerHeight = pointer.offsetHeight;
                const pointerX = ballRect.left + ballRect.width / 2 - pointerWidth / 2;
                const pointerY = ballRect.top + ballRect.height / 2 - pointerHeight / 2;

                // Adjust pointer position to account for scrolling
                const adjustedPointerX = pointerX + window.scrollX;
                const adjustedPointerY = pointerY + window.scrollY + 60;

                pointer.style.position = 'absolute';
                pointer.style.left = `${adjustedPointerX}px`;
                pointer.style.top = `${adjustedPointerY}px`;
            }
        });
    };

    const findMinMaxKeys = (input: Record<string, number>): { maxKey: string; minKey: string } => {
        let maxKey: string = '';
        let minKey: string = '';
        let maxValue: number = -Infinity;
        let minValue: number = Infinity;
        // Use querySelectorAll with type assertion to HTMLElement because querySelectorAll returns NodeList of Elements
        const progressBalls = document.querySelectorAll<HTMLElement>('.progress');

        for (const [key, value] of Object.entries(input)) {
            // Update max value and key
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
            // Update min value and key, ignoring zero values
            if (value < minValue && value > 0) {
                minValue = value;
                minKey = key;
            }
        }

        progressBalls.forEach(ball => {
            ball.classList.remove('top');
            ball.classList.remove('less');
            if (parseInt(ball.dataset.number!) === parseFloat(minKey)) {
                ball.classList.add('less');
            }

            if (parseInt(ball.dataset.number!) === parseFloat(maxKey)) {
                ball.classList.add('top');
            }
        });

        return { maxKey, minKey };
    };

    let percentages: Record<string, number> = calculatePercentageAppearance(lastDigitList);

    return (
        <div>
            <div className='differs_container'>
                <div className='progress top' data-number='0'>
                    <h3>0</h3>
                    <h4>
                        {percentages['0'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='1'>
                    <h3>1</h3>
                    <h4>
                        {percentages['1'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='2'>
                    <h3>2</h3>
                    <h4>
                        {percentages['2'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='3'>
                    <h3>3</h3>
                    <h4>
                        {percentages['3'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress less' data-number='4'>
                    <h3>4</h3>
                    <h4>
                        {percentages['4'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='5'>
                    <h3>5</h3>
                    <h4>
                        {percentages['5'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='6'>
                    <h3>6</h3>
                    <h4>
                        {percentages['6'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='7'>
                    <h3>7</h3>
                    <h4>
                        {percentages['7'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='8'>
                    <h3>8</h3>
                    <h4>
                        {percentages['8'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
                <div className='progress' data-number='9'>
                    <h3>9</h3>
                    <h4>
                        {percentages['9'].toFixed(2)}
                        <span>%</span>
                    </h4>
                </div>
            </div>

            <div className='differs_pointer'>
                <MdKeyboardArrowUp size={20} />
            </div>
        </div>
    );
};

export default DiffersBalls;
