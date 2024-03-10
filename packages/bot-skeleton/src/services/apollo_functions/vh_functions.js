import { config } from '../../constants/config';
import { notify } from '../tradeEngine/utils/broadcast';
import dbot from '../../scratch/dbot';

// Custom Functions(When VH is active) --------------
export const handleLostValue = () => {
    if (config.vh_variables.max_steps === config.vh_variables.current_step) {
        config.vh_variables.is_enabled = false;
        config.vh_variables.current_step = 1;
    } else {
        config.vh_variables.is_enabled = true;
        config.vh_variables.current_step++;
    }
};

export const handleWinValue = () => {
    config.vh_variables.is_enabled = true;
    config.vh_variables.current_step = 1;
};

export const handleWonLiveStep = total_profit => {
    if (total_profit >= config.vh_variables.take_profit) {
        config.vh_variables.is_enabled = false;
        config.vh_variables.current_step = 1;
        config.vh_variables.current_trades_real = 0;
        config.vh_variables.is_martingale_active = false;
        config.vh_variables.mart_total_lost = 0;
        alert('Take Profit Hitted!!');
        // notify('success', 'Take Profit Hitted!!');
        dbot.stopBot();
    } else {
        config.vh_variables.current_trades_real++;
        config.vh_variables.is_enabled = false;
        config.vh_variables.mart_total_lost = 0;
        if (config.vh_variables.current_trades_real >= config.vh_variables.min_trades) {
            config.vh_variables.is_enabled = true;
            config.vh_variables.current_step = 1;
            config.vh_variables.current_trades_real = 0;
        }
    }
};

export const handleLostLiveStep = total_profit => {
    const sl = config.vh_variables.stop_loss * -1;
    if (total_profit <= sl) {
        config.vh_variables.is_enabled = false;
        config.vh_variables.current_step = 1;
        config.vh_variables.current_trades_real = 0;
        config.vh_variables.is_martingale_active = false;
        config.vh_variables.mart_total_lost = 0;
        alert('Stop Loss Hitted!!');
        dbot.stopBot();
    } else {
        config.vh_variables.current_trades_real++;
    }
};

export const calculateMartingale = profit => {
    const current_lost = Math.abs(profit);
    const newStake = current_lost * config.vh_variables.martingale;
    config.vh_variables.mart_stake = Math.round(newStake * 100) / 100;
};

// Custom Functions(When VH is Disabled)
export const calculateWonStatus = total_profit => {
    if (total_profit >= config.vh_variables.take_profit) {
        config.vh_variables.is_enabled = false;
        config.vh_variables.mart_total_lost = 0;
        notify('success', 'Take Profit Hitted!!');
        dbot.stopBot();
    } else {
        config.vh_variables.is_enabled = true;
        config.vh_variables.is_martingale_active = false;
        config.vh_variables.mart_total_lost = 0;
    }
};

export const calculateLostStatus = (profit, total_profit) => {
    const sl = config.vh_variables.stop_loss * -1;
    if (total_profit <= sl) {
        config.vh_variables.is_martingale_active = false;
        config.vh_variables.mart_total_lost = 0;
        alert('Stop Loss Hitted!!');
        dbot.stopBot();
    } else if (config.vh_variables.allow_martingale === true) {
        config.vh_variables.is_martingale_active = true;
        calculateMartingale(profit);
    }
};

export const resetMartingaleVars = () => {
    // Switching VH off incase its inactive
    config.vh_variables.is_enabled = false;
    config.vh_variables.current_step = 1;
    config.vh_variables.current_trades_real = 0;
    config.vh_variables.is_martingale_active = false;
    config.vh_variables.mart_total_lost = 0;
};
